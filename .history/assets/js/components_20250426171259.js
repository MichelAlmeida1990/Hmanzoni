/**
 * Hotel Manzoni - Componentes Avançados
 * Versão: 1.1
 * 
 * Este arquivo contém componentes e funcionalidades avançadas
 * que complementam o script principal (script.js)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Objeto para armazenar todos os componentes avançados
    const HotelComponents = {
        // Configurações
        settings: {
            cursorEnabled: window.innerWidth > 1024, // Ativar cursor apenas em telas maiores
            chatbotApiEnabled: true, // Ativar integração com API externa para o chatbot
            chatbotApiUrl: 'https://api.openai.com/v1/chat/completions', // URL da API (exemplo)
            chatbotApiKey: '', // A ser preenchido com a chave da API
            animationEnabled: true,
            debug: false // Modo de depuração
        },

        // Inicialização
        init: function() {
            this.setupCustomCursor();
            this.setupAdvancedChatbot();
            this.setupParallaxEffects();
            this.setupAdvancedGallery();
            this.setupInteractiveMap();
            
            // Registrar eventos globais
            this.registerGlobalEvents();
            
            if (this.settings.debug) {
                console.log('Hotel Manzoni Components inicializado com sucesso!');
            }
        },

        // Registrar eventos globais
        registerGlobalEvents: function() {
            // Detectar mudanças de tema e ajustar componentes
            document.addEventListener('themeChanged', (e) => {
                if (this.settings.debug) {
                    console.log('Tema alterado para:', e.detail.theme);
                }
                // Atualizar componentes conforme necessário
                this.updateComponentsTheme(e.detail.theme);
            });
            
            // Detectar redimensionamento da janela
            window.addEventListener('resize', () => {
                // Atualizar configuração do cursor com base no tamanho da tela
                this.settings.cursorEnabled = window.innerWidth > 1024;
                
                // Atualizar visibilidade do cursor
                this.updateCursorVisibility();
            });
        },

        // Atualizar tema dos componentes
        updateComponentsTheme: function(theme) {
            // Atualizar cursor personalizado
            const cursorElements = document.querySelectorAll('.custom-cursor, .cursor-dot, .cursor-ring');
            cursorElements.forEach(el => {
                el.setAttribute('data-theme', theme);
            });
            
            // Atualizar outros componentes conforme necessário
        },

        // Cursor personalizado
        setupCustomCursor: function() {
            if (!this.settings.cursorEnabled) return;
            
            // Criar elementos do cursor
            const cursorContainer = document.createElement('div');
            cursorContainer.className = 'custom-cursor';
            
            const cursorDot = document.createElement('div');
            cursorDot.className = 'cursor-dot';
            
            const cursorRing = document.createElement('div');
            cursorRing.className = 'cursor-ring';
            
            // Adicionar ao DOM
            cursorContainer.appendChild(cursorDot);
            cursorContainer.appendChild(cursorRing);
            document.body.appendChild(cursorContainer);
            
            // Definir tema inicial
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            cursorContainer.setAttribute('data-theme', currentTheme);
            
            // Variáveis para animação suave
            let mouseX = 0;
            let mouseY = 0;
            let dotX = 0;
            let dotY = 0;
            let ringX = 0;
            let ringY = 0;
            let animationId = null;
            let isPageVisible = true;
            
            // Elementos clicáveis para efeito hover
            const clickableElements = 'a, button, input, textarea, select, .clickable, .btn, .card, .room-card, .service-card, .gallery-item, .testimonial';
            
            // Atualizar posição do cursor
            document.addEventListener('mousemove', (e) => {
                if (!this.settings.cursorEnabled) return;
                
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                // Verificar se o mouse está sobre um elemento clicável
                const target = e.target;
                const isClickable = target.matches(clickableElements) || target.closest(clickableElements);
                
                if (isClickable) {
                    cursorContainer.classList.add('cursor-hover');
                } else {
                    cursorContainer.classList.remove('cursor-hover');
                }
            });
            
            // Efeito de clique
            document.addEventListener('mousedown', () => {
                if (!this.settings.cursorEnabled) return;
                cursorContainer.classList.add('cursor-click');
            });
            
            document.addEventListener('mouseup', () => {
                if (!this.settings.cursorEnabled) return;
                cursorContainer.classList.remove('cursor-click');
            });
            
            // Animação suave do cursor
            const animateCursor = () => {
                if (!this.settings.cursorEnabled) return;
                
                // Animação suave para o ponto
                dotX += (mouseX - dotX) * 0.2;
                dotY += (mouseY - dotY) * 0.2;
                
                // Animação mais lenta para o anel
                ringX += (mouseX - ringX) * 0.1;
                ringY += (mouseY - ringY) * 0.1;
                
                // Aplicar posições
                cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
                cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
                
                // Continuar animação apenas se a página estiver visível
                if (isPageVisible) {
                    animationId = requestAnimationFrame(animateCursor);
                }
            };
            
            // Iniciar animação
            if (this.settings.cursorEnabled) {
                animationId = requestAnimationFrame(animateCursor);
            }
            
            // Pausar animação quando a página não está visível
            document.addEventListener('visibilitychange', () => {
                isPageVisible = document.visibilityState === 'visible';
                if (isPageVisible && this.settings.cursorEnabled && !animationId) {
                    animationId = requestAnimationFrame(animateCursor);
                } else if (!isPageVisible && animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            });
            
            // Método para atualizar visibilidade do cursor com fallback
            this.updateCursorVisibility = function() {
                if (this.settings.cursorEnabled) {
                    cursorContainer.style.display = 'block';
                    // Verificar se o container foi renderizado antes de ocultar o cursor nativo
                    if (cursorContainer.offsetWidth > 0 && cursorContainer.offsetHeight > 0) {
                        document.documentElement.style.cursor = 'none';
                    } else {
                        // Fallback: manter cursor nativo se o personalizado não renderizar
                        document.documentElement.style.cursor = '';
                    }
                } else {
                    cursorContainer.style.display = 'none';
                    document.documentElement.style.cursor = '';
                    // Cancelar animação se cursor estiver desativado
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            };
            
            // Configurar visibilidade inicial com delay para garantir renderização
            setTimeout(() => {
                this.updateCursorVisibility();
            }, 100);
        },

        // Chatbot avançado com integração de API
        // NOTA: Esta lógica será usada como base para unificar o chatbot do script.js
        setupAdvancedChatbot: function() {
            const chatbotIcon = document.querySelector('.chatbot-icon');
            const chatbotContainer = document.querySelector('.chatbot-container');
            
            if (!chatbotIcon || !chatbotContainer) return;
            
            // Verificar se já existe um chatbot básico e aprimorá-lo
            const existingMessages = chatbotContainer.querySelector('.chatbot-messages');
            const existingInput = chatbotContainer.querySelector('.chatbot-input input');
            const existingSend = chatbotContainer.querySelector('.chatbot-send');
            
            // Criar elementos adicionais para o chatbot avançado
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'chatbot-suggestions';
            
            // Adicionar sugestões iniciais
            const initialSuggestions = [
                'Como faço uma reserva?',
                'Quais são os horários de check-in?',
                'O hotel aceita pets?',
                'Tem estacionamento?'
            ];
            
            initialSuggestions.forEach(text => {
                const suggestion = document.createElement('button');
                suggestion.className = 'chatbot-suggestion';
                suggestion.textContent = text;
                suggestionsContainer.appendChild(suggestion);
                
                // Adicionar evento de clique
                suggestion.addEventListener('click', () => {
                    if (existingInput) {
                        existingInput.value = text;
                        this.sendChatbotMessage(text, existingMessages);
                        existingInput.value = '';
                    }
                });
            });
            
            // Inserir sugestões após as mensagens
            if (existingMessages) {
                existingMessages.parentNode.insertBefore(suggestionsContainer, existingMessages.nextSibling);
            }
            
            // Substituir função de envio de mensagem
            if (existingInput && existingSend) {
                // Remover eventos anteriores
                const newSend = existingSend.cloneNode(true);
                existingSend.parentNode.replaceChild(newSend, existingSend);
                
                const newInput = existingInput.cloneNode(true);
                existingInput.parentNode.replaceChild(newInput, existingInput);
                
                // Adicionar novos eventos
                newSend.addEventListener('click', () => {
                    const message = newInput.value.trim();
                    if (message) {
                        this.sendChatbotMessage(message, existingMessages);
                        newInput.value = '';
                    }
                });
                
                newInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const message = newInput.value.trim();
                        if (message) {
                            this.sendChatbotMessage(message, existingMessages);
                            newInput.value = '';
                        }
                    }
                });
            }
            
            // Adicionar botão para alternar entre modo básico e avançado
            const modeToggle = document.createElement('button');
            modeToggle.className = 'chatbot-mode-toggle';
            modeToggle.innerHTML = '<i class="fas fa-robot"></i>';
            modeToggle.title = 'Alternar modo de IA';
            
            // Inserir botão no header do chatbot
            const chatbotHeader = chatbotContainer.querySelector('.chatbot-header');
            if (chatbotHeader) {
                chatbotHeader.appendChild(modeToggle);
                
                // Adicionar evento de clique
                modeToggle.addEventListener('click', () => {
                    this.settings.chatbotApiEnabled = !this.settings.chatbotApiEnabled;
                    
                    // Atualizar aparência do botão
                    if (this.settings.chatbotApiEnabled) {
                        modeToggle.innerHTML = '<i class="fas fa-robot"></i>';
                        modeToggle.title = 'Modo IA ativado';
                        modeToggle.classList.add('active');
                        
                        // Mostrar mensagem informativa
                        this.addBotMessage('Modo IA avançado ativado. Como posso ajudar?', existingMessages);
                    } else {
                        modeToggle.innerHTML = '<i class="fas fa-comment"></i>';
                        modeToggle.title = 'Modo básico ativado';
                        modeToggle.classList.remove('active');
                        
                        // Mostrar mensagem informativa
                        this.addBotMessage('Modo básico ativado. Posso responder perguntas frequentes sobre o hotel.', existingMessages);
                    }
                });
            }
        },

        // Função para enviar mensagem no chatbot
        // NOTA: Função principal para unificação no script.js
        sendChatbotMessage: function(message, messagesContainer) {
            if (!messagesContainer) return;
            
            // Adicionar mensagem do usuário
            const userMessage = document.createElement('div');
            userMessage.className = 'message user';
            userMessage.textContent = message;
            messagesContainer.appendChild(userMessage);
            
            // Rolar para a última mensagem
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Mostrar indicador de digitação
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message bot typing';
            typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Processar a mensagem e gerar resposta
            if (this.settings.chatbotApiEnabled && this.settings.chatbotApiKey) {
                // Usar API externa para respostas mais avançadas
                this.getChatbotApiResponse(message)
                    .then(response => {
                        // Remover indicador de digitação
                        messagesContainer.removeChild(typingIndicator);
                        
                        // Adicionar resposta da API
                        this.addBotMessage(response, messagesContainer);
                    })
                    .catch(error => {
                        console.error('Erro na API do chatbot:', error);
                        
                        // Remover indicador de digitação
                        messagesContainer.removeChild(typingIndicator);
                        
                        // Fallback para resposta básica
                        const fallbackResponse = this.getBasicChatbotResponse(message);
                        this.addBotMessage(fallbackResponse, messagesContainer);
                    });
            } else {
                // Usar respostas básicas pré-definidas
                setTimeout(() => {
                    // Remover indicador de digitação
                    messagesContainer.removeChild(typingIndicator);
                    
                    // Gerar resposta básica
                    const response = this.getBasicChatbotResponse(message);
                    this.addBotMessage(response, messagesContainer);
                }, 1000);
            }
        },

        // Adicionar mensagem do bot
        // NOTA: Função a ser reutilizada no script.js
        addBotMessage: function(message, messagesContainer) {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.textContent = message;
            messagesContainer.appendChild(botMessage);
            
            // Rolar para a última mensagem
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Atualizar sugestões com base na conversa
            this.updateChatbotSuggestions(message);
        },

        // Obter resposta da API externa
        getChatbotApiResponse: async function(message) {
            try {
                const response = await fetch(this.settings.chatbotApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.settings.chatbotApiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: "Você é um assistente virtual do Hotel Manzoni, um hotel de luxo. Forneça respostas concisas e úteis sobre reservas, acomodações, serviços e políticas do hotel. Mantenha as respostas amigáveis e profissionais. Limite suas respostas a no máximo 2 parágrafos curtos."
                            },
                            {
                                role: "user",
                                content: message
                            }
                        ],
                        max_tokens: 150
                    })
                });
                
                const data = await response.json();
                return data.choices[0].message.content.trim();
            } catch (error) {
                console.error('Erro ao obter resposta da API:', error);
                throw error;
            }
        },

        // Obter resposta básica pré-definida
        // NOTA: Função a ser reutilizada no script.js
        getBasicChatbotResponse: function(message) {
            const messageLower = message.toLowerCase();
            
            // Respostas baseadas em palavras-chave
            if (messageLower.includes('reserva') || messageLower.includes('quarto')) {
                return "Para fazer uma reserva, você pode entrar em contato pelo telefone (11) 5555-5555 ou preencher o formulário de contato. Em qual data você gostaria de se hospedar?";
            } else if (messageLower.includes('preço') || messageLower.includes('valor') || messageLower.includes('custo')) {
                return "Nossos preços variam de acordo com o tipo de quarto. Temos quartos a partir de R$120 a diária. Para um orçamento específico, informe a data e o tipo de quarto desejado.";
            } else if (messageLower.includes('endereço') || messageLower.includes('localização') || messageLower.includes('onde fica')) {
                return "Estamos localizados na Av. Principal, 1000 - Centro, São Paulo, SP - CEP 01000-000. Temos fácil acesso por transporte público e estamos a apenas 15 minutos do aeroporto.";
            } else if (messageLower.includes('check-in') || messageLower.includes('checkout') || messageLower.includes('horário')) {
                return "Nosso horário de check-in é a partir das 14h e o check-out até às 12h. Se precisar de horários especiais, entre em contato conosco antecipadamente.";
            } else if (messageLower.includes('café') || messageLower.includes('refeição') || messageLower.includes('restaurante')) {
                return "Oferecemos café da manhã completo incluso em todas as reservas, servido das 6h30 às 10h. Nosso restaurante também serve almoço e jantar com o melhor da gastronomia italiana.";
            } else if (messageLower.includes('wifi') || messageLower.includes('internet')) {
                return "Sim, oferecemos Wi-Fi gratuito de alta velocidade em todas as áreas do hotel.";
            } else if (messageLower.includes('pet') || messageLower.includes('cachorro') || messageLower.includes('gato') || messageLower.includes('animal')) {
                return "Somos pet friendly! Aceitamos animais de pequeno e médio porte em quartos selecionados. Informe-nos com antecedência para preparamos tudo para seu amigo de quatro patas.";
            } else if (messageLower.includes('estacionamento') || messageLower.includes('garagem') || messageLower.includes('carro')) {
                return "Sim, temos estacionamento privativo para hóspedes. O serviço tem custo adicional de R$25 por diária com serviço de manobrista.";
            } else if (messageLower.includes('piscina') || messageLower.includes('academia') || messageLower.includes('spa')) {
                return "Nosso hotel conta com piscina aquecida, academia completa e spa com diversos tratamentos. Todos esses serviços estão disponíveis para nossos hóspedes.";
            } else if (messageLower.includes('cancelamento') || messageLower.includes('cancelar')) {
                return "Nossa política de cancelamento permite cancelamentos gratuitos até 48h antes da data de check-in. Após esse prazo
