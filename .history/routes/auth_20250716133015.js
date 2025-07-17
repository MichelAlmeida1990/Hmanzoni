const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');

const router = express.Router();

// Middleware para verificar token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Token de acesso necessário'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'hotel-manzoni-secret', (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: 'Token inválido'
            });
        }
        req.user = user;
        next();
    });
};

// POST - Login
router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Buscar usuário
        const [users] = await pool.execute(`
            SELECT * FROM users WHERE email = ? AND is_active = TRUE
        `, [email]);

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Email ou senha incorretos'
            });
        }

        const user = users[0];

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Email ou senha incorretos'
            });
        }

        // Gerar token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET || 'hotel-manzoni-secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// POST - Registrar novo usuário (apenas admin)
router.post('/register', authenticateToken, [
    body('username').notEmpty().withMessage('Nome de usuário é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('role').isIn(['admin', 'manager', 'staff']).withMessage('Função inválida')
], async (req, res) => {
    try {
        // Verificar se é admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado. Apenas administradores podem criar usuários.'
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, email, password, role } = req.body;

        // Verificar se email já existe
        const [existing] = await pool.execute(`
            SELECT id FROM users WHERE email = ?
        `, [email]);

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Email já está em uso'
            });
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir usuário
        const [result] = await pool.execute(`
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `, [username, email, hashedPassword, role]);

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            data: { id: result.insertId }
        });

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET - Perfil do usuário
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.execute(`
            SELECT id, username, email, role, created_at 
            FROM users WHERE id = ?
        `, [req.user.id]);

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// PUT - Atualizar perfil
router.put('/profile', authenticateToken, [
    body('username').optional().notEmpty().withMessage('Nome de usuário não pode estar vazio'),
    body('email').optional().isEmail().withMessage('Email inválido')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, email } = req.body;
        const updates = [];
        const params = [];

        if (username !== undefined) {
            updates.push('username = ?');
            params.push(username);
        }

        if (email !== undefined) {
            // Verificar se email já existe
            const [existing] = await pool.execute(`
                SELECT id FROM users WHERE email = ? AND id != ?
            `, [email, req.user.id]);

            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Email já está em uso'
                });
            }

            updates.push('email = ?');
            params.push(email);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum campo para atualizar'
            });
        }

        params.push(req.user.id);

        await pool.execute(`
            UPDATE users 
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, params);

        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// PUT - Alterar senha
router.put('/change-password', authenticateToken, [
    body('current_password').notEmpty().withMessage('Senha atual é obrigatória'),
    body('new_password').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { current_password, new_password } = req.body;

        // Buscar usuário atual
        const [users] = await pool.execute(`
            SELECT password_hash FROM users WHERE id = ?
        `, [req.user.id]);

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        // Verificar senha atual
        const isValidPassword = await bcrypt.compare(current_password, users[0].password_hash);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                error: 'Senha atual incorreta'
            });
        }

        // Criptografar nova senha
        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        // Atualizar senha
        await pool.execute(`
            UPDATE users 
            SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [hashedNewPassword, req.user.id]);

        res.json({
            success: true,
            message: 'Senha alterada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// GET - Listar usuários (apenas admin)
router.get('/users', authenticateToken, async (req, res) => {
    try {
        // Verificar se é admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado. Apenas administradores podem listar usuários.'
            });
        }

        const [users] = await pool.execute(`
            SELECT id, username, email, role, is_active, created_at, updated_at
            FROM users 
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// PUT - Atualizar status do usuário (apenas admin)
router.put('/users/:id/status', authenticateToken, [
    body('is_active').isBoolean().withMessage('Status deve ser true ou false')
], async (req, res) => {
    try {
        // Verificar se é admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado. Apenas administradores podem alterar status de usuários.'
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const { is_active } = req.body;

        const [result] = await pool.execute(`
            UPDATE users 
            SET is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [is_active, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Status do usuário atualizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar status do usuário:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router; 