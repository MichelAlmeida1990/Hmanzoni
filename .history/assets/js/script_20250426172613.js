/**
 * Hotel Manzoni - Script Principal
 * Versão: 1.1
 */

document.addEventListener('DOMContentLoaded', function() {
    // Objeto para armazenar todas as funções
    const HotelApp = {
        // Configurações
        settings: {
            animationsEnabled: true,
            darkThemeClass: 'dark-theme',
            dataTheme: localStorage.getItem('theme') || 'light',
            isMobile: window.innerWidth < 768,
            scrollOffset: 80,
            animationDelay: 100
        },

        // Inicialização
        init: function() {
            this.setupPreloader();
            this.setupThemeToggle();
            this.setupContactForm();
            this.setupBookingForm();
            this.setupSmoothScroll();
            this.setupMobileMenu();
            this.setupGallery();
            this.setupLightbox();
            this.setupScrollAnimations();
            this.setupHeaderScroll();
            this.setupBackToTop();
            this.setupChatbot();
            this.setupLazyLoading();
            this.setupNotifications();
            this.setupDatePickers();
            this.setupRoomSlider();
            this.setupTestimonialSlider();
            this.setupVideoModal();
            
            // Verificar se já deve iniciar com tema escuro
            if (this.settings.dataTheme === 'dark') {
                document.body.classList.add(this.settings.darkThemeClass);
                const themeButton = document.getElementById('theme-button');
                if (themeButton) themeButton.textContent = 'Tema Claro';
            }
            
            // Detectar mudanças na preferência de tema do sistema
            this.setupSystemThemeDetection();
            
            // Atualizar variável isMobile em resize
            window.addEventListener('resize', () => {
                this.settings.isMobile = window.innerWidth < 768;
            });
            
            console.log('Hotel Manzoni App inicializado com sucesso!');
        },

        // Preloader
        setupPreloader: function() {
            const preloader = document.querySelector('.preloader');
            if (!preloader) return;
            
            window.addEventListener('load', function() {
                setTimeout(function() {
                    preloader.classList.add('hidden');
                    setTimeout(function() {
                        preloader.style.display = 'none';
                    }, 500);
                }, 1000);
            });
        },

        // Alternador de Tema
        setupThemeToggle: function() {
            const themeButton = document.getElementById('theme-button');
            if (!themeButton) return;
            
            themeButton.addEventListener('click', () => {
                document.body.classList.toggle(this.settings.darkThemeClass);
                
                if (document.body.classList.contains(this.settings.darkThemeClass)) {
                    themeButton.textContent = 'Tema Claro';
                    localStorage.setItem('theme', 'dark');
                } else {
                    themeButton.textContent = 'Tema Escuro';
                    localStorage.setItem('theme', 'light');
                }
                
                // Disparar evento personalizado de mudança de tema
                document.dispatchEvent(new CustomEvent('themeChanged', {
                    detail: {
                        theme: document.body.classList.contains(this.settings.darkThemeClass) ? 'dark' : 'light'
                    }
                }));
            });
        },
        
        // Detectar tema do sistema
        setupSystemThemeDetection: function() {
            if (window.matchMedia) {
                const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                
                // Verificar tema inicial se não houver preferência salva
                if (!localStorage.getItem('theme')) {
                    if (darkModeMediaQuery.matches) {
                        document.body.classList.add(this.settings.darkThemeClass);
                        const themeButton = document.getElementById('theme-button');
                        if (themeButton) themeButton.textContent = 'Tema Claro';
                    }
                }
                
                // Ouvir mudanças na preferência do sistema
                darkModeMediaQuery.addEventListener('change', (e) => {
                    // Só aplicar se o usuário não tiver uma preferência salva
                    if (!localStorage.getItem('theme')) {
                        if (e.matches) {
                            document.body.classList.add(this.settings.darkThemeClass);
                            const themeButton = document.getElementById('theme-button');
                            if (themeButton) themeButton.textContent = 'Tema Claro';
                        } else {
                            document.body.classList.remove(this.settings.darkThemeClass);
                            const themeButton = document.getElementById('theme-button');
                            if (themeButton) themeButton.textContent = 'Tema Escuro';
                        }
                    }
                });
            }
        },

        // Formulário de contato
        setupContactForm: function() {
            const contactForm = document.querySelector('.contact-form');
            if (!contactForm) return;
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar formulário
                const formFields = this.querySelectorAll('input, textarea');
                let isValid = true;
                
                formFields.forEach(field => {
                    if (field.required && !field.value.trim()) {
                        field.classList.add('error');
                        isValid = false;
                    } else if (field.type === 'email' && field.required) {
                        // Validação simples de email
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(field.value.trim())) {
                            field.classList.add('error');
                            isValid = false;
                        } else {
                            field.classList.remove('error');
                        }
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (!isValid) {
                    // Mostrar notificação de erro
                    HotelApp.showNotification('Por favor, preencha todos os campos corretamente.', 'error');
                    return;
                }
                
                // Simulação de envio de formulário
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                
                setTimeout(() => {
                    HotelApp.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 1500);
            });
            
            // Validação em tempo real
            contactForm.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', function() {
                    if (this.required && !this.value.trim()) {
                        this.classList.add('error');
                    } else if (this.type === 'email' && this.required) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(this.value.trim())) {
                            this.classList.add('error');
                        } else {
                            this.classList.remove('error');
                        }
                    } else {
                        this.classList.remove('error');
                    }
                });
            });
        },
        
        // Formulário de reserva
        setupBookingForm: function() {
            const bookingForm = document.querySelector('.booking-form');
            const bookingButtons = document.querySelectorAll('.booking-btn');
            const bookingFormContainer = document.querySelector('.booking-form-container');
            const bookingFormClose = document.querySelector('.booking-form-close');
            
            if (!bookingForm || !bookingFormContainer) return;
            
            // Abrir formulário de reserva
            bookingButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    bookingFormContainer.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Impedir rolagem
                    
                    // Se o botão tem data-room, preencher o campo de quarto
                    const roomType = this.getAttribute('data-room');
                    if (roomType) {
                        const roomSelect = bookingForm.querySelector('select[name="room"]');
                        if (roomSelect) {
                            roomSelect.value = roomType;
                        }
                    }
                });
            });
            
            // Fechar formulário de reserva
            if (bookingFormClose) {
                bookingFormClose.addEventListener('click', function() {
                    bookingFormContainer.classList.remove('active');
                    document.body.style.overflow = ''; // Restaurar rolagem
                });
            }
            
            // Fechar ao clicar fora do formulário
            bookingFormContainer.addEventListener('click', function(e) {
                if (e.target === bookingFormContainer) {
                    bookingFormContainer.classList.remove('active');
                    document.body.style.overflow = ''; // Restaurar rolagem
                }
            });
            
            // Submissão do formulário
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar formulário
                const formFields = this.querySelectorAll('input, select');
                let isValid = true;
                
                formFields.forEach(field => {
                    if (field.required && !field.value.trim()) {
                        field.classList.add('error');
                        isValid = false;
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (!isValid) {
                    HotelApp.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                    return;
                }
                
                // Verificar datas (checkin deve ser antes do checkout)
                const checkinDate = new Date(this.querySelector('input[name="checkin"]').value);
                const checkoutDate = new Date(this.querySelector('input[name="checkout"]').value);
                
                if (checkinDate >= checkoutDate) {
                    HotelApp.showNotification('A data de saída deve ser posterior à data de entrada.', 'error');
                    return;
                }
                
                // Simulação de envio de reserva
                const submitButton = bookingForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                
                setTimeout(() => {
                    HotelApp.showNotification('Reserva solicitada com sucesso! Enviaremos a confirmação por e-mail.', 'success');
                    bookingForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    
                    // Fechar o formulário após envio
                    setTimeout(() => {
                        bookingFormContainer.classList.remove('active');
                        document.body.style.overflow = ''; // Restaurar rolagem
                    }, 1500);
                }, 2000);
            });
        },

        // Rolagem suave
        setupSmoothScroll: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    
                    // Ignorar se for apenas "#"
                    if (targetId === '#') return;
                    
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Fechar menu mobile se estiver aberto
                        const nav = document.querySelector('nav');
                        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
                        
                        if (nav && nav.classList.contains('active')) {
                            nav.classList.remove('active');
                            if (mobileMenuToggle) {
                                mobileMenuToggle.classList.remove('active');
                                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                            }
                        }
                        
                        // Destacar a seção
                        targetElement.classList.add('highlight-section');
                        setTimeout(() => {
                            targetElement.classList.remove('highlight-section');
                        }, 1000);
                        
                        // Rolar para o elemento
                        window.scrollTo({
                            top: targetElement.offsetTop - HotelApp.settings.scrollOffset,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        // Menu mobile
        setupMobileMenu: function() {
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const nav = document.querySelector('nav');
            
            if (!mobileMenuToggle || !nav) return;
            
            mobileMenuToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                this.classList.toggle('active');
                
                if (this.classList.contains('active')) {
                    this.innerHTML = '<i class="fas fa-times"></i>';
                    document.body.style.overflow = 'hidden'; // Impedir rolagem quando menu aberto
                } else {
                    this.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = ''; // Restaurar rolagem
                }
            });
            
            // Fechar menu ao clicar em um link
            document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        document.body.style.overflow = ''; // Restaurar rolagem
                    }
                });
            });
            
            // Fechar menu ao clicar fora dele
            document.addEventListener('click', function(e) {
                if (nav.classList.contains('active') && 
                    !nav.contains(e.target) && 
                    e.target !== mobileMenuToggle) {
                    nav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = ''; // Restaurar rolagem
                }
            });
            
            // Impedir que cliques dentro do nav fechem o menu
            nav.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        },

        // Galeria com filtro
        setupGallery: function() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            if (filterButtons.length === 0 || galleryItems.length === 0) return;
            
            // Inicializar com animações
            galleryItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
            });
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remover classe active de todos os botões
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Adicionar classe active ao botão clicado
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-filter');
                    
                    // Aplicar filtro com animação
                    galleryItems.forEach((item, index) => {
                        // Reset da animação
                        item.style.opacity = '0';
                        
                        setTimeout(() => {
                            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                                item.style.display = 'block';
                                // Aplicar nova animação com delay
                                item.style.animationDelay = `${index * 0.1}s`;
                                item.style.opacity = '1';
                            } else {
                                item.style.display = 'none';
                            }
                        }, 300);
                    });
                });
            });
        },

        // Lightbox para galeria
        setupLightbox: function() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const lightbox = document.querySelector('.gallery-lightbox');
            const lightboxImage = document.querySelector('.lightbox-image');
            const lightboxClose = document.querySelector('.lightbox-close');
            const lightboxPrev = document.querySelector('.lightbox-prev');
            const lightboxNext = document.querySelector('.lightbox-next');
            const lightboxCaption = document.querySelector('.lightbox-caption');
            
            if (!lightbox || !lightboxImage || !lightboxClose) return;
            
            let currentIndex = 0;
            const images = [];
            
            galleryItems.forEach((item, index) => {
                const img = item.querySelector('img');
                if (img) {
                    images.push({
                        src: img.getAttribute('data-full') || img.src,
                        alt: img.alt,
                        caption: item.getAttribute('data-caption') || ''
                    });
                    
                    item.addEventListener('click', function(e) {
                        e.preventDefault();
                        currentIndex = index;
                        openLightbox();
                    });
                }
            });
            
            function openLightbox() {
                lightboxImage.src = images[currentIndex].src;
                lightboxImage.alt = images[currentIndex].alt;
                
                // Atualizar legenda se existir
                if (lightboxCaption) {
                    lightboxCaption.textContent = images[currentIndex].caption;
                    lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
                }
                
                lightbox.style.display = 'flex';
                setTimeout(() => {
                    lightbox.style.opacity = '1';
                }, 10);
                
                // Desabilitar rolagem do body
                document.body.style.overflow = 'hidden';
            }
            
            function closeLightbox() {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.style.display = 'none';
                    // Restaurar rolagem do body
                    document.body.style.overflow = '';
                }, 300);
            }
            
            lightboxClose.addEventListener('click', closeLightbox);
            
            if (lightboxPrev && lightboxNext) {
                lightboxPrev.addEventListener('click', function(e) {
                    e.stopPropagation();
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    lightboxImage.src = images[currentIndex].src;
                    lightboxImage.alt = images[currentIndex].alt;
                    
                    // Atualizar legenda se existir
                    if (lightboxCaption) {
                        lightboxCaption.textContent = images[currentIndex].caption;
                        lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
                    }
                });
                
                lightboxNext.addEventListener('click', function(e) {
                    e.stopPropagation();
                    currentIndex = (currentIndex + 1) % images.length;
                    lightboxImage.src = images[currentIndex].src;
                    lightboxImage.alt = images[currentIndex].alt;
                    
                    // Atualizar legenda se existir
                    if (lightboxCaption) {
                        lightboxCaption.textContent = images[currentIndex].caption;
                        lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
                    }
                });
            }
            
            // Fechar lightbox ao clicar fora da imagem
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            // Navegação com teclado
            document.addEventListener('keydown', function(e) {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') {
                        currentIndex = (currentIndex - 1 + images.length) % images.length;
                        lightboxImage.src = images[currentIndex].src;
                        lightboxImage.alt = images[currentIndex].alt;
                        
                        // Atualizar legenda se existir
                        if (lightboxCaption) {
                            lightboxCaption.textContent = images[currentIndex].caption;
                            lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
                        }
                    } else if (e.key === 'ArrowRight') {
                        currentIndex = (currentIndex + 1) % images.length;
                        lightboxImage.src = images[currentIndex].src;
                        lightboxImage.alt = images[currentIndex].alt;
                        
                        // Atualizar legenda se existir
                        if (lightboxCaption) {
                            lightboxCaption.textContent = images[currentIndex].caption;
                            lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
                        }
                    } else if (e.key === 'Escape') {
                        closeLightbox();
                    }
                }
            });
            
            // Adicionar contador de imagens
            if (images.length > 1) {
                const counter = document.createElement('div');
                counter.className = 'lightbox-counter';
                lightbox.appendChild(counter);
                
                function updateCounter() {
                    counter.textContent = `${currentIndex + 1} / ${images.length}`;
                }
                
                // Atualizar contador ao navegar
                lightboxPrev.addEventListener('click', updateCounter);
                lightboxNext.addEventListener('click', updateCounter);
                document.addEventListener('keydown', function(e) {
                    if (lightbox.style.display === 'flex' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                        updateCounter();
                    }
                });
                
                // Inicializar contador
                updateCounter();
            }
        },

        // Animações de scroll
        setupScrollAnimations: function() {
            const animateElements = document.querySelectorAll('.animate-on-scroll');
            
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            // Adicionar delay progressivo para elementos da mesma seção
                            setTimeout(() => {
                                entry.target.classList.add('animated');
                            }, index * this.settings.animationDelay);
                            
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                animateElements.forEach(element => {
                    observer.observe(element);
                });
            } else {
                // Fallback para navegadores que não suportam IntersectionObserver
                animateElements.forEach(element => {
                    element.classList.add('animated');
                });
            }
        },

        // Header fixo com efeito ao rolar
        setupHeaderScroll: function() {
            const header = document.querySelector('header');
            if (!header) return;
            
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Adicionar classe quando rolar para baixo
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Ocultar/mostrar header ao rolar para baixo/cima
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    // Rolando para baixo
                    header.classList.add('header-hidden');
                } else {
                    // Rolando para cima
                    header.classList.remove('header-hidden');
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            });
        },

        // Botão voltar ao topo
        setupBackToTop: function() {
            const backToTopButton = document.querySelector('.back-to-top');
            if (!backToTopButton) return;
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    backToTopButton.classList.add('active');
                } else {
                    backToTopButton.classList.remove('active');
                }
            });
            
            backToTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Adicionar efeito de pulso
            setInterval(() => {
                if (backToTopButton.classList.contains('active')) {
                    backToTopButton.classList.add('pulse');
                    setTimeout(() => {
                        backToTopButton.classList.remove('pulse');
                    }, 1000);
                }
            }, 5000);
        },
