/**
 * Hotel Manzoni - Script Principal
 * Versão: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Objeto para armazenar todas as funções
    const HotelApp = {
        // Configurações
        settings: {
            animationsEnabled: true,
            darkThemeClass: 'dark-theme',
            dataTheme: localStorage.getItem('theme') || 'light',
            isMobile: window.innerWidth < 768
        },

        // Inicialização
        init: function() {
            this.setupPreloader();
            this.setupThemeToggle();
            this.setupContactForm();
            this.setupSmoothScroll();
            this.setupMobileMenu();
            this.setupGallery();
            this.setupLightbox();
            this.setupScrollAnimations();
            this.setupHeaderScroll();
            this.setupBackToTop();
            this.setupChatbot();
            
            // Verificar se já deve iniciar com tema escuro
            if (this.settings.dataTheme === 'dark') {
                document.body.classList.add(this.settings.darkThemeClass);
                const themeButton = document.getElementById('theme-button');
                if (themeButton) themeButton.textContent = 'Tema Claro';
            }
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
            });
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
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (!isValid) {
                    alert("Por favor, preencha todos os campos obrigatórios.");
                    return;
                }
                
                // Simulação de envio de formulário
                alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
                contactForm.reset();
            });
        },

        // Rolagem suave
        setupSmoothScroll: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
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
                        
                        // Rolar para o elemento
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
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
                } else {
                    this.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
            
            // Fechar menu ao clicar em um link
            document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            });
        },

        // Galeria com filtro
        setupGallery: function() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            if (filterButtons.length === 0 || galleryItems.length === 0) return;
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remover classe active de todos os botões
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Adicionar classe active ao botão clicado
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-filter');
                    
                    galleryItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
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
            
            if (!lightbox || !lightboxImage || !lightboxClose) return;
            
            let currentIndex = 0;
            const images = [];
            
            galleryItems.forEach((item, index) => {
                const img = item.querySelector('img');
                if (img) {
                    images.push({
                        src: img.src,
                        alt: img.alt
                    });
                    
                    item.addEventListener('click', function() {
                        currentIndex = index;
                        openLightbox();
                    });
                }
            });
            
            function openLightbox() {
                lightboxImage.src = images[currentIndex].src;
                lightboxImage.alt = images[currentIndex].alt;
                lightbox.style.display = 'flex';
            }
            
            lightboxClose.addEventListener('click', function() {
                lightbox.style.display = 'none';
            });
            
            if (lightboxPrev && lightboxNext) {
                lightboxPrev.addEventListener('click', function() {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    lightboxImage.src = images[currentIndex].src;
                    lightboxImage.alt = images[currentIndex].alt;
                });
                
                lightboxNext.addEventListener('click', function() {
                    currentIndex = (currentIndex + 1) % images.length;
                    lightboxImage.src = images[currentIndex].src;
                    lightboxImage.alt = images[currentIndex].alt;
                });
            }
            
            // Fechar lightbox ao clicar fora da imagem
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    lightbox.style.display = 'none';
                }
            });
            
            // Navegação com teclado
            document.addEventListener('keydown', function(e) {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') {
                        currentIndex = (currentIndex - 1 + images.length) % images.length;
                        lightboxImage.src = images[currentIndex].src;
                        lightboxImage.alt = images[currentIndex].alt;
                    } else if (e.key === 'ArrowRight') {
                        currentIndex = (currentIndex + 1) % images.length;
                        lightboxImage.src = images[currentIndex].src;
                        lightboxImage.alt = images[currentIndex].alt;
                    } else if (e.key === 'Escape') {
                        lightbox.style.display = 'none';
                    }
                }
            });
        },

        // Animações de scroll
        setupScrollAnimations: function() {
            const animateElements = document.querySelectorAll('.animate-on-scroll');
            
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animated');
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
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
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
        },

        // Chatbot simples - CORRIGIDO COM FECHAMENTO AO CLICAR FORA
        setupChatbot: function() {
            const chatbotIcon = document.querySelector('.chatbot-icon');
            const chatbotContainer = document.querySelector('.chatbot-container');
            const chatbotClose = document.querySelector('.chatbot-close');
            const chatbotInput = document.querySelector('.chatbot-input input');
            const chatbotSend = document.querySelector('.chatbot-send');
            const chatbotMessages = document.querySelector('.chatbot-messages');
            const chatbotBox = document.querySelector('.chatbot-box'); // O elemento interno do chatbot
            
            if (!chatbotIcon || !chatbotContainer) {
                console.log('Elementos do chatbot não encontrados');
                return;
            }
            
            // Corrigindo o evento de clique no ícone do chatbot
            chatbotIcon.addEventListener('click', function(e) {
                e.stopPropagation(); // Impedir propagação para não fechar imediatamente
                chatbotContainer.classList.add('active');
                chatbotIcon.style.display = 'none';
                
                // Focar no campo de input
                if (chatbotInput) {
                    setTimeout(() => {
                        chatbotInput.focus();
                    }, 300);
                }
            });
            
            // Corrigindo o evento de clique no botão de fechar
            if (chatbotClose) {
                chatbotClose.addEventListener('click', function() {
                    chatbotContainer.classList.remove('active');
                    chatbotIcon.style.display = 'flex';
                });
            }
            
            // Fechar chatbot ao clicar fora dele
            document.addEventListener('click', function(e) {
                // Verifica se o chatbot está ativo
                if (chatbotContainer && chatbotContainer.classList.contains('active')) {
                    // Verifica se o clique foi fora do chatbot e não no ícone do chatbot
                    const chatboxElement = chatbotBox || chatbotContainer;
                    
                    // Se chatboxElement existe e o clique não foi dentro dele nem no ícone
                    if (chatboxElement && !chatboxElement.contains(e.target) && e.target !== chatbotIcon) {
                        chatbotContainer.classList.remove('active');
                        chatbotIcon.style.display = 'flex';
                    }
                }
            });
            
            // Impedir que cliques dentro do chatbot fechem ele
            if (chatbotBox) {
                chatbotBox.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            } else if (chatbotContainer) {
                chatbotContainer.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
            
            // Função para enviar mensagem
            function sendMessage() {
                if (!chatbotInput || !chatbotMessages) return;
                
                const message = chatbotInput.value.trim();
                if (!message) return;
                
                // Adicionar mensagem do usuário
                const userMessage = document.createElement('div');
                userMessage.classList.add('message', 'user');
                userMessage.textContent = message;
                chatbotMessages.appendChild(userMessage);
                
                // Limpar input
                chatbotInput.value = '';
                
                // Rolar para a última mensagem
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                
                // Simular resposta do bot
                setTimeout(() => {
                    const botMessage = document.createElement('div');
                    botMessage.classList.add('message', 'bot');
                    
                    // Respostas simples baseadas em palavras-chave
                    if (message.toLowerCase().includes('reserva') || message.toLowerCase().includes('quarto')) {
                        botMessage.textContent = "Para fazer uma reserva, você pode entrar em contato pelo telefone (11) 5555-5555 ou preencher o formulário de contato. Em qual data você gostaria de se hospedar?";
                    } else if (message.toLowerCase().includes('preço') || message.toLowerCase().includes('valor')) {
                        botMessage.textContent = "Nossos preços variam de acordo com o tipo de quarto. Temos quartos a partir de R$120 a diária. Para um orçamento específico, informe a data e o tipo de quarto desejado.";
                    } else if (message.toLowerCase().includes('endereço') || message.toLowerCase().includes('localização')) {
                        botMessage.textContent = "Estamos localizados na Av. Principal, 1000 - Centro, São Paulo, SP - CEP 01000-000.";
                    } else {
                        botMessage.textContent = "Obrigado pelo seu contato! Para mais informações, entre em contato pelo telefone (11) 5555-5555 ou preencha o formulário de contato.";
                    }
                    
                    chatbotMessages.appendChild(botMessage);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 500);
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
            
            console.log('Chatbot inicializado com fechamento ao clicar fora');
        }
    };

    // Inicializar o aplicativo
    HotelApp.init();
});
