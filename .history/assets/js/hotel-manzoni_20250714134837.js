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

            // Base de conhecimento do hotel
            this.chatbotKnowledge = {
                // Informações básicas
                nome: "Hotel Manzoni",
                cidade: "Campo Grande",
                estado: "MS",
                endereco: "Rua Barão do Rio Branco, 1270, Centro, Campo Grande - MS, CEP 79002-174",
                telefone: "(67) 3325-1270",
                whatsapp: "(67) 99988-1270",
                email: "reservas@hotelmanzoni.com.br",
                checkin: "14:00",
                checkout: "12:00",
                fundacao: "2005",
                quartos_total: 45,

                // Quartos e preços
                quartos: {
                    standard: {
                        nome: "Quarto Casal Standard",
                        preco: 189,
                        cama: "Queen size (1,58m x 1,98m)",
                        caracteristicas: ["Ar-condicionado", "TV LED 32\"", "Wi-Fi 100Mbps", "Frigobar"],
                        pet_friendly: true,
                        taxa_pet: 40,
                        descricao: "Confortável quarto com cama de casal queen size, ideal para casais em viagem de negócios ou lazer."
                    },
                    individual: {
                        nome: "Quarto Individual",
                        preco: 149,
                        cama: "Solteiro (0,88m x 1,88m)",
                        caracteristicas: ["Ar-condicionado", "TV LED 32\"", "Wi-Fi 100Mbps", "Mesa de trabalho"],
                        pet_friendly: false,
                        descricao: "Quarto funcional com mesa de trabalho e iluminação dedicada, ideal para viajantes a negócios."
                    },
                    suite: {
                        nome: "Suíte Executiva",
                        preco: 289,
                        cama: "King size (1,93m x 2,03m)",
                        caracteristicas: ["Ar-condicionado", "Smart TV 43\"", "Máquina de café", "Banheira", "Área de estar"],
                        pet_friendly: true,
                        taxa_pet: 50,
                        descricao: "Ampla suíte com área de estar separada e vista privilegiada da cidade. Perfeita para estadias prolongadas."
                    }
                },

                // Serviços
                servicos: [
                    "Café da manhã buffet (6h30 às 10h00)",
                    "Wi-Fi gratuito 100Mbps",
                    "Estacionamento gratuito",
                    "Recepção 24 horas",
                    "Business center",
                    "Lavanderia (entrega no mesmo dia até 10h)",
                    "Serviço de quarto",
                    "Cofre na recepção"
                ],

                // Localização e pontos de interesse
                localizacao: {
                    centro: "No centro de Campo Grande",
                    distancias: {
                        "Parque das Nações": "10 minutos",
                        "Shopping Campo Grande": "10 minutos",
                        "Aeroporto": "25 minutos",
                        "Rodoviária": "15 minutos",
                        "UFMS": "20 minutos"
                    }
                },

                // Políticas
                politicas: {
                    cancelamento: "Cancelamento gratuito até 24h antes do check-in",
                    criancas: "Crianças até 12 anos não pagam (máximo 2 por quarto)",
                    cafe_manha: "Incluído na diária",
                    estacionamento: "Gratuito e coberto",
                    internet: "Wi-Fi gratuito em todas as áreas",
                    animais: "Permitidos mediante taxa adicional"
                }
            };

            // Padrões de perguntas e respostas
            this.chatbotPatterns = [
                // Saudações
                {
                    patterns: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "ei", "hello", "hey"],
                    responses: [
                        "Olá! Bem-vindo ao Hotel Manzoni! 😊 Como posso ajudá-lo hoje?",
                        "Oi! Sou o assistente virtual do Hotel Manzoni. Em que posso ajudá-lo?",
                        "Olá! É um prazer falar com você. Como posso auxiliá-lo com sua estadia?"
                    ]
                },

                // Despedidas
                {
                    patterns: ["tchau", "obrigado", "obrigada", "valeu", "até logo", "bye", "thanks"],
                    responses: [
                        "Foi um prazer ajudá-lo! Esperamos vê-lo em breve no Hotel Manzoni! 🏨",
                        "Obrigado por escolher o Hotel Manzoni! Tenha um ótimo dia! 😊",
                        "Até logo! Estamos sempre aqui para ajudá-lo!"
                    ]
                },

                // Preços e quartos
                {
                    patterns: ["preço", "precos", "valor", "quanto custa", "diária", "diaria", "quartos", "acomodações", "acomodacoes"],
                    response: () => {
                        let resp = "💰 **Nossos Preços (por diária):**\n\n";
                        Object.entries(this.chatbotKnowledge.quartos).forEach(([key, quarto]) => {
                            resp += `🏨 **${quarto.nome}**: R$ ${quarto.preco}\n`;
                            resp += `   ${quarto.descricao}\n\n`;
                        });
                        resp += "Todos os quartos incluem café da manhã! ☕";
                        return resp;
                    }
                },

                // Contato e localização
                {
                    patterns: ["telefone", "contato", "endereço", "endereco", "onde fica", "localização", "localizacao", "como chegar"],
                    response: () => {
                        return `📍 **Hotel Manzoni - Informações de Contato:**\n\n` +
                               `🏨 **Endereço**: ${this.chatbotKnowledge.endereco}\n\n` +
                               `📞 **Telefone**: ${this.chatbotKnowledge.telefone}\n` +
                               `📱 **WhatsApp**: ${this.chatbotKnowledge.whatsapp}\n` +
                               `📧 **Email**: ${this.chatbotKnowledge.email}\n\n` +
                               `🌟 Estamos no coração de Campo Grande, próximo aos principais pontos da cidade!`;
                    }
                },

                // Check-in/Check-out
                {
                    patterns: ["check", "checkin", "checkout", "horário", "horario", "que horas"],
                    response: () => {
                        return `🕐 **Horários do Hotel:**\n\n` +
                               `✅ **Check-in**: ${this.chatbotKnowledge.checkin}\n` +
                               `✅ **Check-out**: ${this.chatbotKnowledge.checkout}\n` +
                               `🕐 **Recepção**: 24 horas\n\n` +
                               `💡 Check-in antecipado e check-out tardio sujeitos à disponibilidade!`;
                    }
                },

                // Serviços
                {
                    patterns: ["serviços", "servicos", "o que tem", "o que oferece", "comodidades", "wifi", "internet", "café", "cafe"],
                    response: () => {
                        return `🌟 **Nossos Serviços:**\n\n` +
                               this.chatbotKnowledge.servicos.map(servico => `✅ ${servico}`).join('\n') +
                               `\n\n🎯 Tudo pensado para sua comodidade e conforto!`;
                    }
                },

                // Pet friendly
                {
                    patterns: ["pet", "animal", "cachorro", "gato", "animais", "pode trazer"],
                    response: () => {
                        return `🐕 **Política Pet Friendly:**\n\n` +
                               `✅ Sim! Aceitamos animais de estimação\n` +
                               `💰 **Quarto Standard**: +R$ ${this.chatbotKnowledge.quartos.standard.taxa_pet}/diária\n` +
                               `💰 **Suíte Executiva**: +R$ ${this.chatbotKnowledge.quartos.suite.taxa_pet}/diária\n` +
                               `❌ **Quarto Individual**: Não aceita pets\n\n` +
                               `📋 Necessário informar na reserva!`;
                    }
                },

                // Reservas
                {
                    patterns: ["reserva", "reservar", "disponibilidade", "vaga", "booking"],
                    response: () => {
                        return `📅 **Para fazer sua reserva:**\n\n` +
                               `📞 **Telefone**: ${this.chatbotKnowledge.telefone}\n` +
                               `📱 **WhatsApp**: ${this.chatbotKnowledge.whatsapp}\n` +
                               `📧 **Email**: ${this.chatbotKnowledge.email}\n\n` +
                               `🎯 Nossa equipe verificará a disponibilidade e criará a melhor proposta para você!\n\n` +
                               `💡 **Dica**: Reserve com antecedência para garantir o melhor preço!`;
                    }
                },

                // Localização e distâncias
                {
                    patterns: ["perto", "próximo", "distância", "distancia", "shopping", "aeroporto", "rodoviária", "rodoviaria"],
                    response: () => {
                        let resp = `🗺️ **Nossa Localização Privilegiada:**\n\n`;
                        Object.entries(this.chatbotKnowledge.localizacao.distancias).forEach(([local, tempo]) => {
                            resp += `📍 ${local}: ${tempo}\n`;
                        });
                        resp += `\n🌟 No centro de Campo Grande, com fácil acesso a tudo!`;
                        return resp;
                    }
                },

                // Café da manhã
                {
                    patterns: ["café da manhã", "cafe da manha", "breakfast", "comida", "alimentação", "alimentacao"],
                    response: () => {
                        return `☕ **Café da Manhã:**\n\n` +
                               `🕕 **Horário**: 6h30 às 10h00\n` +
                               `🍳 **Tipo**: Buffet completo\n` +
                               `🌎 **Opções**: Regionais e internacionais\n` +
                               `✅ **Incluído**: Em todas as diárias\n\n` +
                               `😋 Começe bem o seu dia com nossa variedade de sabores!`;
                    }
                },

                // Estacionamento
                {
                    patterns: ["estacionamento", "estacionar", "carro", "vaga", "garage", "garagem"],
                    response: () => {
                        return `🚗 **Estacionamento:**\n\n` +
                               `✅ **Gratuito** para todos os hóspedes\n` +
                               `🏢 **Coberto** e seguro\n` +
                               `🕐 **Disponível**: 24 horas\n` +
                               `📍 **Localização**: No próprio hotel\n\n` +
                               `🎯 Uma preocupação a menos para você!`;
                    }
                },

                // Cancelamento
                {
                    patterns: ["cancelar", "cancelamento", "política", "politica", "reembolso"],
                    response: () => {
                        return `📋 **Política de Cancelamento:**\n\n` +
                               `✅ **Cancelamento gratuito** até 24h antes do check-in\n` +
                               `⏰ **Após 24h**: Taxa de 1 diária\n` +
                               `🚫 **No-show**: Cobrança integral\n\n` +
                               `💡 **Dica**: Mantenha-nos informados sobre qualquer mudança!`;
                    }
                }
            ];

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
                        chatbotForm.dispatchEvent(new Event('submit'));
                    }
                });
            }
        },

        // =========== PROCESSAR MENSAGEM DO CHAT =========== 
        processChatMessage: function(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            // Procurar padrão correspondente
            for (const pattern of this.chatbotPatterns) {
                if (pattern.patterns.some(p => lowerMessage.includes(p))) {
                    if (typeof pattern.response === 'function') {
                        return pattern.response();
                    } else if (Array.isArray(pattern.responses)) {
                        return pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
                    } else {
                        return pattern.response;
                    }
                }
            }

            // Respostas para perguntas específicas não cobertas
            if (lowerMessage.includes('quantos quartos') || lowerMessage.includes('quantos')) {
                return `🏨 **Sobre o Hotel Manzoni:**\n\n✅ ${this.chatbotKnowledge.quartos_total} quartos modernos\n✅ Fundado em ${this.chatbotKnowledge.fundacao}\n✅ Localização privilegiada no centro\n\n🌟 Tradição em hospitalidade há quase 20 anos!`;
            }

            if (lowerMessage.includes('crianças') || lowerMessage.includes('criancas') || lowerMessage.includes('criança')) {
                return `👶 **Política para Crianças:**\n\n✅ **Crianças até 12 anos**: Não pagam\n📏 **Limite**: Máximo 2 crianças por quarto\n🛏️ **Acomodação**: Na cama existente\n💡 **Berço**: Disponível mediante solicitação\n\n👨‍👩‍👧‍👦 Famílias são sempre bem-vindas!`;
            }

            // Resposta padrão para perguntas não reconhecidas
            const defaultResponses = [
                `Desculpe, não entendi sua pergunta. 😅 Posso ajudá-lo com:\n\n🏨 Informações sobre quartos e preços\n📍 Localização e contato\n🕐 Horários e check-in/out\n🌟 Serviços do hotel\n📅 Como fazer reservas\n\nO que gostaria de saber?`,
                
                `Hmm, não tenho certeza sobre isso. 🤔 Mas posso te ajudar com:\n\n💰 Preços e promoções\n🐕 Política pet friendly\n☕ Café da manhã\n🚗 Estacionamento\n📋 Políticas do hotel\n\nQual dessas informações você gostaria?`,
                
                `Não consegui entender sua pergunta. 😊 Que tal tentar perguntar sobre:\n\n"Quanto custa o quarto?"\n"Onde fica o hotel?"\n"Que horas é o check-in?"\n"Aceitam animais?"\n"Como fazer reserva?"\n\nEstou aqui para ajudar!`
            ];
            
            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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

            
            
