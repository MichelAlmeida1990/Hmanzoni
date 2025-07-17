const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Template de email de confirmação
function createBookingConfirmationEmail(booking) {
    const checkinDate = new Date(booking.checkin_date).toLocaleDateString('pt-BR');
    const checkoutDate = new Date(booking.checkout_date).toLocaleDateString('pt-BR');
    const totalPrice = booking.total_price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return {
        subject: `✅ Reserva Confirmada - Hotel Manzoni (${booking.booking_number})`,
        html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmação de Reserva - Hotel Manzoni</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #d4af37, #b8941f);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .content {
                        background: #f9f9f9;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .booking-details {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                        border-left: 4px solid #d4af37;
                    }
                    .booking-number {
                        background: #d4af37;
                        color: white;
                        padding: 10px;
                        border-radius: 5px;
                        font-weight: bold;
                        text-align: center;
                        margin: 20px 0;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 10px 0;
                        padding: 5px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .total-price {
                        font-size: 1.2em;
                        font-weight: bold;
                        color: #d4af37;
                        text-align: center;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f0f0f0;
                        border-radius: 5px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #666;
                    }
                    .contact-info {
                        background: #e8f4f8;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏨 Hotel Manzoni</h1>
                    <p>Confirmação de Reserva</p>
                </div>
                
                <div class="content">
                    <h2>Olá ${booking.guest_name}!</h2>
                    <p>Sua reserva foi confirmada com sucesso. Abaixo estão os detalhes:</p>
                    
                    <div class="booking-number">
                        Número da Reserva: ${booking.booking_number}
                    </div>
                    
                    <div class="booking-details">
                        <h3>📋 Detalhes da Reserva</h3>
                        
                        <div class="info-row">
                            <span><strong>Check-in:</strong></span>
                            <span>${checkinDate} às 14:00</span>
                        </div>
                        
                        <div class="info-row">
                            <span><strong>Check-out:</strong></span>
                            <span>${checkoutDate} às 12:00</span>
                        </div>
                        
                        <div class="info-row">
                            <span><strong>Quarto:</strong></span>
                            <span>${booking.room_type} - ${booking.room_number}</span>
                        </div>
                        
                        <div class="info-row">
                            <span><strong>Hóspedes:</strong></span>
                            <span>${booking.guests_count} pessoa(s)</span>
                        </div>
                        
                        <div class="info-row">
                            <span><strong>Noites:</strong></span>
                            <span>${Math.ceil((new Date(booking.checkout_date) - new Date(booking.checkin_date)) / (1000 * 60 * 60 * 24))} noite(s)</span>
                        </div>
                    </div>
                    
                    <div class="total-price">
                        Valor Total: ${totalPrice}
                    </div>
                    
                    <div class="contact-info">
                        <h3>📞 Informações de Contato</h3>
                        <p><strong>Telefone:</strong> (67) 3253-2000</p>
                        <p><strong>WhatsApp:</strong> (67) 3253-2000</p>
                        <p><strong>Email:</strong> contato@hotelmanzoni.com.br</p>
                        <p><strong>Endereço:</strong> Centro, Campo Grande - MS</p>
                    </div>
                    
                    <h3>📝 Informações Importantes</h3>
                    <ul>
                        <li>Apresente este email no check-in</li>
                        <li>Estacionamento incluso na diária</li>
                        <li>Wi-Fi gratuito disponível</li>
                        <li>Cancelamento gratuito até 24h antes do check-in</li>
                    </ul>
                    
                    <div class="footer">
                        <p>Obrigado por escolher o Hotel Manzoni!</p>
                        <p>Esperamos proporcionar uma estadia inesquecível.</p>
                        <p><small>Este é um email automático, não responda a este endereço.</small></p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

// Template de email de cancelamento
function createBookingCancellationEmail(booking) {
    return {
        subject: `❌ Reserva Cancelada - Hotel Manzoni (${booking.booking_number})`,
        html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cancelamento de Reserva - Hotel Manzoni</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: #e74c3c;
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .content {
                        background: #f9f9f9;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .cancellation-notice {
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏨 Hotel Manzoni</h1>
                    <p>Cancelamento de Reserva</p>
                </div>
                
                <div class="content">
                    <h2>Olá ${booking.guest_name}!</h2>
                    <p>Sua reserva foi cancelada conforme solicitado.</p>
                    
                    <div class="cancellation-notice">
                        <h3>📋 Detalhes do Cancelamento</h3>
                        <p><strong>Número da Reserva:</strong> ${booking.booking_number}</p>
                        <p><strong>Data do Cancelamento:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                    
                    <p>Esperamos vê-lo em uma próxima oportunidade!</p>
                    
                    <div class="footer">
                        <p>Para fazer uma nova reserva, acesse nosso site.</p>
                        <p><strong>Telefone:</strong> (67) 3253-2000</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

// Enviar email de confirmação de reserva
async function sendBookingConfirmation(booking) {
    try {
        const emailContent = createBookingConfirmationEmail(booking);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.guest_email,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de confirmação enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Erro ao enviar email de confirmação:', error);
        throw error;
    }
}

// Enviar email de cancelamento
async function sendBookingCancellation(booking) {
    try {
        const emailContent = createBookingCancellationEmail(booking);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.guest_email,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de cancelamento enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Erro ao enviar email de cancelamento:', error);
        throw error;
    }
}

// Enviar email de lembrete de check-in
async function sendCheckinReminder(booking) {
    try {
        const emailContent = {
            subject: `⏰ Lembrete de Check-in - Hotel Manzoni (${booking.booking_number})`,
            html: `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Lembrete de Check-in - Hotel Manzoni</title>
                </head>
                <body>
                    <h2>Olá ${booking.guest_name}!</h2>
                    <p>Lembramos que seu check-in está marcado para amanhã às 14:00.</p>
                    <p><strong>Número da Reserva:</strong> ${booking.booking_number}</p>
                    <p>Estamos ansiosos para recebê-lo!</p>
                </body>
                </html>
            `
        };
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.guest_email,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Lembrete de check-in enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Erro ao enviar lembrete de check-in:', error);
        throw error;
    }
}

// Testar conexão de email
async function testEmailConnection() {
    try {
        await transporter.verify();
        console.log('✅ Conexão de email configurada corretamente');
        return true;
    } catch (error) {
        console.error('❌ Erro na configuração de email:', error);
        return false;
    }
}

module.exports = {
    sendBookingConfirmation,
    sendBookingCancellation,
    sendCheckinReminder,
    testEmailConnection
}; 