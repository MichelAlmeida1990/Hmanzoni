const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');

const router = express.Router();

// GET - Listar todos os quartos
router.get('/', async (req, res) => {
    try {
        const [rooms] = await pool.execute(`
            SELECT * FROM rooms 
            ORDER BY room_type, room_number
        `);
        
        res.json({
            success: true,
            data: rooms
        });
    } catch (error) {
        console.error('Erro ao buscar quartos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET - Buscar quarto por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rooms] = await pool.execute(`
            SELECT * FROM rooms WHERE id = ?
        `, [id]);
        
        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Quarto não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: rooms[0]
        });
    } catch (error) {
        console.error('Erro ao buscar quarto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// POST - Criar novo quarto
router.post('/', [
    body('room_number').notEmpty().withMessage('Número do quarto é obrigatório'),
    body('room_type').isIn(['simples', 'duplo', 'suite']).withMessage('Tipo de quarto inválido'),
    body('base_price').isFloat({ min: 0 }).withMessage('Preço base inválido'),
    body('capacity').isInt({ min: 1, max: 6 }).withMessage('Capacidade inválida')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { room_number, room_type, base_price, capacity, amenities } = req.body;

        // Verificar se o número do quarto já existe
        const [existing] = await pool.execute(`
            SELECT id FROM rooms WHERE room_number = ?
        `, [room_number]);

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Número do quarto já existe'
            });
        }

        // Inserir novo quarto
        const [result] = await pool.execute(`
            INSERT INTO rooms (room_number, room_type, base_price, capacity, amenities)
            VALUES (?, ?, ?, ?, ?)
        `, [room_number, room_type, base_price, capacity, JSON.stringify(amenities || [])]);

        res.status(201).json({
            success: true,
            message: 'Quarto criado com sucesso',
            data: { id: result.insertId }
        });

    } catch (error) {
        console.error('Erro ao criar quarto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// PUT - Atualizar quarto
router.put('/:id', [
    body('room_type').optional().isIn(['simples', 'duplo', 'suite']).withMessage('Tipo de quarto inválido'),
    body('base_price').optional().isFloat({ min: 0 }).withMessage('Preço base inválido'),
    body('capacity').optional().isInt({ min: 1, max: 6 }).withMessage('Capacidade inválida')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const { room_type, base_price, capacity, amenities, status } = req.body;

        // Verificar se o quarto existe
        const [existing] = await pool.execute(`
            SELECT id FROM rooms WHERE id = ?
        `, [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Quarto não encontrado'
            });
        }

        // Construir query de atualização
        const updates = [];
        const params = [];

        if (room_type !== undefined) {
            updates.push('room_type = ?');
            params.push(room_type);
        }

        if (base_price !== undefined) {
            updates.push('base_price = ?');
            params.push(base_price);
        }

        if (capacity !== undefined) {
            updates.push('capacity = ?');
            params.push(capacity);
        }

        if (amenities !== undefined) {
            updates.push('amenities = ?');
            params.push(JSON.stringify(amenities));
        }

        if (status !== undefined) {
            updates.push('status = ?');
            params.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum campo para atualizar'
            });
        }

        params.push(id);

        const [result] = await pool.execute(`
            UPDATE rooms 
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, params);

        res.json({
            success: true,
            message: 'Quarto atualizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar quarto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// DELETE - Deletar quarto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se há reservas ativas para este quarto
        const [bookings] = await pool.execute(`
            SELECT id FROM bookings 
            WHERE room_id = ? AND status IN ('pending', 'confirmed')
        `, [id]);

        if (bookings.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Não é possível deletar um quarto com reservas ativas'
            });
        }

        const [result] = await pool.execute(`
            DELETE FROM rooms WHERE id = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Quarto não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Quarto deletado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar quarto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET - Estatísticas dos quartos
router.get('/stats/overview', async (req, res) => {
    try {
        // Total de quartos por tipo
        const [roomTypes] = await pool.execute(`
            SELECT 
                room_type,
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
                COUNT(CASE WHEN status = 'occupied' THEN 1 END) as occupied,
                COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance
            FROM rooms 
            GROUP BY room_type
        `);

        // Preço médio por tipo
        const [avgPrices] = await pool.execute(`
            SELECT 
                room_type,
                AVG(base_price) as avg_price,
                MIN(base_price) as min_price,
                MAX(base_price) as max_price
            FROM rooms 
            GROUP BY room_type
        `);

        // Ocupação atual
        const [currentOccupancy] = await pool.execute(`
            SELECT 
                COUNT(*) as total_rooms,
                COUNT(CASE WHEN status = 'available' THEN 1 END) as available_rooms,
                ROUND((COUNT(CASE WHEN status = 'available' THEN 1 END) / COUNT(*)) * 100, 2) as occupancy_rate
            FROM rooms
        `);

        res.json({
            success: true,
            data: {
                room_types: roomTypes,
                pricing: avgPrices,
                occupancy: currentOccupancy[0]
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