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
            debug: true, // Ativado para ajudar na depuração
            animationEnabled: true,
            cursorEnabled: window.innerWidth > 1024,
            chatbotApiEnabled: false, // Desativado para usar respostas predefinidas
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
            const chatbotToggle = document.querySelector('.chatbot-icon');
            const chatbotContainer = document.querySelector('.chatbot-container');
            const chatbotClose = document.querySelector('.chatbot-close');
            const chatbotForm = document.querySelector('.chatbot-form');
            const chatbotMessages = document.querySelector('.chatbot-messages');
            
            if (this.config.debug) {
                console.log('Elementos do chatbot:', {
                    toggle: chatbotToggle,
                    container: chatbotContainer,
                    close: chatbotClose,
                    form: chatbotForm,
                    messages: chatbotMessages
                });
            }
            
            if (chatbotToggle && chatbotContainer) {
                // Abrir/fechar chatbot
                chatbotToggle.addEventListener('click', () => {
                    chatbotContainer.classList.toggle('active');
                    chatbotContainer.setAttribute('aria-hidden', 
                        chatbotContainer.classList.contains('active') ? 'false' : 'true');
                });
                
                if (chatbotClose) {
                    chatbotClose.addEventListener('click', () => {
                        chatbotContainer.classList.remove('active');
                        chatbotContainer.setAttribute('aria-hidden', 'true');
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
                } else {
                    console.warn('Chatbot form ou messages container não encontrados');
                }
            } else {
                console.warn('Chatbot toggle ou container não encontrados');
            }
        },
        
        // Adicionar mensagem ao chatbot
        addChatMessage: function(message, sender) {
            const chatbotMessages = document.querySelector('.chatbot-messages');
            if (!chatbotMessages) return;
            
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', sender);
            messageElement.innerHTML = `<p>${message}</p>`;
            
            chatbotMessages.appendChild(messageElement);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        },
        
        // Adicionar indicador de digitação
        addTypingIndicator: function() {
            const chatbotMessages = document.querySelector('.chatbot-messages');
            if (!chatbotMessages) return;
            
            const typingElement = document.createElement('div');
            typingElement.classList.add('message', 'bot', 'typing-indicator');
            typingElement.innerHTML = '<p><span></span><span></span><span></span></p>';
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
            // Respostas diretas baseadas em palavras-chave específicas
            const keywordResponses = {
                // Informações sobre quartos e preços
                'preço': 'Nossos preços: Suíte Luxo (R$350), Quarto Casal Superior (R$280), Quarto Casal Standard (R$220) e Quarto Solteiro (R$180). Todos incluem café da manhã e Wi-Fi.',
                'valor': 'Nossos preços: Suíte Luxo (R$350), Quarto Casal Superior (R$280), Quarto Casal Standard (R$220) e Quarto Solteiro (R$180). Todos incluem café da manhã e Wi-Fi.',
                'diária': 'Nossas diárias: Suíte Luxo (R$350), Quarto Casal Superior (R$280), Quarto Casal Standard (R$220) e Quarto Solteiro (R$180). Todos incluem café da manhã e Wi-Fi.',
                'tarifa': 'Nossas tarifas: Suíte Luxo (R$350), Quarto Casal Superior (R$280), Quarto Casal Standard (R$220) e Quarto Solteiro (R$180). Todos incluem café da manhã e Wi-Fi.',
                'quarto': 'Temos: Suíte Luxo (R$350), Quarto Casal Superior (R$280), Quarto Casal Standard (R$220) e Quarto Solteiro (R$180). Todos com ar-condicionado, TV, Wi-Fi e café da manhã.',
                'suite': 'Nossa Suíte Luxo (R$350) possui 45m², cama king size, banheira de hidromassagem, vista panorâmica, frigobar, cofre e amenidades premium.',
                'acomodação': 'Oferecemos Suíte Luxo (R$350), Quarto Casal Superior (R$280), Quarto Casal Standard (R$220) e Quarto Solteiro (R$180). Todos com ar-condicionado, TV e Wi-Fi.',
                'cama': 'Suíte Luxo: cama king size. Quarto Casal Superior: cama queen. Quarto Casal Standard: cama casal. Quarto Solteiro: duas camas de solteiro ou uma cama de solteiro.',

                // Reservas
                'reserva': 'Para fazer uma reserva, use nosso formulário online ou ligue para +55 (67) 3321-5678. Precisamos de seus dados, datas de check-in/check-out e tipo de quarto desejado.',
                'reservar': 'Reserve pelo site ou telefone +55 (67) 3321-5678. Aceitamos cartões de crédito/débito, PIX e dinheiro. Cancelamento gratuito até 48h antes do check-in.',
                'disponibilidade': 'Para verificar disponibilidade, informe suas datas de interesse pelo telefone +55 (67) 3321-5678 ou pelo formulário de reservas em nosso site.',
                'cancelamento': 'Nossa política permite cancelamentos gratuitos até 48 horas antes do check-in. Após esse prazo, será cobrada uma diária como taxa de cancelamento.',
                
                // Horários e políticas
                'check-in': 'O check-in é realizado a partir das 14h. Early check-in sujeito à disponibilidade. Por favor, informe-nos se chegará após as 22h.',
                'check-out': 'O check-out deve ser feito até as 12h. Late check-out disponível mediante consulta e taxa adicional de 50% da diária até às 18h.',
                'horário': 'Check-in: a partir das 14h. Check-out: até 12h. Café da manhã: 6h30-10h30. Restaurante: 12h-15h e 19h-23h. Piscina: 7h-22h. Recepção: 24h.',
                'pet': 'Aceitamos animais de pequeno e médio porte (até 15kg) com taxa adicional de R$50 por dia. Por favor, informe na reserva.',
                'criança': 'Crianças até 7 anos não pagam quando acompanhadas dos pais e utilizando a mesma cama. Berços disponíveis sem custo mediante solicitação prévia.',
                
                // Serviços e facilidades
                'wifi': 'Oferecemos Wi-Fi gratuito de alta velocidade em todas as áreas do hotel, com velocidade média de 100 Mbps.',
                'internet': 'Wi-Fi gratuito disponível em todos os quartos e áreas comuns, com velocidade média de 100 Mbps. Senha fornecida no check-in.',
                'estacionamento': 'Estacionamento privativo para hóspedes com custo adicional de R$25 por dia, com serviço de manobrista disponível.',
                'café da manhã': 'Café da manhã incluso em todas as reservas, servido das 6h30 às 10h30 no restaurante. Oferecemos opções quentes, frias, frutas e itens sem glúten/lactose.',
                'piscina': 'Temos piscina ao ar livre com área de descanso e bar molhado, aberta das 7h às 22h. Toalhas disponíveis sem custo adicional.',
                'restaurante': 'Nosso restaurante serve pratos variados, aberto para almoço (12h-15h) e jantar (19h-23h). Room service disponível das 7h às 23h.',
                'academia': 'Academia completa disponível para todos os hóspedes, aberta das 6h às 22h, com equipamentos cardiovasculares e musculação.',
                'ar condicionado': 'Todos os quartos são equipados com ar-condicionado split com controle individual de temperatura.',
                'frigobar': 'Todos os quartos possuem frigobar abastecido com água, refrigerantes, cervejas e snacks. Consumo cobrado separadamente.',
                'tv': 'Todos os quartos possuem TV LED 42" com canais a cabo nacionais e internacionais.',
                'serviço de quarto': 'Room service disponível das 7h às 23h com cardápio variado. Taxa de serviço de 10% sobre o valor do pedido.',
                'lavanderia': 'Serviço de lavanderia disponível de segunda a sábado com entrega em 24 horas. Lista de preços disponível no quarto.',
                
                // Acessibilidade
                'acessibilidade': 'Oferecemos rampas de acesso, elevadores e 4 quartos adaptados para pessoas com mobilidade reduzida, todos no térreo.',
                'cadeirante': 'Temos 4 quartos adaptados para cadeirantes com banheiros especiais, barras de apoio e espaço amplo para circulação.',
                
                // Eventos
                'eventos': 'Espaços para eventos com capacidade para até 150 pessoas, equipados com tecnologia audiovisual e serviço de buffet. Solicite um orçamento.',
                'reunião': 'Salas de reunião para 10 a 50 pessoas, com internet de alta velocidade, projetor, flipchart e serviço de coffee break.',
                'casamento': 'Salão de festas para casamentos de até 120 convidados, com decoração personalizada, menu especial e pacotes que incluem hospedagem para noivos.',
                
                // Pagamento
                'pagamento': 'Aceitamos cartões de crédito/débito (Visa, Mastercard, American Express, Elo), PIX e dinheiro. Parcelamento em até 3x sem juros.',
                'cartão': 'Aceitamos Visa, Mastercard, American Express e Elo. Parcelamento em até 3x sem juros para reservas acima de R$600.',
                'pix': 'Aceitamos pagamento via PIX com 5% de desconto para pagamento antecipado. Chave PIX fornecida após confirmação da reserva.',
                
                // Localização
                'localização': 'Estamos localizados no centro da cidade, a 15 minutos do aeroporto e próximo aos principais pontos comerciais.',
                'endereço': 'Nosso endereço é Av. Afonso Pena, 2500 - Centro, CEP 79002-072.',
                'como chegar': 'Do aeroporto: táxi/Uber (15min) ou ônibus linha 102 (30min). Da rodoviária: táxi/Uber (10min) ou a pé (20min). Oferecemos transfer mediante reserva.',
                
                // Saudações e despedidas
                'olá': 'Olá! Como posso ajudar com sua hospedagem no Hotel Manzoni?',
                'oi': 'Olá! Como posso ajudar com sua hospedagem no Hotel Manzoni?',
                'bom dia': 'Bom dia! Como posso ajudar com sua estadia no Hotel Manzoni?',
                'boa tarde': 'Boa tarde! Como posso ajudar com sua estadia no Hotel Manzoni?',
                'boa noite': 'Boa noite! Como posso ajudar com sua estadia no Hotel Manzoni?',
                'obrigado': 'De nada! Estou aqui para ajudar. Tem mais alguma dúvida sobre o Hotel Manzoni?',
                'obrigada': 'De nada! Estou aqui para ajudar. Tem mais alguma dúvida sobre o Hotel Manzoni?',
                'tchau': 'Até logo! Esperamos recebê-lo em breve no Hotel Manzoni!',
                'adeus': 'Até a próxima! Esperamos sua visita ao Hotel Manzoni!'
            };
            
            setTimeout(() => {
                this.removeTypingIndicator();
                
                // Verificar se há uma resposta para palavra-chave específica
                let response = null;
                const messageLower = message.toLowerCase();
                
                // Verificar cada palavra-chave nas respostas predefinidas
                for (const key in keywordResponses) {
                    if (messageLower.includes(key)) {
                        response = keywordResponses[key];
                        break;
                    }
                }
                
                // Se não houver resposta específica para palavra-chave, verificar categorias gerais
                if (!response) {
                    // Perguntas sobre quartos ou hospedagem
                    if (messageLower.includes('quarto') || messageLower.includes('hospedagem') || 
                        messageLower.includes('ficar') || messageLower.includes('dormir')) {
                        response = "Temos 4 tipos de quartos: Suíte Luxo (R$350), Quarto Casal Superior (R$280), Quarto Casal Standard (R$220) e Quarto Solteiro (R$180). Todos incluem café da manhã, Wi-Fi, ar-condicionado e TV. Qual tipo de quarto você gostaria de reservar?";
                    }
                    // Perguntas sobre serviços gerais
                    else if (messageLower.includes('serviço') || messageLower.includes('oferecem') || 
                             messageLower.includes('disponível') || messageLower.includes('tem')) {
                        response = "Oferecemos diversos serviços: Wi-Fi gratuito, café da manhã incluso, restaurante, room service (7h-23h), piscina, academia, estacionamento (R$25/dia), lavanderia e recepção 24h. Algum serviço específico que gostaria de saber mais?";
                    }
                    // Perguntas sobre reservas ou disponibilidade
                    else if (messageLower.includes('reserv') || messageLower.includes('dispon') || 
                             messageLower.includes('vaga') || messageLower.includes('data')) {
                        response = "Para verificar disponibilidade e fazer reservas, entre em contato pelo telefone +55 (67) 3321-5678 ou use o formulário em nosso site. Precisamos saber a data de check-in/check-out, número de hóspedes e tipo de quarto desejado.";
                    }
                    // Perguntas sobre políticas
                    else if (messageLower.includes('polític') || messageLower.includes('regra') || 
                             messageLower.includes('permit') || messageLower.includes('pode')) {
                        response = "Nossas principais políticas: check-in às 14h, check-out às 12h, cancelamento gratuito até 48h antes, aceitamos pets até 15kg (taxa R$50/dia), crianças até 7 anos não pagam (na mesma cama dos pais). Precisa de informações sobre alguma política específica?";
                    }
                    // Resposta genérica para outras perguntas
                    else {
                        response = "Posso ajudar com informações sobre quartos, preços, reservas, serviços, horários e políticas do Hotel Manzoni. Por favor, especifique sua dúvida para que eu possa atendê-lo melhor.";
                    }
                }
                
                this.addChatMessage(response, 'bot');
            }, 1500);
        },
        
        // Buscar resposta da API de IA (mantido para referência, mas não usado)
        fetchAIResponse: function(message) {
            const payload = {
                inputs: `Você é um assistente virtual do Hotel Manzoni, um hotel em Campo Grande, Mato Grosso do Sul. Responda de forma educada e prestativa. Pergunta do cliente: ${message}`,
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
                    cur
