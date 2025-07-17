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
            
            // Aplicar tema inicial imediatamente
            this.applyInitialTheme();
            
            // Esperar DOM carregar
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.setupElements.bind(this));
            } else {
                this.setupElements();
            }
        },

        // =========== APLICAR TEMA INICIAL =========== 
        applyInitialTheme: function() {
            // Detectar preferência do sistema
            let initialTheme = 'light';
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                initialTheme = 'dark';
            }

            // Carregar tema salvo ou usar preferência do sistema
            const savedTheme = localStorage.getItem('theme') || initialTheme;
            
            console.log('Aplicando tema inicial:', savedTheme);
            
            // Aplicar tema imediatamente
            document.documentElement.setAttribute('data-theme', savedTheme);
            document.body.classList.remove('theme-light', 'theme-dark');
            document.body.classList.add(`theme-${savedTheme}`);
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

            // Função para abrir menu
            const openMenu = () => {
                this.elements.navigation.classList.add('active');
                this.elements.mobileMenuToggle.classList.add('active');
                this.elements.body.classList.add('menu-open');
                
                // Atualizar acessibilidade
                this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
                
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

            // Obter tema atual
            const currentTheme = document.documentElement.getAttribute('data-theme') || 
                                localStorage.getItem('theme') || 'light';
            
            // Atualizar ícone inicial
            this.updateThemeButtonIcon(currentTheme);

            // Event listener para toggle
            themeButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                console.log('Alterando tema de', currentTheme, 'para', newTheme);
                
                // Aplicar novo tema
                document.documentElement.setAttribute('data-theme', newTheme);
                document.body.classList.remove('theme-light', 'theme-dark');
                document.body.classList.add(`theme-${newTheme}`);
                localStorage.setItem('theme', newTheme);
                
                // Atualizar ícone
                this.updateThemeButtonIcon(newTheme);
                
                console.log('Tema alterado para:', newTheme);
            });
        },

        // =========== ATUALIZAR ÍCONE DO TEMA =========== 
        updateThemeButtonIcon: function(theme) {
            const themeButton = document.getElementById('theme-button');
            if (!themeButton) {
                console.log('Botão de tema não encontrado para atualizar ícone');
                return;
            }

            const icon = themeButton.querySelector('i');
            if (!icon) {
                console.log('Ícone do tema não encontrado');
                return;
            }

            // Remover classes antigas
            icon.classList.remove('fa-sun', 'fa-moon');
            
            // Adicionar classe correta
            if (theme === 'dark') {
                icon.classList.add('fa-sun');
                console.log('Ícone alterado para sol (tema escuro ativo)');
                themeButton.setAttribute('aria-label', 'Mudar para tema claro');
                themeButton.setAttribute('title', 'Mudar para tema claro');
            } else {
                icon.classList.add('fa-moon');
                console.log('Ícone alterado para lua (tema claro ativo)');
                themeButton.setAttribute('aria-label', 'Mudar para tema escuro');
                themeButton.setAttribute('title', 'Mudar para tema escuro');
            }
        },

        // =========== CHATBOT INTELIGENTE =========== 
        setupChatbot: function() {
            if (!this.elements.chatbotIcon || !this.elements.chatbotContainer) {
                console.log('Chatbot não encontrado, pulando configuração');
                return;
            }

            console.log('Configurando chatbot inteligente...');

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

            if (chatbotForm && chatbotInput) {
                chatbotForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const message = chatbotInput.value.trim();
                    
                    if (message) {
                        this.addChatMessage(message, 'user');
                        chatbotInput.value = '';
                        
                        // Processar resposta do bot
                        setTimeout(() => {
                            const response = this.processChatMessage(message);
                            this.addChatMessage(response, 'bot');
                        }, 800);
                    }
                });

                // Enter para enviar
                chatbotInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        chatbotForm.dispatchEvent(new Event('submit'));
                    }
                });
            }
        },

        // =========== PROCESSAR MENSAGEM DO CHAT =========== 
        processChatMessage: function(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            // Saudações
            if (this.matchesPattern(lowerMessage, ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "ei", "hello", "hey"])) {
                const responses = [
                    "Olá! Bem-vindo ao Hotel Manzoni! 😊 Como posso ajudá-lo hoje?",
                    "Oi! Sou o assistente virtual do Hotel Manzoni. Em que posso ajudá-lo?",
                    "Olá! É um prazer falar com você. Como posso auxiliá-lo com sua estadia?"
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // Despedidas
            if (this.matchesPattern(lowerMessage, ["tchau", "obrigado", "obrigada", "valeu", "até logo", "bye", "thanks"])) {
                const responses = [
                    "Foi um prazer ajudá-lo! Esperamos vê-lo em breve no Hotel Manzoni! 🏨",
                    "Obrigado por escolher o Hotel Manzoni! Tenha um ótimo dia! 😊",
                    "Até logo! Estamos sempre aqui para ajudá-lo!"
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }

            // Preços e quartos
            if (this.matchesPattern(lowerMessage, ["preço", "precos", "valor", "quanto custa", "diária", "diaria", "quartos", "acomodações", "acomodacoes"])) {
                return `💰 **Nossos Preços (por diária):**\n\n` +
                       `🏨 **Suíte Individual**: R$ 140\n` +
                       `   1 pessoa com cama de casal\n\n` +
                       `🏨 **Suíte Duplo**: R$ 170 (cama casal) / R$ 190 (camas individuais)\n` +
                       `   2 pessoas\n\n` +
                       `🏨 **Suíte Triplo**: R$ 200 (casal+solteiro) / R$ 220 (3 individuais)\n` +
                       `   3 pessoas\n\n` +
                       `🏨 **Suíte Quadruplo**: R$ 250\n` +
                       `   4 pessoas (casal + 2 solteiros)\n\n` +
                       `💰 **Pessoa adicional**: R$ 50\n` +
                       `👶 **Crianças até 3 anos**: Gratuito\n` +
                       `Todos os quartos incluem café da manhã! ☕`;
            }

            // Contato e localização
            if (this.matchesPattern(lowerMessage, ["telefone", "contato", "endereço", "endereco", "onde fica", "localização", "localizacao", "como chegar"])) {
                return `📍 **Hotel Manzoni - Informações de Contato:**\n\n` +
                       `🏨 **Endereço**: Rua Barão do Rio Branco, 343, Bairro Amambaí, Campo Grande - MS\n` +
                       `📮 **CEP**: 79008-060\n\n` +
                       `📞 **Telefone**: (67) 3253-2000\n` +
                       `📱 **WhatsApp**: (67) 3253-2000\n` +
                       `📧 **Email**: contato@hotelmanzoni.com.br\n\n` +
                       `🌟 Localização privilegiada em Campo Grande!`;
            }

            // Check-in/Check-out
            if (this.matchesPattern(lowerMessage, ["check", "checkin", "checkout", "horário", "horario", "que horas"])) {
                return `🕐 **Horários do Hotel:**\n\n` +
                       `✅ **Check-in**: 12:00\n` +
                       `✅ **Check-out**: 11:00\n` +
                       `🕐 **Recepção**: 24 horas\n` +
                       `☕ **Café da manhã**: 06:00 às 09:00\n\n` +
                       `💡 Check-in antecipado sujeito à disponibilidade!`;
            }

            // Serviços
            if (this.matchesPattern(lowerMessage, ["serviços", "servicos", "o que tem", "o que oferece", "comodidades", "wifi", "internet", "café", "cafe"])) {
                return `🌟 **Nossos Serviços:**\n\n` +
                       `✅ Café da manhã incluso (06:00 às 09:00)\n` +
                       `✅ Wi-Fi gratuito\n` +
                       `✅ Estacionamento (conforme disponibilidade)\n` +
                       `✅ Recepção 24 horas\n` +
                       `✅ Ar-condicionado em todos os quartos\n` +
                       `✅ Televisão\n` +
                       `✅ Frigobar\n\n` +
                       `🎯 Tudo pensado para sua comodidade!`;
            }

            // Pet friendly
            if (this.matchesPattern(lowerMessage, ["pet", "animal", "cachorro", "gato", "animais", "pode trazer"])) {
                return `🐕 **Política Pet Friendly:**\n\n` +
                       `✅ Sim! Aceitamos animais de estimação\n` +
                       `💰 **Quarto Standard**: +R$ 40/diária\n` +
                       `💰 **Suíte Executiva**: +R$ 50/diária\n` +
                       `❌ **Quarto Individual**: Não aceita pets\n\n` +
                       `📋 Necessário informar na reserva!`;
            }

            // Reservas
            if (this.matchesPattern(lowerMessage, ["reserva", "reservar", "disponibilidade", "vaga", "booking"])) {
                return `📅 **Para fazer sua reserva:**\n\n` +
                       `📞 **Telefone**: (67) 3325-1270\n` +
                       `📱 **WhatsApp**: (67) 99988-1270\n` +
                       `📧 **Email**: reservas@hotelmanzoni.com.br\n\n` +
                       `🎯 Nossa equipe verificará a disponibilidade!\n\n` +
                       `💡 **Dica**: Reserve com antecedência!`;
            }

            // Estacionamento
            if (this.matchesPattern(lowerMessage, ["estacionamento", "estacionar", "carro", "vaga", "garage", "garagem"])) {
                return `🚗 **Estacionamento:**\n\n` +
                       `✅ **Gratuito** para todos os hóspedes\n` +
                       `🏢 **Coberto** e seguro\n` +
                       `🕐 **Disponível**: 24 horas\n` +
                       `📍 **Localização**: No próprio hotel\n\n` +
                       `🎯 Uma preocupação a menos!`;
            }

            // Crianças
            if (this.matchesPattern(lowerMessage, ["crianças", "criancas", "criança", "filho", "filhos"])) {
                return `👶 **Política para Crianças:**\n\n` +
                       `✅ **Crianças até 12 anos**: Não pagam\n` +
                       `📏 **Limite**: Máximo 2 crianças por quarto\n` +
                       `🛏️ **Acomodação**: Na cama existente\n` +
                       `💡 **Berço**: Disponível mediante solicitação\n\n` +
                       `👨‍👩‍👧‍👦 Famílias são sempre bem-vindas!`;
            }

            // Resposta padrão
            return `Desculpe, não entendi sua pergunta. 😅 Posso ajudá-lo com:\n\n` +
                   `🏨 Informações sobre quartos e preços\n` +
                   `📍 Localização e contato\n` +
                   `🕐 Horários e check-in/out\n` +
                   `🌟 Serviços do hotel\n` +
                   `📅 Como fazer reservas\n` +
                   `🐕 Política pet friendly\n\n` +
                   `Experimente perguntar: "Quanto custa?" ou "Onde fica?"`;
        },

        // =========== VERIFICAR PADRÕES =========== 
        matchesPattern: function(message, patterns) {
            return patterns.some(pattern => message.includes(pattern));
        },

        // =========== ADICIONAR MENSAGEM CHAT =========== 
        addChatMessage: function(text, type) {
            const chatbotMessages = this.elements.chatbotContainer.querySelector('.chatbot-messages');
            if (!chatbotMessages) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            
            // Processar formatação para mensagens do bot
            if (type === 'bot') {
                // Converter quebras de linha para <br>
                let formattedText = text.replace(/\n/g, '<br>');
                
                // Converter **texto** para negrito
                formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                
                // Converter emojis e símbolos especiais para melhor visualização
                formattedText = formattedText.replace(/✅/g, '<span style="color: #28a745;">✅</span>');
                formattedText = formattedText.replace(/❌/g, '<span style="color: #dc3545;">❌</span>');
                formattedText = formattedText.replace(/💰/g, '<span style="color: #d4af37;">💰</span>');
                formattedText = formattedText.replace(/🏨/g, '<span style="color: #007bff;">🏨</span>');
                formattedText = formattedText.replace(/📞|📱|📧/g, '<span style="color: #28a745;">$&</span>');
                
                messageDiv.innerHTML = formattedText;
            } else {
                messageDiv.textContent = text;
            }
            
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Adicionar animação de entrada
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(10px)';
            setTimeout(() => {
                messageDiv.style.transition = 'all 0.3s ease';
                messageDiv.style.opacity = '1';
                messageDiv.style.transform = 'translateY(0)';
            }, 100);
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

            
            
