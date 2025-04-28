/**
 * Hotel Manzoni - Componentes Avançados
 * Versão: 1.1
 */

document.addEventListener('DOMContentLoaded', function() {
    // Objeto para armazenar todos os componentes avançados
    const HotelComponents = {
        // Configurações
        settings: {
            chatbotApiUrl: 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V3-0324',
            chatbotApiKey: 'hf_sua_chave_da_huggingface_aqui', // Substitua pela sua chave da Hugging Face
            chatbotApiEnabled: true,
            
            cursorEnabled: window.innerWidth > 1024,
            animationEnabled: true,
            debug: false
        },

        // Inicialização
        init: function() {
            this.setupCustomCursor();
            this.setupAdvancedChatbot();
            this.setupParallaxEffects();
            this.setupAdvancedGallery();
            this.setupInteractiveMap();
            
            this.registerGlobalEvents();
            this.exposeToGlobalApp();
            
            if (this.settings.debug) {
                console.log('Hotel Manzoni Components inicializado com sucesso!');
            }
        },
        
        // Expor funções para o objeto global HotelApp
        exposeToGlobalApp: function() {
            if (typeof window.HotelApp !== 'undefined') {
                window.HotelApp.sendChatbotMessage = this.sendChatbotMessage.bind(this);
                
                if (this.settings.debug) {
                    console.log('Funções avançadas de chatbot integradas ao HotelApp');
                }
            }
        },

        // Registrar eventos globais
        registerGlobalEvents: function() {
            document.addEventListener('themeChanged', (e) => {
                if (this.settings.debug) {
                    console.log('Tema alterado para:', e.detail.theme);
                }
                this.updateComponentsTheme(e.detail.theme);
            });
            
            window.addEventListener('resize', () => {
                this.settings.cursorEnabled = window.innerWidth > 1024;
                this.updateCursorVisibility();
            });
        },

        // Atualizar tema dos componentes
        updateComponentsTheme: function(theme) {
            const cursorElements = document.querySelectorAll('.custom-cursor, .cursor-dot, .cursor-ring');
            cursorElements.forEach(el => {
                el.setAttribute('data-theme', theme);
            });
        },

        // Cursor personalizado
        setupCustomCursor: function() {
            if (!this.settings.cursorEnabled) return;
            
            const cursorContainer = document.createElement('div');
            cursorContainer.className = 'custom-cursor';
            
            const cursorDot = document.createElement('div');
            cursorDot.className = 'cursor-dot';
            
            const cursorRing = document.createElement('div');
            cursorRing.className = 'cursor-ring';
            
            cursorContainer.appendChild(cursorDot);
            cursorContainer.appendChild(cursorRing);
            document.body.appendChild(cursorContainer);
            
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            cursorContainer.setAttribute('data-theme', currentTheme);
            
            let mouseX = 0;
            let mouseY = 0;
            let dotX = 0;
            let dotY = 0;
            let ringX = 0;
            let ringY = 0;
            let animationId = null;
            let isPageVisible = true;
            
            const clickableElements = 'a, button, input, textarea, select, .clickable, .btn, .card, .room-card, .service-card, .gallery-item, .testimonial';
            
            document.addEventListener('mousemove', (e) => {
                if (!this.settings.cursorEnabled) return;
                
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                const target = e.target;
                const isClickable = target.matches(clickableElements) || target.closest(clickableElements);
                
                if (isClickable) {
                    cursorContainer.classList.add('cursor-hover');
                } else {
                    cursorContainer.classList.remove('cursor-hover');
                }
            });
            
            document.addEventListener('mousedown', () => {
                if (!this.settings.cursorEnabled) return;
                cursorContainer.classList.add('cursor-click');
            });
            
            document.addEventListener('mouseup', () => {
                if (!this.settings.cursorEnabled) return;
                cursorContainer.classList.remove('cursor-click');
            });
            
            const animateCursor = () => {
                if (!this.settings.cursorEnabled) return;
                
                dotX += (mouseX - dotX) * 0.2;
                dotY += (mouseY - dotY) * 0.2;
                
                ringX += (mouseX - ringX) * 0.1;
                ringY += (mouseY - ringY) * 0.1;
                
                cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
                cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
                
                if (isPageVisible) {
                    animationId = requestAnimationFrame(animateCursor);
                }
            };
            
            if (this.settings.cursorEnabled) {
                animationId = requestAnimationFrame(animateCursor);
            }
            
            document.addEventListener('visibilitychange', () => {
                isPageVisible = document.visibilityState === 'visible';
                if (isPageVisible && this.settings.cursorEnabled && !animationId) {
                    animationId = requestAnimationFrame(animateCursor);
                } else if (!isPageVisible && animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            });
            
            this.updateCursorVisibility = function() {
                if (this.settings.cursorEnabled) {
                    cursorContainer.style.display = 'block';
                    if (cursorContainer.offsetWidth > 0 && cursorContainer.offsetHeight > 0) {
                        document.documentElement.style.cursor = 'none';
                    } else {
                        document.documentElement.style.cursor = '';
                    }
                } else {
                    cursorContainer.style.display = 'none';
                    document.documentElement.style.cursor = '';
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            };
            
            setTimeout(() => {
                this.updateCursorVisibility();
            }, 100);
        },

        // Chatbot avançado com integração de API
        setupAdvancedChatbot: function() {
            const chatbotIcon = document.querySelector('.chatbot-icon');
            const chatbotContainer = document.querySelector('.chatbot-container');
            
            if (!chatbotIcon || !chatbotContainer) return;
            
            const existingMessages = chatbotContainer.querySelector('.chatbot-messages');
            const existingInput = chatbotContainer.querySelector('.chatbot-input input');
            const existingSend = chatbotContainer.querySelector('.chatbot-send');
            
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'chatbot-suggestions';
            
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
                
                suggestion.addEventListener('click', () => {
                    if (existingInput) {
                        existingInput.value = text;
                        this.sendChatbotMessage(text, existingMessages);
                        existingInput.value = '';
                    }
                });
            });
            
            if (existingMessages) {
                existingMessages.parentNode.insertBefore(suggestionsContainer, existingMessages.nextSibling);
            }
            
            if (existingInput && existingSend) {
                const newSend = existingSend.cloneNode(true);
                existingSend.parentNode.replaceChild(newSend, existingSend);
                
                const newInput = existingInput.cloneNode(true);
                existingInput.parentNode.replaceChild(newInput, existingInput);
                
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
            
            const modeToggle = document.createElement('button');
            modeToggle.className = 'chatbot-mode-toggle';
            modeToggle.innerHTML = '<i class="fas fa-robot"></i>';
            modeToggle.title = 'Alternar modo de IA';
            
            const chatbotHeader = chatbotContainer.querySelector('.chatbot-header');
            if (chatbotHeader) {
                chatbotHeader.appendChild(modeToggle);
                
                modeToggle.addEventListener('click', () => {
                    this.settings.chatbotApiEnabled = !this.settings.chatbotApiEnabled;
                    
                    if (this.settings.chatbotApiEnabled) {
                        modeToggle.innerHTML = '<i class="fas fa-robot"></i>';
                        modeToggle.title = 'Modo IA ativado';
                        modeToggle.classList.add('active');
                        
                        this.addBotMessage('Modo IA avançado ativado. Como posso ajudar?', existingMessages);
                    } else {
                        modeToggle.innerHTML = '<i class="fas fa-comment"></i>';
                        modeToggle.title = 'Modo básico ativado';
                        modeToggle.classList.remove('active');
                        
                        this.addBotMessage('Modo básico ativado. Posso responder perguntas frequentes sobre o hotel.', existingMessages);
                    }
                });
            }
        },

        // Função para enviar mensagem no chatbot
        sendChatbotMessage: function(message, messagesContainer) {
            if (!messagesContainer) {
                messagesContainer = document.querySelector('.chatbot-messages');
                if (!messagesContainer) return;
            }
            
            const userMessage = document.createElement('div');
            userMessage.className = 'message user';
            userMessage.textContent = message;
            messagesContainer.appendChild(userMessage);
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message bot typing';
            typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            if (this.settings.chatbotApiEnabled && this.settings.chatbotApiKey) {
                this.getDeepSeekResponse(message)
                    .then(response => {
                        messagesContainer.removeChild(typingIndicator);
                        this.addBotMessage(response, messagesContainer);
                    })
                    .catch(error => {
                        console.error('Erro na API do chatbot:', error);
                        messagesContainer.removeChild(typingIndicator);
                        const fallbackResponse = this.getBasicChatbotResponse(message);
                        this.addBotMessage(fallbackResponse, messagesContainer);
                    });
            } else {
                setTimeout(() => {
                    messagesContainer.removeChild(typingIndicator);
                    const response = this.getBasicChatbotResponse(message);
                    this.addBotMessage(response, messagesContainer);
                }, 1000);
            }
        },

        // Adicionar mensagem do bot
        addBotMessage: function(message, messagesContainer) {
            if (!messagesContainer) {
                messagesContainer = document.querySelector('.chatbot-messages');
                if (!messagesContainer) return;
            }
            
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.textContent = message;
            messagesContainer.appendChild(botMessage);
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            this.updateChatbotSuggestions(message);
        },

        // Obter resposta da API do DeepSeek
        getDeepSeekResponse: async function(message) {
            try {
                console.log("Simulando chamada à API do DeepSeek com mensagem:", message);
                
                const messageLower = message.toLowerCase();
                if (messageLower.includes('reserva')) {
                    return "Para fazer uma reserva no Hotel Manzoni, você pode utilizar nosso sistema online no site oficial, ligar para (11) 5555-5555 ou enviar um e-mail para reservas@hotelmanzoni.com.br. Precisaremos das datas de check-in e check-out, número de hóspedes e tipo de quarto desejado.";
                } else if (messageLower.includes('preço') || messageLower.includes('valor') || messageLower.includes('custo')) {
                    return "O Hotel Manzoni oferece diferentes categorias de quartos com valores variados. Os quartos standard começam em R$250 por noite, os quartos luxo a partir de R$450 e as suítes executivas a partir de R$750. Todos incluem café da manhã completo e acesso às áreas de lazer.";
                } else if (messageLower.includes('check-in') || messageLower.includes('horário')) {
                    return "Nosso horário de check-in é a partir das 14h e o check-out deve ser realizado até as 12h. Caso precise de horários especiais, recomendamos entrar em contato antecipadamente para verificarmos a disponibilidade, podendo haver taxa adicional.";
                } else if (messageLower.includes('pet') || messageLower.includes('animal')) {
                    return "Sim, o Hotel Manzoni é pet-friendly! Aceitamos animais de estimação de pequeno e médio porte em quartos selecionados mediante taxa adicional de R$80 por estadia. Oferecemos também kit de boas-vindas para seu pet com caminha, comedouros e petiscos.";
                } else if (messageLower.includes('estacionamento')) {
                    return "Sim, o Hotel Manzoni dispõe de estacionamento privativo para hóspedes. O serviço custa R$35 por diária com manobrista disponível 24 horas. Para hóspedes em suítes executivas, o estacionamento é cortesia durante toda a estadia.";
                } else if (messageLower.includes('oi') || messageLower.includes('olá')) {
                    return "Olá! Bem-vindo ao Hotel Manzoni. Sou o assistente virtual do hotel e estou aqui para ajudar com informações sobre hospedagem, serviços, reservas e muito mais. Como posso ser útil hoje?";
                }
                
                return "Agradeço seu contato com o Hotel Manzoni. Oferecemos uma experiência de hospedagem premium no coração da cidade, com quartos elegantes, restaurante premiado, spa completo e atendimento personalizado. Posso ajudar com mais informações específicas sobre sua estadia?";
                
                
                const response = await fetch(this.settings.chatbotApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.settings.chatbotApiKey}`
                    },
                    body: JSON.stringify({
                        inputs: [
                            {"role": "system", "content": "Você é um assistente virtual do Hotel Manzoni, um hotel de luxo. Forneça respostas concisas e úteis sobre reservas, acomodações, serviços e políticas do hotel. Mantenha as respostas amigáveis e profissionais. Limite suas respostas a no máximo 2 parágrafos curtos."},
                            {"role": "user", "content": message}
                        ],
                        parameters: {
                            max_new_tokens: 150,
                            temperature: 0.7
                        }
                    })
                });
                
                const data = await response.json();
                
                if (data.generated_text) {
                    return data.generated_text;
                } else if (data.outputs) {
                    return data.outputs;
                } else {
                    return "Desculpe, não consegui processar sua solicitação no momento. Como posso ajudar de outra forma?";
                }
                
            } catch (error) {
                console.error('Erro ao obter resposta da API DeepSeek:', error);
                throw error;
            }
        },

        // Obter resposta básica pré-definida
        getBasicChatbotResponse: function(message) {
            const messageLower = message.toLowerCase();
            
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
                return "Nossa política de cancelamento permite cancelamentos gratuitos até 48h antes da data de check-in. Após esse prazo, pode haver cobrança de uma diária.";
            } else if (messageLower.includes('obrigado') || messageLower.includes('valeu') || messageLower.includes('agradeço')) {
                return "Por nada! Estou aqui para ajudar. Tem mais alguma dúvida sobre o Hotel Manzoni?";
            } else if (messageLower.includes('oi') || messageLower.includes('olá') || messageLower.includes('bom dia') || messageLower.includes('boa tarde') || messageLower.includes('boa noite')) {
                return "Olá! Bem-vindo ao Hotel Manzoni. Como posso ajudar você hoje?";
            } else {
                return "Obrigado pelo seu contato! Para informações mais específicas, entre em contato pelo telefone (11) 5555-5555 ou preencha o formulário de contato. Posso ajudar com algo mais?";
            }
        },

        // Atualizar sugestões do chatbot com base na conversa
        updateChatbotSuggestions: function(lastBotMessage) {
            const suggestionsContainer = document.querySelector('.chatbot-suggestions');
            if (!suggestionsContainer) return;
            
            suggestionsContainer.innerHTML = '';
            
            let newSuggestions = [];
            
            if (lastBotMessage.includes('data')) {
                newSuggestions = [
                    'Próximo final de semana',
                    'Mês que vem',
                    'Quais são os preços?',
                    'Tem quartos disponíveis?'
                ];
            } else if (lastBotMessage.includes('preço') || lastBotMessage.includes('valor')) {
                newSuggestions = [
                    'Quarto standard',
                    'Quarto luxo',
                    'Suíte presidencial',
                    'Tem promoções?'
                ];
            } else if (lastBotMessage.includes('check-in') || lastBotMessage.includes('horário')) {
                newSuggestions = [
                    'Posso fazer early check-in?',
                    'E late check-out?',
                    'Qual o endereço do hotel?',
                    'Como chego do aeroporto?'
                ];
            } else if (lastBotMessage.includes('pet') || lastBotMessage.includes('animal')) {
                newSuggestions = [
                    'Tem taxa adicional para pets?',
                    'Aceitam gatos também?',
                    'Tem área para pets?',
                    'Preciso levar a carteira de vacinação?'
                ];
            } else {
                newSuggestions = [
                    'Como faço uma reserva?',
                    'Quais são os horários de check-in?',
                    'O hotel aceita pets?',
                    'Tem estacionamento?'
                ];
            }
            
            newSuggestions.forEach(text => {
                const suggestion = document.createElement('button');
                suggestion.className = 'chatbot-suggestion';
                suggestion.textContent = text;
                suggestionsContainer.appendChild(suggestion);
                
                suggestion.addEventListener('click', () => {
                    const input = document.querySelector('.chatbot-input input');
                    const messages = document.querySelector('.chatbot-messages');
                    
                    if (input && messages) {
                        input.value = text;
                        this.sendChatbotMessage(text, messages);
                        input.value = '';
                    }
                });
            });
        },

        // Efeitos de Parallax
        setupParallaxEffects: function() {
            const parallaxElements = document.querySelectorAll('.parallax');
            
            if (parallaxElements.length === 0) return;
            
            // Função para atualizar posição dos elementos
            const updateParallax = () => {
                const scrollTop = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = element.getAttribute('data-speed') || 0.5;
                    const offset = element.getBoundingClientRect().top + scrollTop;
                    const yPos = (scrollTop - offset) * speed;
                    
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
            };
            
            // Atualizar em scroll
            window.addEventListener('scroll', updateParallax);
            
            // Inicializar
            updateParallax();
        },

        // Galeria avançada com efeitos 3D
        setupAdvancedGallery: function() {
            const galleryItems = document.querySelectorAll('.gallery-item-3d');
            
            if (galleryItems.length === 0) return;
            
            // Adicionar efeito 3D aos itens da galeria
            galleryItems.forEach(item => {
                // Adicionar elemento de brilho
                const glare = document.createElement('div');
                glare.className = 'glare';
                item.appendChild(glare);
                
                // Adicionar evento de movimento do mouse
                item.addEventListener('mousemove', (event) => {
                    const itemRect = item.getBoundingClientRect();
                    const mouseX = event.clientX - itemRect.left;
                    const mouseY = event.clientY - itemRect.top;
                    
                    // Calcular posição relativa do mouse (0-1)
                    const relX = mouseX / itemRect.width;
                    const relY = mouseY / itemRect.height;
                    
                    // Calcular ângulo de rotação
                    const rotateX = (0.5 - relY) * 15;
                    const rotateY = (relX - 0.5) * 15;
                    
                    // Aplicar transformação
                    item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                    
                    // Efeito de brilho
                    const glare = item.querySelector('.glare');
                    if (glare) {
                        glare.style.opacity = '0.3';
                        glare.style.transform = `translate(${relX * 100}%, ${relY * 100}%)`;
                    }
                });
                
                // Resetar ao sair
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                    
                    const glare = item.querySelector('.glare');
                    if (glare) {
                        glare.style.opacity = '0';
                    }
                });
            });
        },

        // Mapa interativo
        setupInteractiveMap: function() {
            const mapContainer = document.getElementById('hotel-map');
            if (!mapContainer) return;
            
            // Verificar se o script do Leaflet já foi carregado
            if (typeof L === 'undefined') {
                // Carregar CSS do Leaflet
                const leafletCSS = document.createElement('link');
                leafletCSS.rel = 'stylesheet';
                leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
                document.head.appendChild(leafletCSS);
                
                // Carregar script do Leaflet
                const leafletScript = document.createElement('script');
                leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
                document.head.appendChild(leafletScript);
                
                // Inicializar mapa quando o script for carregado
                leafletScript.onload = () => {
                    this.initializeMap(mapContainer);
                };
            } else {
                // Leaflet já está carregado, inicializar mapa
                this.initializeMap(mapContainer);
            }
        },

        // Inicializar mapa
        initializeMap: function(mapContainer) {
            // Coordenadas do hotel (exemplo)
            const hotelLat = -23.550520;
            const hotelLng = -46.633308;
            
            // Criar mapa
            const map = L.map(mapContainer).setView([hotelLat, hotelLng], 15);
            
            // Adicionar camada de tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Ícone personalizado para o hotel
            const hotelIcon = L.icon({
                iconUrl: 'assets/images/map-marker.png',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
            
            // Adicionar marcador do hotel
            const hotelMarker = L.marker([hotelLat, hotelLng], {icon: hotelIcon}).addTo(map);
            hotelMarker.bindPopup(`
                <div class="map-popup">
                    <h3>Hotel
