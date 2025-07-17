const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hotel_manzoni',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Pool de conexões
const pool = mysql.createPool(dbConfig);

// Testar conexão
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão com banco de dados estabelecida');
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar com banco de dados:', error.message);
        process.exit(1);
    }
}

// Inicializar tabelas
async function initializeTables() {
    try {
        // Tabela de quartos
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS rooms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_number VARCHAR(10) UNIQUE NOT NULL,
                room_type ENUM('simples', 'duplo', 'suite') NOT NULL,
                base_price DECIMAL(10,2) NOT NULL,
                capacity INT NOT NULL,
                status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
                amenities TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Tabela de reservas
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                booking_number VARCHAR(20) UNIQUE NOT NULL,
                room_id INT,
                guest_name VARCHAR(100) NOT NULL,
                guest_email VARCHAR(100) NOT NULL,
                guest_phone VARCHAR(20) NOT NULL,
                guest_cpf VARCHAR(14),
                checkin_date DATE NOT NULL,
                checkout_date DATE NOT NULL,
                guests_count INT NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
                payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
                payment_method VARCHAR(50),
                observations TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
            )
        `);

        // Tabela de usuários (para painel admin)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Inserir dados iniciais
        await insertInitialData();
        
        console.log('✅ Tabelas inicializadas com sucesso');
    } catch (error) {
        console.error('❌ Erro ao inicializar tabelas:', error.message);
    }
}

// Inserir dados iniciais
async function insertInitialData() {
    try {
        // Verificar se já existem quartos
        const [rooms] = await pool.execute('SELECT COUNT(*) as count FROM rooms');
        
        if (rooms[0].count === 0) {
            // Inserir quartos de exemplo
            const roomsData = [
                { room_number: '101', room_type: 'simples', base_price: 120.00, capacity: 2 },
                { room_number: '102', room_type: 'simples', base_price: 120.00, capacity: 2 },
                { room_number: '201', room_type: 'duplo', base_price: 150.00, capacity: 2 },
                { room_number: '202', room_type: 'duplo', base_price: 150.00, capacity: 2 },
                { room_number: '301', room_type: 'suite', base_price: 250.00, capacity: 4 },
                { room_number: '302', room_type: 'suite', base_price: 250.00, capacity: 4 }
            ];

            for (const room of roomsData) {
                await pool.execute(`
                    INSERT INTO rooms (room_number, room_type, base_price, capacity, amenities)
                    VALUES (?, ?, ?, ?, ?)
                `, [
                    room.room_number,
                    room.room_type,
                    room.base_price,
                    room.capacity,
                    'Wi-Fi, TV, Ar condicionado, Banheiro privativo'
                ]);
            }
            console.log('✅ Quartos iniciais inseridos');
        }

        // Verificar se já existe usuário admin
        const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
        
        if (users[0].count === 0) {
            // Inserir usuário admin padrão
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await pool.execute(`
                INSERT INTO users (username, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            `, ['admin', 'admin@hotelmanzoni.com.br', hashedPassword, 'admin']);
            
            console.log('✅ Usuário admin criado (admin@hotelmanzoni.com.br / admin123)');
        }
    } catch (error) {
        console.error('❌ Erro ao inserir dados iniciais:', error.message);
    }
}

module.exports = {
    pool,
    testConnection,
    initializeTables
}; 