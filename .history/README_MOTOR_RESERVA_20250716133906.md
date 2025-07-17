# 🏨 Motor de Reserva - Hotel Manzoni

## 🚀 Implementação Completa

Este projeto implementa um **motor de reserva completo** para o Hotel Manzoni, incluindo backend, frontend e todas as funcionalidades necessárias para um sistema de reservas online profissional.

## ✨ Funcionalidades Implementadas

### ✅ **Backend (Node.js + Express)**
- **API REST completa** para reservas
- **Banco de dados MySQL** com tabelas otimizadas
- **Sistema de autenticação** JWT para painel admin
- **Serviço de email** com templates HTML
- **Validação de dados** com express-validator
- **Rate limiting** e segurança
- **Logs e monitoramento**

### ✅ **Frontend (HTML/CSS/JavaScript)**
- **Formulário de reserva** responsivo
- **Verificação de disponibilidade** em tempo real
- **Cálculo automático de preços** com descontos
- **Validação de formulários** client-side
- **Interface moderna** com tema claro/escuro
- **Chatbot integrado** para suporte

### ✅ **Sistema de Email**
- **Confirmação de reserva** automática
- **Lembretes de check-in** programados
- **Cancelamentos** com notificação
- **Templates HTML** profissionais
- **Envio em lote** para lembretes

### ✅ **Painel Administrativo**
- **Dashboard** com estatísticas
- **Gestão de reservas** (criar, editar, cancelar)
- **Gestão de quartos** (adicionar, remover, preços)
- **Relatórios** de ocupação e receita
- **Sistema de usuários** com roles
- **Envio manual de emails**

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Driver de banco de dados
- **Nodemailer** - Serviço de email
- **JWT** - Autenticação
- **Bcryptjs** - Criptografia de senhas
- **Express-validator** - Validação de dados

### **Frontend**
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos e responsivos
- **JavaScript ES6+** - Lógica client-side
- **Fetch API** - Comunicação com backend

### **Banco de Dados**
- **MySQL** - Banco de dados relacional
- **Índices otimizados** para performance
- **Relacionamentos** entre tabelas
- **Backup automático** (configurável)

## 📦 Instalação

### **1. Pré-requisitos**
```bash
# Node.js (versão 16 ou superior)
node --version

# MySQL (versão 5.7 ou superior)
mysql --version

# Git (para clonar o repositório)
git --version
```

### **2. Clonar e Configurar**
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd hotel-manzoni

# Executar setup automático
node setup.js

# Ou configurar manualmente:
npm install
cp env.example .env
```

### **3. Configurar Banco de Dados**
```sql
-- Criar banco de dados
CREATE DATABASE hotel_manzoni;

-- Ou usar o setup automático que cria as tabelas
```

### **4. Configurar Variáveis de Ambiente**
```bash
# Editar arquivo .env
nano .env

# Configurações necessárias:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua-senha
DB_NAME=hotel_manzoni

EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
JWT_SECRET=sua-chave-secreta
```

### **5. Inicializar Banco de Dados**
```bash
# O servidor criará as tabelas automaticamente na primeira execução
npm run dev
```

## 🚀 Executando o Projeto

### **Desenvolvimento**
```bash
# Iniciar servidor backend
npm run dev

# Acessar APIs
http://localhost:3000/api/health
http://localhost:3000/api/bookings
http://localhost:3000/api/availability
```

### **Produção**
```bash
# Build e start
npm start

# Com PM2 (recomendado)
npm install -g pm2
pm2 start server.js --name "hotel-manzoni"
```

### **Frontend**
```bash
# Usar Live Server (VSCode) ou servidor local
# Acessar: http://localhost:5500/reservas.html
```

## 📊 Estrutura do Projeto

```
hotel-manzoni/
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── reservation.css          # Estilos do motor de reserva
│   │   └── ...
│   ├── 📁 js/
│   │   ├── reservation-engine.js    # Motor de reserva frontend
│   │   └── hotel-manzoni.js        # Scripts principais
│   └── 📁 images/
├── 📁 config/
│   └── database.js                  # Configuração do banco
├── 📁 routes/
│   ├── bookings.js                  # API de reservas
│   ├── availability.js              # API de disponibilidade
│   ├── rooms.js                     # API de quartos
│   ├── auth.js                      # API de autenticação
│   └── email.js                     # API de emails
├── 📁 services/
│   └── emailService.js              # Serviço de email
├── 📄 server.js                     # Servidor principal
├── 📄 package.json                  # Dependências
├── 📄 env.example                   # Exemplo de configuração
├── 📄 setup.js                      # Script de setup
├── 📄 reservas.html                 # Página de reservas
└── 📄 README_MOTOR_RESERVA.md      # Esta documentação
```

## 🔧 APIs Disponíveis

### **Reservas**
```http
POST /api/bookings                    # Criar reserva
GET /api/bookings                     # Listar reservas
GET /api/bookings/:number             # Buscar reserva
PUT /api/bookings/:number/status      # Atualizar status
DELETE /api/bookings/:number          # Cancelar reserva
```

### **Disponibilidade**
```http
GET /api/availability                 # Verificar disponibilidade
GET /api/availability/calendar        # Calendário de disponibilidade
GET /api/availability/stats           # Estatísticas
```

### **Quartos**
```http
GET /api/rooms                        # Listar quartos
POST /api/rooms                       # Criar quarto
PUT /api/rooms/:id                    # Atualizar quarto
DELETE /api/rooms/:id                 # Deletar quarto
GET /api/rooms/stats/overview         # Estatísticas
```

### **Autenticação**
```http
POST /api/auth/login                  # Login
GET /api/auth/profile                 # Perfil do usuário
PUT /api/auth/profile                 # Atualizar perfil
PUT /api/auth/change-password         # Alterar senha
```

### **Emails**
```http
POST /api/email/send-confirmation     # Enviar confirmação
POST /api/email/send-cancellation     # Enviar cancelamento
POST /api/email/send-reminder         # Enviar lembrete
GET /api/email/reminders              # Listar lembretes
```

## 🎯 Exemplos de Uso

### **Criar uma Reserva**
```javascript
const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        guest_name: 'João Silva',
        guest_email: 'joao@email.com',
        guest_phone: '(11) 99999-9999',
        checkin_date: '2024-01-15',
        checkout_date: '2024-01-17',
        guests_count: 2,
        room_type: 'duplo'
    })
});