// Chatbot integrado (unificando com HotelComponents)
setupChatbot: function() {
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSend = document.querySelector('.chatbot-send');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    
    if (!chatbotIcon || !chatbotContainer) return;
    
    // Mensagem inicial do chatbot
    if (chatbotMessages) {
        setTimeout(() => {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.classList.add('message', 'bot');
            welcomeMessage.textContent = "Olá! Bem-vindo ao Hotel Manzoni. Como posso ajudar você hoje?";
            chatbotMessages.appendChild(welcomeMessage);
        }, 500);
    }
    
    // Abrir chatbot
    chatbotIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        chatbotContainer.classList.add('active');
        chatbotIcon.style.display = 'none';
        
        // Focar no campo de input
        if (chatbotInput) {
            setTimeout(() => {
                chatbotInput.focus();
            }, 300);
        }
    });
    
    // Fechar chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
            chatbotIcon.style.display = 'flex';
        });
    }
    
    // Fechar chatbot ao clicar fora
    document.addEventListener('click', function(e) {
        if (chatbotContainer && 
            chatbotContainer.classList.contains('active') && 
            !chatbotContainer.contains(e.target) && 
            e.target !== chatbotIcon) {
            chatbotContainer.classList.remove('active');
            chatbotIcon.style.display = 'flex';
        }
    });
    
    // Impedir propagação de cliques dentro do chatbot
    chatbotContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Função para enviar mensagem (delegando para HotelComponents se disponível)
    function sendMessage() {
        if (!chatbotInput || !chatbotMessages) return;
        
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // Verificar se HotelComponents está disponível para usar a versão avançada
        if (typeof HotelComponents !== 'undefined' && HotelComponents.sendChatbotMessage) {
            HotelComponents.sendChatbotMessage(message, chatbotMessages);
            chatbotInput.value = '';
        } else {
            // Fallback para lógica básica se HotelComponents não estiver carregado
            // Adicionar mensagem do usuário
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');
            userMessage.textContent = message;
            chatbotMessages.appendChild(userMessage);
            
            // Limpar input
            chatbotInput.value = '';
            
            // Rolar para a última mensagem
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Mostrar indicador de digitação
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('message', 'bot', 'typing');
            typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Simular resposta do bot
            setTimeout(() => {
                // Remover indicador de digitação
                chatbotMessages.removeChild(typingIndicator);
                
                const botMessage = document.createElement('div');
                botMessage.classList.add('message', 'bot');
                
                // Respostas baseadas em palavras-chave (mantidas como fallback)
                const messageLower = message.toLowerCase();
                if (messageLower.includes('reserva') || messageLower.includes('quarto')) {
                    botMessage.textContent = "Para fazer uma reserva, você pode entrar em contato pelo telefone (11) 5555-5555 ou preencher o formulário de contato. Em qual data você gostaria de se hospedar?";
                } else if (messageLower.includes('preço') || messageLower.includes('valor') || messageLower.includes('custo')) {
                    botMessage.textContent = "Nossos preços variam de acordo com o tipo de quarto. Temos quartos a partir de R$120 a diária. Para um orçamento específico, informe a data e o tipo de quarto desejado.";
                } else if (messageLower.includes('endereço') || messageLower.includes('localização') || messageLower.includes('onde fica')) {
                    botMessage.textContent = "Estamos localizados na Av. Principal, 1000 - Centro, São Paulo, SP - CEP 01000-000. Temos fácil acesso por transporte público e estamos a apenas 15 minutos do aeroporto.";
                } else if (messageLower.includes('check-in') || messageLower.includes('checkout') || messageLower.includes('horário')) {
                    botMessage.textContent = "Nosso horário de check-in é a partir das 14h e o check-out até às 12h. Se precisar de horários especiais, entre em contato conosco antecipadamente.";
                } else if (messageLower.includes('café') || messageLower.includes('refeição') || messageLower.includes('restaurante')) {
                    botMessage.textContent = "Oferecemos café da manhã completo incluso em todas as reservas, servido das 6h30 às 10h. Nosso restaurante também serve almoço e jantar com o melhor da gastronomia italiana.";
                } else if (messageLower.includes('wifi') || messageLower.includes('internet')) {
                    botMessage.textContent = "Sim, oferecemos Wi-Fi gratuito de alta velocidade em todas as áreas do hotel.";
                } else if (messageLower.includes('pet') || messageLower.includes('cachorro') || messageLower.includes('gato') || messageLower.includes('animal')) {
                    botMessage.textContent = "Somos pet friendly! Aceitamos animais de pequeno e médio porte em quartos selecionados. Informe-nos com antecedência para preparamos tudo para seu amigo de quatro patas.";
                } else if (messageLower.includes('estacionamento') || messageLower.includes('garagem') || messageLower.includes('carro')) {
                    botMessage.textContent = "Sim, temos estacionamento privativo para hóspedes. O serviço tem custo adicional de R$25 por diária com serviço de manobrista.";
                } else if (messageLower.includes('piscina') || messageLower.includes('academia') || messageLower.includes('spa')) {
                    botMessage.textContent = "Nosso hotel conta com piscina aquecida, academia completa e spa com diversos tratamentos. Todos esses serviços estão disponíveis para nossos hóspedes.";
                } else if (messageLower.includes('cancelamento') || messageLower.includes('cancelar')) {
                    botMessage.textContent = "Nossa política de cancelamento permite cancelamentos gratuitos até 48h antes da data de check-in. Após esse prazo, pode haver cobrança de uma diária.";
                } else if (messageLower.includes('obrigado') || messageLower.includes('valeu') || messageLower.includes('agradeço')) {
                    botMessage.textContent = "Por nada! Estou aqui para ajudar. Tem mais alguma dúvida sobre o Hotel Manzoni?";
                } else if (messageLower.includes('oi') || messageLower.includes('olá') || messageLower.includes('bom dia') || messageLower.includes('boa tarde') || messageLower.includes('boa noite')) {
                    botMessage.textContent = "Olá! Bem-vindo ao Hotel Manzoni. Como posso ajudar você hoje?";
                } else {
                    botMessage.textContent = "Obrigado pelo seu contato! Para informações mais específicas, entre em contato pelo telefone (11) 5555-5555 ou preencha o formulário de contato. Posso ajudar com algo mais?";
                }
                chatbotMessages.appendChild(botMessage);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
    }
    
    // Configurar eventos para enviar mensagem
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

        
        // Carregamento lazy de imagens
    setupLazyLoading: function() {
            if ('IntersectionObserver' in window) {
                const lazyImages = document.querySelectorAll('img[data-src]');
                
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.getAttribute('data-src');
                            
                            // Se houver srcset
                            if (img.getAttribute('data-srcset')) {
                                img.srcset = img.getAttribute('data-srcset');
                            }
                            
                            img.onload = () => {
                                img.removeAttribute('data-src');
                                img.removeAttribute('data-srcset');
                                img.classList.add('loaded');
                            };
                            
                            imageObserver.unobserve(img);
                        }
                    });
                }, { threshold: 0.1 });
                
                lazyImages.forEach(img => {
                    imageObserver.observe(img);
                });
            } else {
                // Fallback para navegadores que não suportam IntersectionObserver
                const lazyImages = document.querySelectorAll('img[data-src]');
                
                lazyImages.forEach(img => {
                    img.src = img.getAttribute('data-src');
                    if (img.getAttribute('data-srcset')) {
                        img.srcset = img.getAttribute('data-srcset');
                    }
                    img.classList.add('loaded');
                });
            }
        },
        
        // Sistema de notificações
        setupNotifications: function() {
            // Criar container de notificações se não existir
            let notificationsContainer = document.querySelector('.notifications-container');
            
            if (!notificationsContainer) {
                notificationsContainer = document.createElement('div');
                notificationsContainer.className = 'notifications-container';
                document.body.appendChild(notificationsContainer);
            }
            
            // Método para mostrar notificações
            this.showNotification = function(message, type = 'info', duration = 4000) {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                
                // Ícone baseado no tipo
                let icon = '';
                switch(type) {
                    case 'success':
                        icon = '<i class="fas fa-check-circle"></i>';
                        break;
                    case 'error':
                        icon = '<i class="fas fa-times-circle"></i>';
                        break;
                    case 'warning':
                        icon = '<i class="fas fa-exclamation-triangle"></i>';
                        break;
                    default:
                        icon = '<i class="fas fa-info-circle"></i>';
                }
                
                notification.innerHTML = `
                    <div class="notification-content">
                        ${icon}
                        <p>${message}</p>
                    </div>
                    <button class="notification-close"><i class="fas fa-times"></i></button>
                `;
                
                notificationsContainer.appendChild(notification);
                
                // Animar entrada
                setTimeout(() => {
                    notification.classList.add('active');
                }, 10);
                
                // Configurar botão de fechar
                const closeButton = notification.querySelector('.notification-close');
                closeButton.addEventListener('click', () => {
                    closeNotification(notification);
                });
                
                // Auto fechar após duração
                const timeout = setTimeout(() => {
                    closeNotification(notification);
                }, duration);
                
                // Função para fechar notificação
                function closeNotification(notif) {
                    notif.classList.remove('active');
                    notif.classList.add('closing');
                    
                    setTimeout(() => {
                        notif.remove();
                    }, 300);
                    
                    clearTimeout(timeout);
                }
                
                // Pausar timeout ao passar o mouse
                notification.addEventListener('mouseenter', () => {
                    clearTimeout(timeout);
                });
                
                // Retomar timeout ao remover o mouse
                notification.addEventListener('mouseleave', () => {
                    timeout = setTimeout(() => {
                        closeNotification(notification);
                    }, duration / 2);
                });
                
                return notification;
            };
        },
        
        // Seletores de data
        setupDatePickers: function() {
            const dateInputs = document.querySelectorAll('input[type="date"]');
            
            dateInputs.forEach(input => {
                // Definir data mínima como hoje
                if (input.name === 'checkin' || input.name === 'checkout') {
                    const today = new Date().toISOString().split('T')[0];
                    input.min = today;
                    
                    // Para checkout, definir data mínima como checkin + 1 dia
                    if (input.name === 'checkout') {
                        const checkinInput = document.querySelector('input[name="checkin"]');
                        
                        if (checkinInput) {
                            checkinInput.addEventListener('change', function() {
                                if (this.value) {
                                    // Adicionar um dia à data de checkin
                                    const nextDay = new Date(this.value);
                                    nextDay.setDate(nextDay.getDate() + 1);
                                    
                                    // Formatar como YYYY-MM-DD
                                    const formattedDate = nextDay.toISOString().split('T')[0];
                                    input.min = formattedDate;
                                    
                                    // Se checkout for anterior ao novo mínimo, atualizar
                                    if (input.value && new Date(input.value) < nextDay) {
                                        input.value = formattedDate;
                                    }
                                }
                            });
                        }
                    }
                }
            });
        },
        
        // Slider de quartos
        setupRoomSlider: function() {
            const roomSlider = document.querySelector('.room-slider');
            if (!roomSlider) return;
            
            const roomSlides = roomSlider.querySelectorAll('.room-slide');
            const prevButton = roomSlider.querySelector('.room-slider-prev');
            const nextButton = roomSlider.querySelector('.room-slider-next');
            const dotsContainer = roomSlider.querySelector('.room-slider-dots');
            
            let currentSlide = 0;
            let autoplayInterval;
            const autoplayDelay = 5000;
            
            // Criar indicadores
            if (dotsContainer) {
                roomSlides.forEach((_, index) => {
                    const dot = document.createElement('span');
                    dot.classList.add('room-slider-dot');
                    if (index === 0) dot.classList.add('active');
                    
                    dot.addEventListener('click', () => {
                        goToSlide(index);
                        resetAutoplay();
                    });
                    
                    dotsContainer.appendChild(dot);
                });
            }
            
            // Função para ir para um slide específico
            function goToSlide(index) {
                roomSlides.forEach((slide, i) => {
                    slide.style.transform = `translateX(${100 * (i - index)}%)`;
                    
                    // Atualizar dots
                    if (dotsContainer) {
                        const dots = dotsContainer.querySelectorAll('.room-slider-dot');
                        dots.forEach((dot, j) => {
                            dot.classList.toggle('active', j === index);
                        });
                    }
                });
                
                currentSlide = index;
            }
            
            // Inicializar posições
            roomSlides.forEach((slide, index) => {
                slide.style.transform = `translateX(${100 * index}%)`;
            });
            
            // Botões de navegação
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    currentSlide = (currentSlide - 1 + roomSlides.length) % roomSlides.length;
                    goToSlide(currentSlide);
                    resetAutoplay();
                });
            }
            
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    currentSlide = (currentSlide + 1) % roomSlides.length;
                    goToSlide(currentSlide);
                    resetAutoplay();
                });
            }
            
            // Autoplay
            function startAutoplay() {
                autoplayInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % roomSlides.length;
                    goToSlide(currentSlide);
                }, autoplayDelay);
            }
            
            function resetAutoplay() {
                clearInterval(autoplayInterval);
                startAutoplay();
            }
            
            // Iniciar autoplay
            startAutoplay();
            
            // Pausar autoplay ao passar o mouse
            roomSlider.addEventListener('mouseenter', () => {
                clearInterval(autoplayInterval);
            });
            
            // Retomar autoplay ao remover o mouse
            roomSlider.addEventListener('mouseleave', () => {
                startAutoplay();
            });
            
            // Suporte a gestos touch
            let touchStartX = 0;
            let touchEndX = 0;
            
            roomSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            roomSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                // Detectar direção do swipe
                if (touchEndX < touchStartX - 50) {
                    // Swipe para esquerda (próximo)
                    currentSlide = (currentSlide + 1) % roomSlides.length;
                } else if (touchEndX > touchStartX + 50) {
                    // Swipe para direita (anterior)
                    currentSlide = (currentSlide - 1 + roomSlides.length) % roomSlides.length;
                }
                
                goToSlide(currentSlide);
                resetAutoplay();
            }
        },
        
        // Slider de depoimentos
        setupTestimonialSlider: function() {
            const testimonialSlider = document.querySelector('.testimonial-slider');
            if (!testimonialSlider) return;
            
            const testimonials = testimonialSlider.querySelectorAll('.testimonial');
            const prevButton = testimonialSlider.querySelector('.testimonial-prev');
            const nextButton = testimonialSlider.querySelector('.testimonial-next');
            
            let currentSlide = 0;
            let autoplayInterval;
            const autoplayDelay = 6000;
            
            // Função para mostrar um depoimento específico
            function showTestimonial(index) {
                testimonials.forEach((testimonial, i) => {
                    testimonial.classList.toggle('active', i === index);
                    
                    // Adicionar classe para animação de entrada/saída
                    if (i === index) {
                        testimonial.classList.add('testimonial-in');
                        setTimeout(() => {
                            testimonial.classList.remove('testimonial-in');
                        }, 600);
                    } else if (testimonial.classList.contains('active')) {
                        testimonial.classList.add('testimonial-out');
                        setTimeout(() => {
                            testimonial.classList.remove('testimonial-out');
                        }, 600);
                    }
                });
                
                currentSlide = index;
            }
            
            // Inicializar primeiro depoimento
            testimonials[0].classList.add('active');
            
            // Botões de navegação
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
                    showTestimonial(currentSlide);
                    resetAutoplay();
                });
            }
            
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    currentSlide = (currentSlide + 1) % testimonials.length;
                    showTestimonial(currentSlide);
                    resetAutoplay();
                });
            }
            
            // Autoplay
            function startAutoplay() {
                autoplayInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % testimonials.length;
                    showTestimonial(currentSlide);
                }, autoplayDelay);
            }
            
            function resetAutoplay() {
                clearInterval(autoplayInterval);
                startAutoplay();
            }
            
            // Iniciar autoplay
            startAutoplay();
            
            // Pausar autoplay ao passar o mouse
            testimonialSlider.addEventListener('mouseenter', () => {
                clearInterval(autoplayInterval);
            });
            
            // Retomar autoplay ao remover o mouse
            testimonialSlider.addEventListener('mouseleave', () => {
                startAutoplay();
            });
            
            // Criar indicadores
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'testimonial-dots';
            testimonialSlider.appendChild(dotsContainer);
            
            testimonials.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('testimonial-dot');
                if (index === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    showTestimonial(index);
                    resetAutoplay();
                });
                
                dotsContainer.appendChild(dot);
            });
            
            // Atualizar dots ao mudar slide
            function updateDots() {
                const dots = dotsContainer.querySelectorAll('.testimonial-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentSlide);
                });
            }
            
            // Adicionar ao evento de mudança de slide
            const originalShowTestimonial = showTestimonial;
            showTestimonial = function(index) {
                originalShowTestimonial(index);
                updateDots();
            };
        },
        
        // Modal de vídeo
        setupVideoModal: function() {
            const videoButtons = document.querySelectorAll('.video-btn');
            const videoModal = document.querySelector('.video-modal');
            const videoContainer = document.querySelector('.video-container');
            const videoClose = document.querySelector('.video-close');
            
            if (!videoButtons.length || !videoModal) return;
            
            videoButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const videoUrl = this.getAttribute('data-video');
                    if (!videoUrl) return;
                    
                    // Criar iframe
                    const iframe = document.createElement('iframe');
                    iframe.src = videoUrl;
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    iframe.allowFullscreen = true;
                    
                    // Limpar container e adicionar iframe
                    if (videoContainer) {
                        videoContainer.innerHTML = '';
                        videoContainer.appendChild(iframe);
                    }
                    
                    // Abrir modal
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Impedir rolagem
                });
            });
            
            // Fechar modal
            if (videoClose) {
                videoClose.addEventListener('click', closeVideoModal);
            }
            
            // Fechar ao clicar fora do vídeo
            videoModal.addEventListener('click', function(e) {
                if (e.target === videoModal) {
                    closeVideoModal();
                }
            });
            
            // Fechar com Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                    closeVideoModal();
                }
            });
            
            function closeVideoModal() {
                videoModal.classList.remove('active');
                document.body.style.overflow = ''; // Restaurar rolagem
                
                // Limpar iframe para parar o vídeo
                setTimeout(() => {
                    if (videoContainer) {
                        videoContainer.innerHTML = '';
                    }
                }, 300);
            }
        }
    };
    
    // Inicializar o aplicativo
    HotelApp.init();
});