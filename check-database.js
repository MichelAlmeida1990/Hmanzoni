const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Senha123!',
        database: 'hotel_manzoni'
    });

    try {
        console.log('🔍 Verificando banco de dados...');
        
        // Verificar se o banco existe
        const [databases] = await connection.execute('SHOW DATABASES LIKE "hotel_manzoni"');
        if (databases.length === 0) {
            console.log('❌ Banco de dados hotel_manzoni não existe!');
            return;
        }
        console.log('✅ Banco de dados hotel_manzoni existe');

        // Verificar tabelas
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📋 Tabelas encontradas:');
        tables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
        });

        // Verificar dados nas tabelas
        if (tables.length > 0) {
            const [rooms] = await connection.execute('SELECT COUNT(*) as count FROM rooms');
            console.log(`📊 Quartos cadastrados: ${rooms[0].count}`);
            
            const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
            console.log(`👥 Usuários cadastrados: ${users[0].count}`);
        }

    } catch (error) {
        console.error('❌ Erro ao verificar banco:', error.message);
    } finally {
        await connection.end();
    }
}

checkDatabase(); 