const result = await response.json();
console.log(result.data.booking_number);
```

### **Verificar Disponibilidade**
```javascript
const response = await fetch('/api/availability?checkin_date=2024-01-15&checkout_date=2024-01-17&room_type=duplo');
const data = await response.json();
console.log(data.data.available_rooms.duplo);
```

## 🔒 Segurança

### **Implementado**
- ✅ **HTTPS/SSL** (configurável)
- ✅ **Rate limiting** (100 req/15min por IP)
- ✅ **Validação de entrada** (express-validator)
- ✅ **Sanitização de dados** (helmet)
- ✅ **JWT com expiração** (24h)
- ✅ **Senhas criptografadas** (bcrypt)
- ✅ **CORS configurado** (origem específica)

### **Recomendações para Produção**
- 🔒 **SSL Certificate** (Let's Encrypt)
- 🔒 **Firewall** (iptables/ufw)
- 🔒 **Backup automático** (cron jobs)
- 🔒 **Monitoramento** (PM2 + logs)
- 🔒 **Rate limiting** mais restritivo
- 🔒 **JWT secret** forte e único

## 📈 Monitoramento

### **Logs**
```bash
# Ver logs do servidor
tail -f logs/app.log

# Ver logs de erro
tail -f logs/error.log
```

### **Health Check**
```http
GET /api/health
```
Resposta:
```json
{
    "status": "OK",
    "timestamp": "2024-01-10T10:30:00.000Z",
    "uptime": 3600
}
```

## 🧪 Testes

### **Executar Testes**
```bash
npm test
```

### **Testes Manuais**
```bash
# Testar API de health
curl http://localhost:3000/api/health

# Testar criação de reserva
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"guest_name":"Teste","guest_email":"teste@email.com","guest_phone":"11999999999","checkin_date":"2024-01-15","checkout_date":"2024-01-17","guests_count":1,"room_type":"simples"}'
```

## 🚀 Deploy

### **VPS (DigitalOcean/AWS)**
```bash
# Instalar dependências
sudo apt update
sudo apt install nodejs npm mysql-server nginx

# Configurar MySQL
sudo mysql_secure_installation

# Configurar Nginx
sudo nano /etc/nginx/sites-available/hotel-manzoni

# Configurar PM2
npm install -g pm2
pm2 start server.js --name "hotel-manzoni"
pm2 startup
pm2 save
```

### **Hospedagem Compartilhada**
- Upload dos arquivos via FTP
- Configurar banco MySQL
- Configurar variáveis de ambiente
- Iniciar via SSH ou painel

## 📞 Suporte

### **Canais de Ajuda**
- 📧 **Email**: suporte@hotelmanzoni.com.br
- 📱 **WhatsApp**: (67) 3253-2000
- 💬 **Chat**: Integrado ao site

### **Logs de Debug**
```bash
# Ver logs detalhados
DEBUG=* npm run dev

# Ver logs de banco
DEBUG=mysql2 npm run dev
```

## 🎯 Próximos Passos

### **Fase 2: Pagamentos**
- [ ] Integração com PagSeguro
- [ ] Integração com MercadoPago
- [ ] Processamento de cartões
- [ ] Comprovantes de pagamento

### **Fase 3: Funcionalidades Avançadas**
- [ ] Sistema de promoções
- [ ] Gestão de ocupação
- [ ] Relatórios avançados
- [ ] API para terceiros

### **Fase 4: Mobile**
- [ ] App nativo (React Native)
- [ ] PWA (Progressive Web App)
- [ ] Notificações push

---

## 🎉 Conclusão

O motor de reserva está **100% funcional** e pronto para uso em produção. Todas as funcionalidades essenciais foram implementadas:

✅ **Backend completo** com APIs REST  
✅ **Frontend responsivo** com validações  
✅ **Sistema de email** automático  
✅ **Painel administrativo** funcional  
✅ **Banco de dados** otimizado  
✅ **Segurança** implementada  
✅ **Documentação** completa  

**🚀 O Hotel Manzoni agora tem um sistema de reservas profissional!** 