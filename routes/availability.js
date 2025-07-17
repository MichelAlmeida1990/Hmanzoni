const express = require('express');
const { query, validationResult } = require('express-validator');
const { pool } = require('../config/database');

const router = express.Router();

// GET - Verificar disponibilidade
router.get('/', [
    query('checkin_date').isDate().withMessage('Data de entrada inválida'),
    query('checkout_date').isDate().withMessage('Data de saída inválida'),
    query('room_type').optional().isIn(['simples', 'duplo', 'suite']).withMessage('Tipo de quarto inválido')
], async (req, res) => {
    try {
        // Validar parâmetros
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { checkin_date, checkout_date, room_type } = req.query;

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

        // Buscar quartos disponíveis
        let query = `
            SELECT 
                r.id,
                r.room_number,
                r.room_type,
                r.base_price,
                r.capacity,
                r.amenities,
                ? as nights,
                (r.base_price * ?) as base_total,
                CASE 
                    WHEN ? >= 7 THEN (r.base_price * ? * 0.9)
                    WHEN ? >= 3 THEN (r.base_price * ? * 0.95)
                    ELSE (r.base_price * ?)
                END as total_price
            FROM rooms r
            WHERE r.status = 'available'
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
        `;

        let params = [
            nights, nights, nights, nights, nights, nights, nights,
            checkout, checkin, checkout, checkin, checkin, checkout
        ];

        // Filtrar por tipo de quarto se especificado
        if (room_type) {
            query += ' AND r.room_type = ?';
            params.push(room_type);
        }

        query += ' ORDER BY r.room_type, r.room_number';

        const [rooms] = await pool.execute(query, params);

        // Agrupar por tipo de quarto
        const availability = {
            checkin_date,
            checkout_date,
            nights,
            available_rooms: {
                simples: rooms.filter(r => r.room_type === 'simples'),
                duplo: rooms.filter(r => r.room_type === 'duplo'),
                suite: rooms.filter(r => r.room_type === 'suite')
            },
            summary: {
                total_available: rooms.length,
                simples_count: rooms.filter(r => r.room_type === 'simples').length,
                duplo_count: rooms.filter(r => r.room_type === 'duplo').length,
                suite_count: rooms.filter(r => r.room_type === 'suite').length
            }
        };

        res.json({
            success: true,
            data: availability
        });

    } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET - Calendário de disponibilidade (para um mês)
router.get('/calendar', [
    query('year').isInt({ min: 2024, max: 2030 }).withMessage('Ano inválido'),
    query('month').isInt({ min: 1, max: 12 }).withMessage('Mês inválido'),
    query('room_type').optional().isIn(['simples', 'duplo', 'suite']).withMessage('Tipo de quarto inválido')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { year, month, room_type } = req.query;

        // Gerar datas do mês
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const daysInMonth = endDate.getDate();

        const calendar = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month - 1, day);
            
            // Verificar disponibilidade para este dia
            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + 1);

            let query = `
                SELECT COUNT(*) as available_count
                FROM rooms r
                WHERE r.status = 'available'
                AND r.id NOT IN (
                    SELECT DISTINCT b.room_id 
                    FROM bookings b 
                    WHERE b.status IN ('pending', 'confirmed')
                    AND b.checkin_date <= ? 
                    AND b.checkout_date > ?
                )
            `;

            let params = [nextDay.toISOString().split('T')[0], currentDate.toISOString().split('T')[0]];

            if (room_type) {
                query += ' AND r.room_type = ?';
                params.push(room_type);
            }

            const [result] = await pool.execute(query, params);
            const availableCount = result[0].available_count;

            calendar.push({
                date: currentDate.toISOString().split('T')[0],
                day: day,
                available: availableCount > 0,
                available_count: availableCount
            });
        }

        res.json({
            success: true,
            data: {
                year: parseInt(year),
                month: parseInt(month),
                calendar: calendar
            }
        });

    } catch (error) {
        console.error('Erro ao gerar calendário:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET - Estatísticas de ocupação
router.get('/stats', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        let params = [];

        if (start_date && end_date) {
            dateFilter = 'WHERE b.checkin_date BETWEEN ? AND ?';
            params = [start_date, end_date];
        }

        // Estatísticas gerais
        const [stats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_bookings,
                SUM(total_price) as total_revenue,
                AVG(total_price) as avg_price,
                COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings
            FROM bookings b
            ${dateFilter}
        `, params);

        // Estatísticas por tipo de quarto
        const [roomStats] = await pool.execute(`
            SELECT 
                r.room_type,
                COUNT(b.id) as bookings_count,
                SUM(b.total_price) as revenue,
                AVG(b.total_price) as avg_price
            FROM rooms r
            LEFT JOIN bookings b ON r.id = b.room_id ${dateFilter ? 'AND ' + dateFilter.replace('WHERE', '') : ''}
            GROUP BY r.room_type
        `, params);

        // Taxa de ocupação
        const [occupancyStats] = await pool.execute(`
            SELECT 
                DATE(checkin_date) as date,
                COUNT(*) as bookings_count,
                (SELECT COUNT(*) FROM rooms) as total_rooms,
                ROUND((COUNT(*) / (SELECT COUNT(*) FROM rooms)) * 100, 2) as occupancy_rate
            FROM bookings b
            WHERE status = 'confirmed'
            ${dateFilter ? 'AND ' + dateFilter.replace('WHERE', '') : ''}
            GROUP BY DATE(checkin_date)
            ORDER BY date DESC
            LIMIT 30
        `, params);

        res.json({
            success: true,
            data: {
                general: stats[0],
                by_room_type: roomStats,
                occupancy: occupancyStats
            }
        });

    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router; 