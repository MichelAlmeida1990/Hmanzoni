/**
 * Hotel Manzoni - Script Principal
 * Versão: 1.0.0
 * Data: 2025-04-28
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do site
    console.log('Hotel Manzoni JS inicializado com sucesso!');
    
    // ======= SELETORES PRINCIPAIS =======
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const themeButton = document.getElementById('theme-button');
    const body = document.body;
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotForm = document.querySelector('.chatbot-form');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const backToTop = document.querySelector('.back-to-top');
    const preloader = document.querySelector('.preloader');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // ======= PRELOADER =======
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('preloader-hidden');
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
    
    // ======= MENU MOBILE =======
    if (mobileMenuToggle && nav) {
        // Configuração inicial
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
        
        // Evento de clique no botão do menu
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle das classes
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Acessibilidade
            const expanded = nav.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', expanded);
            nav.setAttribute('aria-hidden', !expanded);
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                e.target !== mobileMenuToggle && 
                !mobileMenuToggle.contains(e.target)) {
                
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Acessibilidade
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                nav.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Acessibilidade
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                nav.setAttribute('aria-hidden', 'true');
            });
        });
    }
    
    // ======= TEMA ESCURO/CLARO =======
    if (themeButton) {
        // Verificar preferência salva
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeButton.textContent = 'Tema Claro';
        } else {
            themeButton.textContent = 'Tema Escuro';
        }
        
        themeButton.addEventListener('click', function() {
            body.classList.toggle('dark-theme');
            
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                themeButton.textContent = 'Tema Claro';
            } else {
                localStorage.setItem('theme', 'light');
                themeButton.textContent = 'Tema Escuro';
            }
        });
    }
    
    // ======= CHATBOT =======
    if (chatbotIcon && chatbotContainer && chatbotClose) {
        // Abrir chatbot
        chatbotIcon.addEventListener('click', function() {
            chatbotContainer.classList.add('active');
            chatbotContainer.setAttribute('aria-hidden', 'false');
            chatbotIcon.style.display = 'none';
        });
        
        // Fechar chatbot
        chatbotClose.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
            chatbotContainer.setAttribute('aria-hidden', 'true');
            chatbotIcon.style.display = 'flex';
        });
        
        // Processar mensagens
        if (chatbotForm) {
            chatbotForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const input = this.querySelector('input');
                const message = input.value.trim();
                
                if (message) {
                    // Adicionar mensagem do usuário
                    addMessage('user', message);
                    
                    // Simular resposta do bot após 1 segundo
                    setTimeout(function() {
                        const botResponses = [
                            'Obrigado por sua mensagem! Como posso ajudar com sua reserva?',
                            'Temos disponibilidade para as datas solicitadas. Deseja mais informações?',
                            'Nosso hotel oferece Wi-Fi gratuito em todas as áreas.',
                            'O check-in é às 14h e o check-out às 12h.',
                            'Para reservas, recomendo entrar em contato pelo telefone (11) 5555-5555.'
                        ];
                        
                        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                        addMessage('bot', randomResponse);
                    }, 1000);
                    
                    // Limpar input
                    input.value = '';
                }
            });
        }
        
        // Função para adicionar mensagem
        function addMessage(type, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            
            const paragraph = document.createElement('p');
            paragraph.textContent = text;
            
            messageDiv.appendChild(paragraph);
            chatbotMessages.appendChild(messageDiv);
            
            // Rolar para a mensagem mais recente
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }
    
    // ======= GALERIA E LIGHTBOX =======
    if (galleryItems.length > 0 && lightbox && lightboxImage && lightboxClose) {
        // Abrir lightbox ao clicar na imagem
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const imgAlt = this.querySelector('img').getAttribute('alt');
                
                lightboxImage.setAttribute('src', imgSrc);
                lightboxImage.setAttribute('alt', imgAlt);
                
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Fechar lightbox
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
        
        // Fechar lightbox ao clicar fora da imagem
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                lightbox.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
        
        // Fechar lightbox com tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                lightbox.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ======= FILTRO DE GALERIA =======
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover classe active de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adicionar classe active ao botão clicado
                this.classList.add('active');
                
                // Obter categoria do filtro
                const filterValue = this.getAttribute('data-filter');
                
                // Filtrar itens
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // ======= BOTÃO VOLTAR AO TOPO =======
    if (backToTop) {
        // Mostrar/ocultar botão com base no scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        // Scroll suave ao topo
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ======= FORMULÁRIOS =======
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    // Formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de envio
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.reset();
        });
    }
    
    // Formulário de newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de inscrição
            alert('Inscrição realizada com sucesso! Obrigado por se inscrever em nossa newsletter.');
            this.reset();
        });
    }
    
    // ======= SCROLL SUAVE PARA ÂNCORAS =======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ======= CORREÇÃO PARA SERVICE WORKER =======
    // Desregistrar service workers problemáticos
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (let registration of registrations) {
                registration.unregister();
                console.log('Service Worker desregistrado com sucesso');
            }
        }).catch(function(error) {
            console.log('Erro ao desregistrar Service Worker:', error);
        });
    }
});
