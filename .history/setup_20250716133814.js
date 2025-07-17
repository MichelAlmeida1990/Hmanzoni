#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando Motor de Reserva - Hotel Manzoni\n');

// Verificar se Node.js está instalado
try {
    const nodeVersion = process.version;
    console.log(`✅ Node.js ${nodeVersion} detectado`);
} catch (error) {
    console.error('❌ Node.js não está instalado. Por favor, instale o Node.js primeiro.');
    process.exit(1);
}

// Verificar se o arquivo .env existe
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('📝 Criando arquivo .env...');
    const envExample = fs.readFileSync(path.join(__dirname, 'env.example'), 'utf8');
    fs.writeFileSync(envPath, envExample);
    console.log('✅ Arquivo .env criado. Por favor, configure as variáveis de ambiente.');
} else {
    console.log('✅ Arquivo .env já existe');
}

// Instalar dependências
console.log('\n📦 Instalando dependências...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas com sucesso');
} catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
    process.exit(1);
}

// Verificar se MySQL está rodando
console.log('\n🗄️ Verificando conexão com banco de dados...');
try {
    // Tentar conectar com o banco (assumindo que MySQL está rodando)
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });
    
    console.log('✅ Conexão com MySQL estabelecida');
    
    // Criar banco de dados se não existir
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'hotel_manzoni'}`);
    console.log('✅ Banco de dados criado/verificado');
    
    await connection.end();
} catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error.message);
    console.log('💡 Certifique-se de que o MySQL está instalado e rodando');
    console.log('💡 Configure as variáveis de banco de dados no arquivo .env');
}

console.log('\n🎯 Setup concluído!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure as variáveis de ambiente no arquivo .env');
console.log('2. Inicie o servidor: npm run dev');
console.log('3. Acesse: http://localhost:3000/api/health');
console.log('4. Para testar o frontend: http://localhost:5500/reservas.html');
console.log('\n🔧 Comandos úteis:');
console.log('- npm run dev (desenvolvimento)');
console.log('- npm start (produção)');
console.log('- npm test (testes)'); 