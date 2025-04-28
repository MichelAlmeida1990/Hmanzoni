// Espera o DOM ser carregado completamente
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }, 2000);

    // Toggle do menu mobile
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Botão de voltar ao topo
    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Toggle do tema
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        
        // Salva a preferência do usuário
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
        }
    });
    
    // Verifica se há uma preferência salva
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    }

    // Lightbox para a galeria
    const galleryLinks = document.querySelectorAll('.gallery-link');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    galleryLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const imgSrc = this.getAttribute('href');
            const imgAlt = this.querySelector('img').getAttribute('alt');
            
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    lightboxClose.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Chatbot
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbot = document.getElementById('chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    
    chatbotToggle.addEventListener('click', function() {
        chatbot.classList.toggle('active');
    });
    
    function sendMessage() {
        const message = chatbotInput.value.trim();
        
        if (message !== '') {
            // Adiciona a mensagem do usuário
            addMessage('user', message);
            
            // Limpa o input
            chatbotInput.value = '';
            
            // Simula uma resposta do bot após 1 segundo
            setTimeout(function() {
                const botResponse = getBotResponse(message);
                addMessage('bot', botResponse);
                
                // Rola para o final da conversa
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
    }
    
    chatbotSend.addEventListener('click', sendMessage);
    
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatbotMessages.appendChild(messageDiv);
        
        // Rola para o final da conversa
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function getBotResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('reserva') || message.includes('reservar') || message.includes('quarto')) {
            return 'Para fazer uma reserva, por favor entre em contato pelo telefone (11) 3456-7890 ou preencha o formulário na seção de contato.';
        } else if (message.includes('preço') || message.includes('valor') || message.includes('custo')) {
            return 'Nossos preços variam de R$ 180,00 a R$ 350,00 dependendo do tipo de quarto e da temporada.';
        } else if (message.includes('check-in') || message.includes('entrada')) {
            return 'Nosso horário de check-in é a partir das 14h.';
        } else if (message.includes('check-out') || message.includes('saída')) {
            return 'Nosso horário de check-out é até às 12h.';
        } else if (message.includes('café') || message.includes('refeição') || message.includes('comida')) {
            return 'Oferecemos café da manhã completo incluso em todas as diárias, servido das 6h às 10h.';
        } else if (message.includes('localização') || message.includes('endereço') || message.includes('onde')) {
            return 'Estamos localizados na Rua das Flores, 123 - Centro.';
        } else if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
            return 'Olá! Como posso ajudar você hoje?';
        } else {
            return 'Não entendi sua pergunta. Pode reformular ou perguntar sobre reservas, preços, horários de check-in/check-out, café da manhã ou nossa localização.';
        }
    }

    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui você adicionaria o código para enviar o formulário
            // Como é apenas uma demonstração, vamos simular um envio bem-sucedido
            
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }

    // Animação de elementos ao rolar a página
    const elementsToAnimate = document.querySelectorAll('.section-title, .accommodation-card, .service-card, .gallery-item');
    
    function checkScroll() {
        elementsToAnimate.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('fade-in');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verifica elementos visíveis no carregamento inicial
});
