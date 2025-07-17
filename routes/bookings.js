const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { sendBookingConfirmation } = require('../services/emailService');

const router = express.Router();

// Gerar número único de reserva
function generateBookingNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `HM${timestamp}${random}`;
}

// Calcular preço total
function calculateTotalPrice(basePrice, nights, guests) {
    let total = basePrice * nights;
    
    // Desconto para estadias longas
    if (nights >= 7) {
        total *= 0.9; // 10% de desconto
    } else if (nights >= 3) {
        total *= 0.95; // 5% de desconto
    }
    
    return total;
}

// GET - Listar todas as reservas (admin)
router.get('/', async (req, res) => {
    try {
        const [bookings] = await pool.execute(`
            SELECT b.*, r.room_number, r.room_type
            FROM bookings b
            LEFT JOIN rooms r ON b.room_id = r.id
            ORDER BY b.created_at DESC
        `);
        
        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET - Buscar reserva por número
router.get('/:bookingNumber', async (req, res) => {
    try {
        const { bookingNumber } = req.params;
        
        const [bookings] = await pool.execute(`
            SELECT b.*, r.room_number, r.room_type
            FROM bookings b
            LEFT JOIN rooms r ON b.room_id = r.id
            WHERE b.booking_number = ?
        `, [bookingNumber]);
        
        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Reserva não encontrada'
            });
        }
        
        res.json({
            success: true,
            data: bookings[0]
        });
    } catch (error) {
        console.error('Erro ao buscar reserva:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// POST - Criar nova reserva
router.post('/', [
    body('guest_name').notEmpty().withMessage('Nome é obrigatório'),
    body('guest_email').isEmail().withMessage('Email inválido'),
    body('guest_phone').notEmpty().withMessage('Telefone é obrigatório'),
    body('checkin_date').isDate().withMessage('Data de entrada inválida'),
    body('checkout_date').isDate().withMessage('Data de saída inválida'),
    body('guests_count').isInt({ min: 1, max: 4 }).withMessage('Número de hóspedes inválido'),
    body('room_type').isIn(['simples', 'duplo', 'suite']).withMessage('Tipo de quarto inválido')
], async (req, res) => {
    try {
        // Validar dados
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            guest_name,
            guest_email,
            guest_phone,
            guest_cpf,
            checkin_date,
            checkout_date,
            guests_count,
            room_type,
            observations
        } = req.body;

        // Verificar se as datas são válidas
        const checkin = new Date(checkin_date);
        const checkout = new Date(checkout_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkin < today) {
            return res.status(400).json({
                success: false,
                error: 'Data de entrada não pode ser no passado'
            });
        }

        if (checkout <= checkin) {
            return res.status(400).json({
                success: false,
                error: 'Data de saída deve ser posterior à data de entrada'
            });
        }

        // Calcular número de noites
        const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

        // Buscar quarto disponível
        const [rooms] = await pool.execute(`
            SELECT r.* FROM rooms r
            WHERE r.room_type = ? 
            AND r.status = 'available'
            AND r.id NOT IN (
                SELECT DISTINCT b.room_id 
                FROM bookings b 
                WHERE b.status IN ('pending', 'confirmed')
                AND (
                    (b.checkin_date <= ? AND b.checkout_date > ?) OR
                    (b.checkin_date < ? AND b.checkout_date >= ?) OR
                    (b.checkin_date >= ? AND b.checkout_date <= ?)
                )
            )
            LIMIT 1
        `, [room_type, checkout, checkin, checkout, checkin, checkin, checkout]);

        if (rooms.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Não há quartos disponíveis para as datas selecionadas'
            });
        }

        const selectedRoom = rooms[0];

        // Calcular preço total
        const totalPrice = calculateTotalPrice(selectedRoom.base_price, nights, guests_count);

        // Gerar número da reserva
        const bookingNumber = generateBookingNumber();

        // Inserir reserva
        const [result] = await pool.execute(`
            INSERT INTO bookings (
                booking_number, room_id, guest_name, guest_email, guest_phone, 
                guest_cpf, checkin_date, checkout_date, guests_count, 
                total_price, observations
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            bookingNumber, selectedRoom.id, guest_name, guest_email, guest_phone,
            guest_cpf, checkin_date, checkout_date, guests_count, totalPrice, observations
        ]);

        // Buscar reserva criada
        const [newBooking] = await pool.execute(`
            SELECT b.*, r.room_number, r.room_type
            FROM bookings b
            LEFT JOIN rooms r ON b.room_id = r.id
            WHERE b.id = ?
        `, [result.insertId]);

        // Enviar email de confirmação
        const emailResult = await sendBookingConfirmation(newBooking[0]);
        if (!emailResult.success) {
            console.log('⚠️ Email não enviado:', emailResult.reason || emailResult.error);
        }

        res.status(201).json({
            success: true,
            message: 'Reserva criada com sucesso',
            data: {
                booking_number: bookingNumber,
                guest_name: guest_name,
                guest_email: guest_email,
                checkin_date: checkin_date,
                checkout_date: checkout_date,
                room_type: selectedRoom.room_type,
                guests_count: guests_count,
                total_price: totalPrice,
                nights: nights
            }
        });

    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// PUT - Atualizar status da reserva
router.put('/:bookingNumber/status', async (req, res) => {
    try {
        const { bookingNumber } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Status inválido'
            });
        }

        const [result] = await pool.execute(`
            UPDATE bookings 
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE booking_number = ?
        `, [status, bookingNumber]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Reserva não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Status da reserva atualizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// DELETE - Cancelar reserva
router.delete('/:bookingNumber', async (req, res) => {
    try {
        const { bookingNumber } = req.params;

        const [result] = await pool.execute(`
            UPDATE bookings 
            SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
            WHERE booking_number = ?
        `, [bookingNumber]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Reserva não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Reserva cancelada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router; 