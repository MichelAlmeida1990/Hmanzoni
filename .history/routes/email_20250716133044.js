const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendBookingConfirmation, sendBookingCancellation, sendCheckinReminder } = require('../services/emailService');
const { pool } = require('../config/database');

const router = express.Router();

// POST - Enviar email de confirmação manual
router.post('/send-confirmation', [
    body('booking_number').notEmpty().withMessage('Número da reserva é obrigatório')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { booking_number } = req.body;

        // Buscar reserva
        const [bookings] = await pool.execute(`
            SELECT b.*, r.room_number, r.room_type
            FROM bookings b
            LEFT JOIN rooms r ON b.room_id = r.id
            WHERE b.booking_number = ?
        `, [booking_number]);

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Reserva não encontrada'
            });
        }

        const booking = bookings[0];

        // Enviar email
        await sendBookingConfirmation(booking);

        res.json({
            success: true,
            message: 'Email de confirmação enviado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao enviar email de confirmação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// POST - Enviar email de cancelamento manual
router.post('/send-cancellation', [
    body('booking_number').notEmpty().withMessage('Número da reserva é obrigatório')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { booking_number } = req.body;

        // Buscar reserva
        const [bookings] = await pool.execute(`
            SELECT b.*, r.room_number, r.room_type
            FROM bookings b
            LEFT JOIN rooms r ON b.room_id = r.id
            WHERE b.booking_number = ?
        `, [booking_number]);

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Reserva não encontrada'
            });
        }

        const booking = bookings[0];

        // Enviar email
        await sendBookingCancellation(booking);

        res.json({
            success: true,
            message: 'Email de cancelamento enviado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao enviar email de cancelamento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// POST - Enviar lembrete de check-in
router.post('/send-reminder', [
    body('booking_number').notEmpty().withMessage('Número da reserva é obrigatório')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { booking_number } = req.body;

        // Buscar reserva
        const [bookings] = await pool.execute(`
            SELECT b.*, r.room_number, r.room_type
            FROM bookings b
            LEFT JOIN rooms r ON b.room_id = r.id
            WHERE b.booking_number = ?
        `, [booking_number]);

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Reserva não encontrada'
            });
        }

        const booking = bookings[0];

        // Verificar se o check-in é amanhã
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const checkinDate = new Date(booking.checkin_date);

        if (checkinDate.toDateString() !== tomorrow.toDateString()) {
            return res.status(400).json({
                success: false,
                error: 'Lembrete só pode ser enviado para reservas com check-in amanhã'
            });
        }

        // Enviar email
        await sendCheckinReminder(booking);

        res.json({
            success: true,
            message: 'Lembrete de check-in enviado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao enviar lembrete de check-in:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET - Listar reservas que precisam de lembretes
router.get('/reminders', async (req, res) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        // Buscar reservas com check-in amanhã
        const [bookings] = await pool.execute(`
            SELECT b.*, r.room_number, r.room_type
            FROM bookings b
            LEFT JOIN rooms r ON b.room_id = r.id
            WHERE b.checkin_date = ? 
            AND b.status = 'confirmed'
            ORDER BY b.guest_name
        `, [tomorrowStr]);

        res.json({
            success: true,
            data: {
                date: tomorrowStr,
                bookings: bookings,
                count: bookings.length
            }
        });

    } catch (error) {
        console.error('Erro ao buscar lembretes:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// POST - Enviar lembretes em lote
router.post('/send-batch-reminders', async (req, res) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        // Buscar reservas com check-in amanhã
        const [bookings] = await pool.execute(`
            SELECT b.*, r.room_number, r.room_type
            FROM bookings b
            LEFT JOIN rooms r ON b.room_id = r.id
            WHERE b.checkin_date = ? 
            AND b.status = 'confirmed'
        `, [tomorrowStr]);

        const results = {
            total: bookings.length,
            sent: 0,
            failed: 0,
            errors: []
        };

        // Enviar emails
        for (const booking of bookings) {
            try {
                await sendCheckinReminder(booking);
                results.sent++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    booking_number: booking.booking_number,
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            message: `Lembretes enviados: ${results.sent} sucessos, ${results.failed} falhas`,
            data: results
        });

    } catch (error) {
        console.error('Erro ao enviar lembretes em lote:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET - Estatísticas de emails
router.get('/stats', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        let params = [];

        if (start_date && end_date) {
            dateFilter = 'WHERE b.created_at BETWEEN ? AND ?';
            params = [start_date, end_date];
        }

        // Estatísticas de reservas por status
        const [bookingStats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_bookings,
                COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
            FROM bookings b
            ${dateFilter}
        `, params);

        // Reservas que precisam de lembretes
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const [reminderStats] = await pool.execute(`
            SELECT COUNT(*) as need_reminders
            FROM bookings 
            WHERE checkin_date = ? AND status = 'confirmed'
        `, [tomorrowStr]);

        res.json({
            success: true,
            data: {
                bookings: bookingStats[0],
                reminders: reminderStats[0]
            }
        });

    } catch (error) {
        console.error('Erro ao buscar estatísticas de email:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router; 