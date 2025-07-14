/* assets/js/hotel-manzoni.js - VERSÃO REESCRITA COMPLETA */

(function() {
    'use strict';

    // =========== CONFIGURAÇÃO INICIAL =========== 
    const HotelManzoni = {
        // Elementos DOM
        elements: {
            preloader: null,
            mobileMenuToggle: null,
            navigation: null,
            body: null,
            chatbotIcon: null,
            chatbotContainer: null,
            backToTop: null
        },

        // =========== INICIALIZAÇÃO =========== 
        init: function() {
            console.log('Hotel Manzoni JS inicializado com sucesso!');
            
            // Esperar DOM carregar
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.setupElements.bind(this));
            } else {
                this.setupElements();
            }
        },

        // =========== CONFIGURAR ELEMENTOS =========== 
        setupElements: function() {
            // Encontrar elementos DOM
            this.elements.preloader = document.querySelector('.preloader');
            this.elements.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            this.elements.navigation = document.querySelector('.main-navigation');
            this.elements.body = document.body;
            this.elements.chatbotIcon = document.querySelector('.chatbot-icon');
            this.elements.chatbotContainer = document.querySelector('.chatbot-container');
            this.elements.backToTop = document.querySelector('.back-to-top');

            // Inicializar módulos
            this.setupPreloader();
            this.setupMobileMenu();
            this.setupThemeToggle();
            this.setupChatbot();
            this.setupScrollEvents();
            this.setupAccessibility();
            this.setupPerformanceOptimizations();

            console.log('Elementos do chatbot:', {
                icon: !!this.elements.chatbotIcon,
                container: !!this.elements.chatbotContainer
            });
        },

        // =========== PRELOADER =========== 
        setupPreloader: function() {
            if (!this.elements.preloader) return;

            // Remover preloader após carregar
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.elements.preloader.classList.add('preloader-hidden');
                    
                    // Remover completamente após animação
                    setTimeout(() => {
                        if (this.elements.preloader.parentNode) {
                            this.elements.preloader.parentNode.removeChild(this.elements.preloader);
                        }
                    }, 500);
                }, 1000);
            });
        },

        // =========== MENU MOBILE =========== 
        setupMobileMenu: function() {
            if (!this.elements.mobileMenuToggle || !this.elements.navigation) {
                console.warn('Elementos do menu mobile não encontrados');
                return;
            }

            console.log('Menu mobile configurado com sucesso');

            // Configurar acessibilidade inicial
            this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
            this.elements.navigation.setAttribute('aria-hidden', 'true');

            // Função para abrir menu
            const openMenu = () => {
                this.elements.navigation.classList.add('active');
                this.elements.mobileMenuToggle.classList.add('active');
                this.elements.body.classList.add('menu-open');
                
                // Atualizar acessibilidade
                this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
                this.elements.navigation.setAttribute('aria-hidden', 'false');
                
                // Focar primeiro link
                const firstLink = this.elements.navigation.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
                
                console.log('Menu aberto');
            };

            // Função para fechar menu
            const closeMenu = () => {
                this.elements.navigation.classList.remove('active');
                this.elements.mobileMenuToggle.classList.remove('active');
                this.elements.body.classList.remove('menu-open');
                
                // Atualizar acessibilidade
                this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
                this.elements.navigation.setAttribute('aria-hidden', 'true');
                
                console.log('Menu fechado');
            };

            // Event listener para botão toggle
            this.elements.mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Botão do menu clicado');
                
                if (this.elements.navigation.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            // Fechar menu ao clicar em links
            const navLinks = this.elements.navigation.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    closeMenu();
                });
            });

            // Fechar menu ao clicar no overlay
            this.elements.body.addEventListener('click', (e) => {
                if (this.elements.body.classList.contains('menu-open') && 
                    !this.elements.navigation.contains(e.target) && 
                    e.target !== this.elements.mobileMenuToggle && 
                    !this.elements.mobileMenuToggle.contains(e.target)) {
                    closeMenu();
                }
            });

            // Fechar menu com ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.elements.navigation.classList.contains('active')) {
                    closeMenu();
                    this.elements.mobileMenuToggle.focus();
                }
            });

            // Navegação por teclado
            navLinks.forEach((link, index) => {
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab' && e.shiftKey && index === 0) {
                        e.preventDefault();
                        this.elements.mobileMenuToggle.focus();
                    } else if (e.key === 'Tab' && !e.shiftKey && index === navLinks.length - 1) {
                        e.preventDefault();
                        this.elements.mobileMenuToggle.focus();
                    }
                });
            });
        },

        // =========== TOGGLE DE TEMA =========== 
        setupThemeToggle: function() {
            const themeButton = document.getElementById('theme-button');
            if (!themeButton) {
                console.log('Botão de tema não encontrado');
                return;
            }

            console.log('Toggle de tema configurado');

            // Detectar preferência do sistema primeiro
            let initialTheme = 'light';
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                initialTheme = 'dark';
            }

            // Carregar tema salvo ou usar preferência do sistema
            const savedTheme = localStorage.getItem('theme') || initialTheme;
            
            // Forçar aplicação do tema inicial
            document.documentElement.removeAttribute('data-theme');
            setTimeout(() => {
                document.documentElement.setAttribute('data-theme', savedTheme);
                document.body.classList.remove('theme-light', 'theme-dark');
                document.body.classList.add(`theme-${savedTheme}`);
                this.updateThemeButtonIcon(savedTheme);
                console.log('Tema inicial aplicado:', savedTheme);
            }, 100);

            // Event listener para toggle
            themeButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                console.log('Alterando tema de', currentTheme, 'para', newTheme);
                
                // Aplicar novo tema com animação suave
                document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
                
                // Remover tema anterior
                document.documentElement.removeAttribute('data-theme');
                document.body.classList.remove('theme-light', 'theme-dark');
                
                // Aplicar novo tema
                setTimeout(() => {
                    document.documentElement.setAttribute('data-theme', newTheme);
                    document.body.classList.add(`theme-${newTheme}`);
                    localStorage.setItem('theme', newTheme);
                    
                    // Atualizar ícone
                    this.updateThemeButtonIcon(newTheme);
                    
                    console.log('Tema alterado para:', newTheme);
                    
                    // Remover transition após aplicação
                    setTimeout(() => {
                        document.body.style.transition = '';
                    }, 300);
                }, 50);
            });
        },

        // =========== ATUALIZAR ÍCONE DO TEMA =========== 
        updateThemeButtonIcon: function(theme) {
            const themeButton = document.getElementById('theme-button');
            if (!themeButton) return;

            const icon = themeButton.querySelector('i');
            if (!icon) return;

            // Remover classes antigas
            icon.classList.remove('fa-sun', 'fa-moon');
            
            // Adicionar classe correta
            if (theme === 'dark') {
                icon.classList.add('fa-sun');
                themeButton.setAttribute('aria-label', 'Mudar para tema claro');
                themeButton.setAttribute('title', 'Mudar para tema claro');
            } else {
                icon.classList.add('fa-moon');
                themeButton.setAttribute('aria-label', 'Mudar para tema escuro');
                themeButton.setAttribute('title', 'Mudar para tema escuro');
            }
        },

        // =========== CHATBOT =========== 
        setupChatbot: function() {
            if (!this.elements.chatbotIcon || !this.elements.chatbotContainer) {
                console.log('Chatbot não encontrado, pulando configuração');
                return;
            }

            console.log('Configurando chatbot...');

            // Toggle chatbot
            this.elements.chatbotIcon.addEventListener('click', () => {
                this.elements.chatbotContainer.classList.toggle('active');
                console.log('Chatbot toggled');
            });

            // Fechar chatbot
            const chatbotClose = this.elements.chatbotContainer.querySelector('.chatbot-close');
            if (chatbotClose) {
                chatbotClose.addEventListener('click', () => {
                    this.elements.chatbotContainer.classList.remove('active');
                });
            }

            // Enviar mensagem
            const chatbotForm = this.elements.chatbotContainer.querySelector('.chatbot-form');
            const chatbotInput = this.elements.chatbotContainer.querySelector('.chatbot-form input');
            const chatbotMessages = this.elements.chatbotContainer.querySelector('.chatbot-messages');

            if (chatbotForm && chatbotInput && chatbotMessages) {
                chatbotForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const message = chatbotInput.value.trim();
                    
                    if (message) {
                        this.addChatMessage(message, 'user');
                        chatbotInput.value = '';
                        
                        // Simular resposta do bot
                        setTimeout(() => {
                            this.addChatMessage('Obrigado pela sua mensagem! Entraremos em contato em breve.', 'bot');
                        }, 1000);
                    }
                });
            }
        },

        // =========== ADICIONAR MENSAGEM CHAT =========== 
        addChatMessage: function(text, type) {
            const chatbotMessages = this.elements.chatbotContainer.querySelector('.chatbot-messages');
            if (!chatbotMessages) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = text;
            
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        },

        // =========== EVENTOS DE SCROLL =========== 
        setupScrollEvents: function() {
            // Back to top button
            if (this.elements.backToTop) {
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        this.elements.backToTop.classList.add('active');
                    } else {
                        this.elements.backToTop.classList.remove('active');
                    }
                });

                this.elements.backToTop.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }

            // Smooth scrolling para links âncora
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        },

        // =========== ACESSIBILIDADE =========== 
        setupAccessibility: function() {
            // Skip links
            const skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.textContent = 'Pular para o conteúdo principal';
            skipLink.className = 'sr-only';
            skipLink.style.position = 'absolute';
            skipLink.style.top = '-40px';
            skipLink.style.left = '6px';
            skipLink.style.transition = 'top 0.3s';
            
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);

            // Detectar navegação por teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        },

        // =========== OTIMIZAÇÕES DE PERFORMANCE =========== 
        setupPerformanceOptimizations: function() {
            // Lazy loading de imagens
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                if (img.complete) {
                    this.handleLazyImageLoad(img);
                } else {
                    img.addEventListener('load', () => this.handleLazyImageLoad(img));
                }
            });

            // Intersection Observer para lazy loading de imagens
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.complete) {
                            this.handleLazyImageLoad(img);
                        } else {
                            img.addEventListener('load', () => this.handleLazyImageLoad(img));
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Observar imagens que estão a 50px do viewport
                threshold: 0.1 // 10% do elemento deve estar visível
            });

            // Observar todas as imagens que ainda não foram observadas
            document.querySelectorAll('img:not([loading="lazy"])').forEach(img => {
                observer.observe(img);
            });
        },

        // Função auxiliar para lazy loading de imagens
        handleLazyImageLoad: function(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.removeAttribute('loading');
            }
        }
    };

    // =========== INICIALIZAR =========== 
    HotelManzoni.init();

    // Expor para debug
    window.HotelManzoni = HotelManzoni;

})();

            
            
