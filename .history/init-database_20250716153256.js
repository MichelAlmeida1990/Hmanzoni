const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    // 1. Conectar sem banco para criar o banco de dados
    const connection1 = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Senha123!'
    });

    try {
        console.log('🔧 Inicializando banco de dados...');
        await connection1.execute('CREATE DATABASE IF NOT EXISTS hotel_manzoni');
        console.log('✅ Banco de dados hotel_manzoni criado/selecionado');
    } catch (error) {
        console.error('❌ Erro ao criar banco de dados:', error.message);
        await connection1.end();
        return;
    }
    await connection1.end();

    // 2. Conectar já usando o banco de dados
    const connection2 = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Senha123!',
        database: 'hotel_manzoni'
    });

    try {
        // Criar tabelas
        await connection2.execute(`
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
        console.log('✅ Tabela rooms criada');

        await connection2.execute(`
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
        console.log('✅ Tabela bookings criada');

        await connection2.execute(`
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
        console.log('✅ Tabela users criada');

        // Inserir dados iniciais
        const [rooms] = await connection2.execute('SELECT COUNT(*) as count FROM rooms');
        if (rooms[0].count === 0) {
            await connection2.execute(`
                INSERT INTO rooms (room_number, room_type, base_price, capacity, amenities) VALUES
                ('101', 'simples', 120.00, 2, 'Wi-Fi, TV, Ar condicionado, Banheiro privativo'),
                ('102', 'simples', 120.00, 2, 'Wi-Fi, TV, Ar condicionado, Banheiro privativo'),
                ('103', 'simples', 120.00, 2, 'Wi-Fi, TV, Ar condicionado, Banheiro privativo'),
                ('201', 'duplo', 150.00, 2, 'Wi-Fi, TV, Ar condicionado, Banheiro privativo, Vista para a cidade'),
                ('202', 'duplo', 150.00, 2, 'Wi-Fi, TV, Ar condicionado, Banheiro privativo, Vista para a cidade'),
                ('203', 'duplo', 150.00, 2, 'Wi-Fi, TV, Ar condicionado, Banheiro privativo, Vista para a cidade'),
                ('301', 'suite', 250.00, 4, 'Wi-Fi, TV, Ar condicionado, Banheiro privativo, Vista para a cidade, Sala de estar, Mini bar'),
                ('302', 'suite', 250.00, 4, 'Wi-Fi, TV, Ar condicionado, Banheiro privativo, Vista para a cidade, Sala de estar, Mini bar')
            `);
            console.log('✅ Dados iniciais inseridos na tabela rooms');
        }

        const [users] = await connection2.execute('SELECT COUNT(*) as count FROM users');
        if (users[0].count === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await connection2.execute(`
                INSERT INTO users (username, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            `, ['admin', 'admin@hotelmanzoni.com.br', hashedPassword, 'admin']);
            console.log('✅ Usuário admin criado (admin@hotelmanzoni.com.br / admin123)');
        }

        console.log('🎉 Banco de dados inicializado com sucesso!');
        console.log('📊 Você pode agora iniciar o servidor com: npm start');

    } catch (error) {
        console.error('❌ Erro ao inicializar tabelas/dados:', error.message);
    } finally {
        await connection2.end();
    }
}

// Executar se o arquivo for chamado diretamente
if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase }; 