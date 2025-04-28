/**
 * Hotel Manzoni - JavaScript Principal
 * Versão: 2.0
 * Unificação de script.js e components.js
 */

// IIFE para evitar poluição do escopo global
(function() {
    // Objeto principal que conterá todas as funcionalidades
    const HotelManzoni = {
        // Configurações globais
        config: {
            debug: false,
            animationEnabled: true,
            cursorEnabled: window.innerWidth > 1024,
            chatbotApiEnabled: true,
            chatbotApiUrl: 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V3-0324',
            chatbotApiKey: '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'
        },
        
        // Método de inicialização principal
        init: function() {
            // Inicializar componentes básicos
            this.setupPreloader();
            this.setupMobileMenu();
            this.setupThemeToggle();
            this.setupGallery();
            this.setupChatbot();
            this.setupBackToTop();
            this.setupForms();
            
            // Inicializar componentes avançados
            this.setupCustomCursor();
            this.setupParallaxEffects();
            this.setupAdvancedGallery();
            this.setupInteractiveMap();
            
            // Registrar eventos globais
            this.registerGlobalEvents();
            
            if (this.config.debug) {
                console.log('Hotel Manzoni JS inicializado com sucesso!');
            }
        },
        
        // Preloader
        setupPreloader: function() {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                // Adicionar classe para iniciar animação de saída
                setTimeout(function() {
                    preloader.classList.add('preloader-hidden');
                    
                    // Remover completamente após a animação
                    setTimeout(function() {
                        preloader.style.display = 'none';
                    }, 500);
                }, 1000);
            }
        },

        // Menu mobile
        setupMobileMenu: function() {
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const nav = document.querySelector('nav');
            
            if (mobileMenuToggle && nav) {
                mobileMenuToggle.addEventListener('click', function() {
                    nav.classList.toggle('active');
                    mobileMenuToggle.classList.toggle('active');
                });
            }
        },

        // Alternar tema
        setupThemeToggle: function() {
            const themeButton = document.getElementById('theme-button');
            
            if (themeButton) {
                themeButton.addEventListener('click', () => {
                    document.body.classList.toggle('dark-theme');
                    
                    // Disparar evento personalizado para outros componentes
                    const themeEvent = new CustomEvent('themeChanged', {
                        detail: {
                            theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light'
                        }
                    });
                    document.dispatchEvent(themeEvent);
                });
            }
        },

        // Galeria básica
        setupGallery: function() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const lightbox = document.querySelector('.lightbox');
            const lightboxImage = document.querySelector('.lightbox-image');
            const lightboxClose = document.querySelector('.lightbox-close');
            
            if (galleryItems.length && lightbox && lightboxImage) {
                // Abrir lightbox ao clicar em uma imagem
                galleryItems.forEach(item => {
                    item.addEventListener('click', function() {
                        const imgSrc = this.querySelector('img').getAttribute('src');
                        lightboxImage.setAttribute('src', imgSrc);
                        lightbox.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    });
                });
                
                // Fechar lightbox
                if (lightboxClose) {
                    lightboxClose.addEventListener('click', function() {
                        lightbox.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    });
                }
                
                // Fechar lightbox ao clicar fora da imagem
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox) {
                        lightbox.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            }
        },

        // Chatbot
        setupChatbot: function() {
            const chatbotToggle = document.querySelector('.chatbot-toggle');
            const chatbotContainer = document.querySelector('.chatbot-container');
            const chatbotClose = document.querySelector('.chatbot-close');
            const chatbotForm = document.querySelector('.chatbot-form');
            const chatbotMessages = document.querySelector('.chatbot-messages');
            
            if (chatbotToggle && chatbotContainer) {
                // Abrir/fechar chatbot
                chatbotToggle.addEventListener('click', function() {
                    chatbotContainer.classList.toggle('active');
                });
                
                if (chatbotClose) {
                    chatbotClose.addEventListener('click', function() {
                        chatbotContainer.classList.remove('active');
                    });
                }
                
                // Enviar mensagem
                if (chatbotForm && chatbotMessages) {
                    chatbotForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        
                        const input = chatbotForm.querySelector('input');
                        const message = input.value.trim();
                        
                        if (message) {
                            // Adicionar mensagem do usuário
                            this.addChatMessage(message, 'user');
                            input.value = '';
                            
                            // Mostrar indicador de digitação
                            this.addTypingIndicator();
                            
                            // Processar mensagem e responder
                            this.processChatbotMessage(message);
                        }
                    });
                }
            }
        },
        
        // Adicionar mensagem ao chatbot
        addChatMessage: function(message, sender) {
            const chatbotMessages = document.querySelector('.chatbot-messages');
            if (!chatbotMessages) return;
            
            const messageElement = document.createElement('div');
            messageElement.classList.add('chatbot-message', `${sender}-message`);
            messageElement.innerHTML = `<p>${message}</p>`;
            
            chatbotMessages.appendChild(messageElement);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        },
        
        // Adicionar indicador de digitação
        addTypingIndicator: function() {
            const chatbotMessages = document.querySelector('.chatbot-messages');
            if (!chatbotMessages) return;
            
            const typingElement = document.createElement('div');
            typingElement.classList.add('chatbot-message', 'bot-message', 'typing-indicator');
            typingElement.innerHTML = '<span></span><span></span><span></span>';
            typingElement.id = 'typing-indicator';
            
            chatbotMessages.appendChild(typingElement);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        },
        
        // Remover indicador de digitação
        removeTypingIndicator: function() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        },
        
        // Processar mensagem do chatbot
        processChatbotMessage: function(message) {
            // Respostas predefinidas para perguntas comuns
            const commonResponses = {
                'olá': 'Olá! Como posso ajudar você hoje?',
                'oi': 'Olá! Como posso ajudar você hoje?',
                'reserva': 'Para fazer uma reserva, você pode usar nosso formulário online ou ligar para +55 (11) 1234-5678.',
                'preço': 'Nossos preços variam de acordo com o tipo de quarto e temporada. Você pode verificar a disponibilidade e preços em nossa página de reservas.',
                'localização': 'O Hotel Manzoni está localizado no centro de São Paulo, próximo às principais atrações turísticas e comerciais da cidade.',
                'check-in': 'O check-in é realizado a partir das 14h e o check-out até as 12h.',
                'wifi': 'Sim, oferecemos Wi-Fi gratuito em todas as áreas do hotel.',
                'estacionamento': 'Sim, temos estacionamento privativo para hóspedes com custo adicional de R$ 30 por dia.',
                'café da manhã': 'O café da manhã está incluso em todas as reservas e é servido das 6h30 às 10h30.',
                'piscina': 'Sim, temos uma piscina no terraço com vista panorâmica para a cidade.',
                'restaurante': 'Nosso restaurante Bella Vita serve culinária italiana e internacional, aberto para almoço e jantar.',
                'obrigado': 'De nada! Estou aqui para ajudar. Tem mais alguma pergunta?',
                'tchau': 'Até logo! Tenha um ótimo dia!'
            };
            
            setTimeout(() => {
                this.removeTypingIndicator();
                
                // Verificar se há uma resposta predefinida
                let response = null;
                
                // Verificar cada palavra-chave nas respostas predefinidas
                for (const key in commonResponses) {
                    if (message.toLowerCase().includes(key)) {
                        response = commonResponses[key];
                        break;
                    }
                }
                
                // Se não houver resposta predefinida
                if (!response) {
                    if (this.config.chatbotApiEnabled) {
                        // Usar API para gerar resposta
                        this.fetchAIResponse(message);
                    } else {
                        // Resposta genérica
                        response = "Desculpe, não entendi sua pergunta. Pode reformular ou perguntar sobre reservas, instalações, horários ou serviços do hotel.";
                        this.addChatMessage(response, 'bot');
                    }
                } else {
                    this.addChatMessage(response, 'bot');
                }
            }, 1500);
        },
        
        // Buscar resposta da API de IA
        fetchAIResponse: function(message) {
            const payload = {
                inputs: `Você é um assistente virtual do Hotel Manzoni, um hotel de luxo em São Paulo. Responda de forma educada e prestativa. Pergunta do cliente: ${message}`,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    top_p: 0.9,
                    do_sample: true
                }
            };
            
            fetch(this.config.chatbotApiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.chatbotApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                let botResponse = "Desculpe, estou com dificuldades técnicas no momento.";
                
                if (data && data[0] && data[0].generated_text) {
                    botResponse = data[0].generated_text.trim();
                }
                
                this.addChatMessage(botResponse, 'bot');
            })
            .catch(error => {
                console.error('Erro ao obter resposta da IA:', error);
                this.addChatMessage("Desculpe, estou com dificuldades técnicas no momento.", 'bot');
            });
        },

        // Botão voltar ao topo
        setupBackToTop: function() {
            const backToTopButton = document.querySelector('.back-to-top');
            
            if (backToTopButton) {
                // Mostrar/ocultar botão com base no scroll
                window.addEventListener('scroll', function() {
                    if (window.pageYOffset > 300) {
                        backToTopButton.classList.add('active');
                    } else {
                        backToTopButton.classList.remove('active');
                    }
                });
                
                // Ação de voltar ao topo
                backToTopButton.addEventListener('click', function() {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        },

        // Validação de formulários
        setupForms: function() {
            const contactForm = document.getElementById('contactForm');
            const newsletterForm = document.getElementById('newsletterForm');
            
            // Validação do formulário de contato
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Validação básica
                    let isValid = true;
                    const requiredFields = contactForm.querySelectorAll('[required]');
                    
                    requiredFields.forEach(field => {
                        if (!field.value.trim()) {
                            isValid = false;
                            field.classList.add('error');
                        } else {
                            field.classList.remove('error');
                        }
                    });
                    
                    // Validar email
                    const emailField = contactForm.querySelector('#email');
                    if (emailField && emailField.value.trim()) {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(emailField.value.trim())) {
                            isValid = false;
                            emailField.classList.add('error');
                        }
                    }
                    
                    // Validar datas
                    const checkinField = contactForm.querySelector('#checkin');
                    const checkoutField = contactForm.querySelector('#checkout');
                    
                    if (checkinField && checkoutField && checkinField.value && checkoutField.value) {
                        const checkin = new Date(checkinField.value);
                        const checkout = new Date(checkoutField.value);
                        
                        if (checkout <= checkin) {
                            isValid = false;
                            checkoutField.classList.add('error');
                            alert('A data de check-out deve ser posterior à data de check-in.');
                        }
                    }
                    
                    // Enviar formulário se válido
                    if (isValid) {
                        // Simulação de envio
                        const submitButton = contactForm.querySelector('button[type="submit"]');
                        submitButton.disabled = true;
                        submitButton.textContent = 'Enviando...';
                        
                        setTimeout(function() {
                            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                            contactForm.reset();
                            submitButton.disabled = false;
                            submitButton.textContent = 'Enviar Mensagem';
                        }, 1500);
                    }
                });
            }
            
            // Validação do formulário de newsletter
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const emailInput = newsletterForm.querySelector('input[type="email"]');
                    let isValid = true;
                    
                    if (!emailInput.value.trim()) {
                        isValid = false;
                        emailInput.classList.add('error');
                    } else {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(emailInput.value.trim())) {
                            isValid = false;
                            emailInput.classList.add('error');
                        } else {
                            emailInput.classList.remove('error');
                        }
                    }
                    
                    if (isValid) {
                        // Simulação de envio
                        const submitButton = newsletterForm.querySelector('button[type="submit"]');
                        submitButton.disabled = true;
                        
                        setTimeout(function() {
                            alert('Inscrição realizada com sucesso!');
                            newsletterForm.reset();
                            submitButton.disabled = false;
                        }, 1000);
                    }
                });
            }
        },

        // Cursor personalizado
        setupCustomCursor: function() {
            if (!this.config.cursorEnabled) return;
            
            // Criar elementos do cursor
            const cursorDot = document.createElement('div');
            cursorDot.classList.add('cursor-dot');
            
            const cursorRing = document.createElement('div');
            cursorRing.classList.add('cursor-ring');
            
            document.body.appendChild(cursorDot);
            document.body.appendChild(cursorRing);
            
            // Posição inicial fora da tela
            let cursorX = -100;
            let cursorY = -100;
            
            // Posição alvo (suavizada)
            let targetX = -100;
            let targetY = -100;
            
            // Atualizar posição do cursor
            document.addEventListener('mousemove', (e) => {
                targetX = e.clientX;
                targetY = e.clientY;
            });
            
            // Animação suave do cursor
            const updateCursor = () => {
                // Suavização do movimento
                cursorX += (targetX - cursorX) * 0.2;
                cursorY += (targetY - cursorY) * 0.2;
                
                // Atualizar posição dos elementos
                cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
                cursorRing.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
                
                // Continuar animação
                requestAnimationFrame(updateCursor);
            };
            
            updateCursor();
            
            // Efeitos de hover para links e botões
            const handleLinkHover = () => {
                const links = document.querySelectorAll('a, button, .btn, .gallery-item, .clickable');
                
                links.forEach(link => {
                    link.addEventListener('mouseenter', () => {
                        cursorRing.classList.add('cursor-hover');
                    });
                    
                    link.addEventListener('mouseleave', () => {
                        cursorRing.classList.remove('cursor-hover');
                    });
                });
            };
            
            handleLinkHover();
            
            // Atualizar visibilidade do cursor
            this.updateCursorVisibility = function() {
                if (this.config.cursorEnabled) {
                    cursorDot.style.display = 'block';
                    cursorRing.style.display = 'block';
                    document.body.classList.add('custom-cursor-enabled');
                } else {
                    cursorDot.style.display = 'none';
                    cursorRing.style.display = 'none';
                    document.body.classList.remove('custom-cursor-enabled');
                }
            };
            
            this.updateCursorVisibility();
        },

        // Efeitos de parallax
        setupParallaxEffects: function() {
            const parallaxElements = document.querySelectorAll('.parallax');
            
            if (parallaxElements.length) {
                // Função para atualizar posição dos elementos
                const updateParallax = () => {
                    const scrollTop = window.pageYOffset;
                    
                    parallaxElements.forEach(element => {
                        const speed = element.getAttribute('data-speed') || 0.5;
                        const offset = element.getBoundingClientRect().top + scrollTop;
                        const yPos = -(scrollTop - offset) * speed;
                        
                        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                    });
                };
                
                // Atualizar em cada scroll
                window.addEventListener('scroll', updateParallax);
                
                // Inicializar
                updateParallax();
            }
        },

        // Galeria avançada com filtros e animações
        setupAdvancedGallery: function() {
            const galleryContainer = document.querySelector('.advanced-gallery');
            const filterButtons = document.querySelectorAll('.gallery-filter button');
            
            if (galleryContainer && filterButtons.length) {
                const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
                
                // Inicializar com Isotope se disponível
                if (typeof Isotope !== 'undefined') {
                    const iso = new Isotope(galleryContainer, {
                        itemSelector: '.gallery-item',
                        layoutMode: 'masonry'
                    });
                    
                    // Filtrar itens
                    filterButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            // Remover classe ativa de todos os botões
                            filterButtons.forEach(btn => btn.classList.remove('active'));
                            
                            // Adicionar classe ativa ao botão clicado
                            this.classList.add('active');
                            
                            // Obter filtro
                            const filterValue = this.getAttribute('data-filter');
                            
                            // Filtrar itens
                            if (filterValue === '*') {
                                iso.arrange({ filter: '*' });
                            } else {
                                iso.arrange({ filter: `.${filterValue}` });
                            }
                        });
                    });
                } else {
                    // Fallback se Isotope não estiver disponível
                    filterButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            // Remover classe ativa de todos os botões
                            filterButtons.forEach(btn => btn.classList.remove('active'));
                            
                            // Adicionar classe ativa ao botão clicado
                            this.classList.add('active');
                            
                            // Obter filtro
                            const filterValue = this.getAttribute('data-filter');
                            
                            // Mostrar/ocultar itens
                            galleryItems.forEach(item => {
                                if (filterValue === '*') {
                                    item.style.display = 'block';
                                } else if (item.classList.contains(filterValue)) {
                                    item.style.display = 'block';
                                } else {
                                    item.style.display = 'none';
                                }
                            });
                        });
                    });
                }
            }
        },

        // Mapa interativo
        setupInteractiveMap: function() {
            const mapContainer = document.getElementById('hotel-map');
            
            if (mapContainer && typeof L !== 'undefined') {
                // Coordenadas do hotel (exemplo: São Paulo)
                const hotelLat = -23.550520;
                const hotelLng = -46.633308;
                
                // Inicializar mapa
                const map = L.map(mapContainer).setView([hotelLat, hotelLng], 15);
                
                // Adicionar camada de mapa
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                
                // Adicionar marcador do hotel
                const hotelIcon = L.icon({
                    iconUrl: 'assets/images/map-marker.png',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                });
                
                L.marker([hotelLat, hotelLng], { icon: hotelIcon })
                    .addTo(map)
                    .bindPopup('<strong>Hotel Manzoni</strong><br>Seu refúgio de luxo no coração de São Paulo')
                    .openPopup();
                
                // Adicionar pontos de interesse próximos
                const pointsOfInterest = [
                    { name: 'Parque Ibirapuera', lat: -23.587200, lng: -46.657878 },
                    { name: 'Avenida Paulista', lat: -23.561414, lng: -46.655804 },
                    { name: 'Mercado Municipal', lat: -23.541895, lng: -46.629499 },
                    { name: 'Teatro Municipal', lat: -23.545231, lng: -46.638271 }
                ];
                
                pointsOfInterest.forEach(poi => {
                    L.marker([poi.lat, poi.lng])
                        .addTo(map)
                        .bindPopup(`<strong>${poi.name}</strong><br>Ponto turístico`);
                });
                
                // Adicionar controles
                map.scrollWheelZoom.disable();
                L.control.scale().addTo(map);
            }
        },

        // Registro de eventos globais
        registerGlobalEvents: function() {
            // Detectar mudanças de tema e ajustar componentes
            document.addEventListener('themeChanged', (e) => {
                if (this.config.debug) {
                    console.log('Tema alterado para:', e.detail.theme);
                }
                // Atualizar componentes conforme necessário
                this.updateComponentsTheme(e.detail.theme);
            });
            
            // Detectar redimensionamento da janela
            window.addEventListener('resize', () => {
                // Atualizar configuração do cursor com base no tamanho da tela
                this.config.cursorEnabled = window.innerWidth > 1024;
                
                // Atualizar visibilidade do cursor
                if (typeof this.updateCursorVisibility === 'function') {
                    this.updateCursorVisibility();
                }
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
        }
    };
    
    // Inicializar quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        HotelManzoni.init();
    });
})();
