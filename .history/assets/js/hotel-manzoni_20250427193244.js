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
            // Respostas predefinidas para perguntas comuns
            const commonResponses = {
                // Saudações
                'olá': 'Olá! Como posso ajudar você hoje?',
                'oi': 'Olá! Como posso ajudar você hoje?',
                'bom dia': 'Bom dia! Como posso ajudar com sua hospedagem?',
                'boa tarde': 'Boa tarde! Em que posso ajudar hoje?',
                'boa noite': 'Boa noite! Como posso ser útil para você?',
                
                // Reservas
                'reserva': 'Para fazer uma reserva, você pode usar nosso formulário online ou ligar para +55 (67) 3321-5678. Precisa de ajuda com datas específicas?',
                'reservar': 'Você pode reservar diretamente pelo nosso site ou pelo telefone +55 (67) 3321-5678. Qual seria o período da sua estadia?',
                'disponibilidade': 'Temos disponibilidade variável conforme a temporada. Qual data você está planejando se hospedar?',
                'vagas': 'Temos diferentes tipos de quartos disponíveis. Para verificar a disponibilidade específica, precisamos saber a data da sua estadia.',
                
                // Preços
                'preço': 'Nossos preços variam de R$180 a R$350 por noite, dependendo do tipo de quarto e da temporada. Posso verificar valores específicos para você.',
                'valor': 'O valor da diária varia entre R$180 e R$350, dependendo do tipo de quarto. Temos opções de quarto solteiro, casal e suítes.',
                'promoção': 'Temos promoções sazonais e descontos para estadias prolongadas. Qual período você está considerando?',
                'desconto': 'Oferecemos 15% de desconto para reservas de mais de 5 diárias e condições especiais para empresas parceiras.',
                
                // Localização e acesso
                'localização': 'O Hotel Manzoni está localizado no centro de Campo Grande, Mato Grosso do Sul, próximo às principais atrações turísticas e comerciais da cidade.',
                'endereço': 'Estamos na Av. Afonso Pena, 2500 - Centro, Campo Grande, MS - CEP 79002-072.',
                'como chegar': 'Você pode chegar ao hotel de táxi ou carro a partir do Aeroporto Internacional de Campo Grande (15 minutos). Oferecemos serviço de transfer mediante agendamento prévio.',
                'perto': 'Estamos próximos de pontos turísticos como o Parque das Nações Indígenas, Shopping Campo Grande, Mercadão Municipal e o Parque dos Poderes.',
                'distância': 'Estamos a 15 minutos do Aeroporto Internacional de Campo Grande e a 10 minutos a pé da Praça Ary Coelho.',
                
                // Horários
                'check-in': 'O check-in é realizado a partir das 14h e o check-out até as 12h. Early check-in e late check-out estão sujeitos à disponibilidade.',
                'check-out': 'O check-out deve ser feito até as 12h. Podemos guardar sua bagagem se você precisar sair mais tarde.',
                'horário': 'Nossa recepção funciona 24 horas. O café da manhã é servido das 6h30 às 10h30.',
                
                // Serviços
                'wifi': 'Sim, oferecemos Wi-Fi gratuito de alta velocidade em todas as áreas do hotel.',
                'internet': 'Temos Wi-Fi gratuito disponível em todos os quartos e áreas comuns do hotel.',
                'estacionamento': 'Sim, temos estacionamento privativo para hóspedes com custo adicional de R$ 25 por dia.',
                'café da manhã': 'O café da manhã está incluso em todas as reservas e é servido das 6h30 às 10h30 no restaurante do hotel, com opções típicas do Pantanal.',
                'piscina': 'Sim, temos uma piscina ao ar livre com área de descanso e bar molhado, perfeita para relaxar após conhecer a cidade.',
                'restaurante': 'Nosso restaurante Sabores do Pantanal serve culinária regional sul-mato-grossense e pratos internacionais, aberto para almoço e jantar.',
                'academia': 'Sim, temos academia completa disponível para todos os hóspedes, aberta das 6h às 22h.',
                'ar condicionado': 'Sim, todos os nossos quartos são equipados com ar-condicionado, essencial para o clima quente de Campo Grande.',
                'frigobar': 'Todos os quartos possuem frigobar abastecido com bebidas e snacks regionais.',
                'tv': 'Sim, todos os quartos possuem TV com canais a cabo.',
                'serviço de quarto': 'Oferecemos serviço de quarto das 7h às 23h, com cardápio especial de comidas típicas pantaneiras.',
                'lavanderia': 'Sim, oferecemos serviço de lavanderia com custo adicional. As peças são entregues em 24 horas.',
                
                // Acessibilidade
                'acessibilidade': 'Nosso hotel possui rampas de acesso, elevadores e quartos adaptados para pessoas com mobilidade reduzida.',
                'cadeirante': 'Temos quartos adaptados para cadeirantes e todas as áreas comuns são acessíveis.',
                
                // Turismo e atrações
                'turismo': 'Campo Grande oferece diversas atrações como o Parque das Nações Indígenas, Parque dos Poderes, Museu das Culturas Dom Bosco e a feira indígena. Nossa recepção pode ajudar a organizar passeios.',
                'pantanal': 'Oferecemos pacotes de turismo para o Pantanal Sul, que fica a aproximadamente 2 horas de Campo Grande. São passeios de barco, safáris fotográficos e pesca esportiva.',
                'bonito': 'A cidade de Bonito, famosa pelo ecoturismo, fica a cerca de 3 horas de Campo Grande. Podemos ajudar a organizar passeios para lá.',
                'passeios': 'Nossa recepção pode ajudar a organizar city tours em Campo Grande, passeios ao Pantanal Sul ou excursões para Bonito.',
                
                // Gastronomia
                'comida típica': 'Nossa região é conhecida por pratos como o sobá (macarrão japonês adaptado), chipa (pão de queijo paraguaio), e carnes do Pantanal. Nosso restaurante serve muitas dessas especialidades.',
                'sobá': 'O sobá é um prato típico de Campo Grande, trazido pelos imigrantes japoneses e adaptado com ingredientes locais. Você pode experimentá-lo em nosso restaurante ou na Feira Central.',
                'churrasco': 'Mato Grosso do Sul é famoso pela qualidade de suas carnes. Nosso restaurante serve excelentes cortes de carne bovina do Pantanal.',
                
                // Eventos
                'eventos': 'Temos espaços para eventos corporativos e sociais com capacidade para até 150 pessoas, equipados com tecnologia audiovisual e serviço de buffet.',
                'reunião': 'Dispomos de salas de reunião com capacidade de 10 a 50 pessoas, com internet de alta velocidade e equipamentos audiovisuais.',
                'casamento': 'Nosso salão de festas é ideal para casamentos de até 120 convidados, com decoração personalizada e menu especial.',
                
                // Políticas
                'pet': 'Aceitamos animais de pequeno e médio porte (até 15kg) mediante taxa adicional de R$50 por dia.',
                'animais': 'Sim, aceitamos animais de estimação de pequeno e médio porte com taxa adicional. Por favor, informe-nos com antecedência.',
                'criança': 'Crianças até 7 anos não pagam quando acompanhadas dos pais e utilizando a mesma cama. Temos berços disponíveis mediante solicitação.',
                'cancelamento': 'Nossa política de cancelamento permite cancelamentos gratuitos até 48 horas antes do check-in.',
                
                // Pagamento
                'pagamento': 'Aceitamos cartões de crédito, débito, PIX e dinheiro. O pagamento pode ser feito no check-in ou antecipadamente.',
                'cartão': 'Aceitamos as principais bandeiras de cartões: Visa, Mastercard, American Express e Elo.',
                'pix': 'Sim, aceitamos pagamento via PIX. As informações serão fornecidas após a confirmação da reserva.',
                
                // Clima
                'clima': 'Campo Grande tem clima tropical com estação seca. O verão (dezembro a março) é quente e chuvoso, com temperaturas entre 25°C e 35°C. O inverno (junho a agosto) é mais seco, com temperaturas entre 15°C e 28°C.',
                'temperatura': 'A temperatura em Campo Grande varia bastante ao longo do ano. No verão pode chegar a 35°C, enquanto no inverno as mínimas podem ficar em torno de 15°C.',
                'chuva': 'A estação chuvosa em Campo Grande vai de outubro a março. Se você planeja visitar nesse período, recomendamos trazer guarda-chuva.',
                
                // Agradecimentos e despedidas
                'obrigado': 'De nada! Estou aqui para ajudar. Tem mais alguma pergunta sobre sua estadia em Campo Grande?',
                'obrigada': 'De nada! Estou aqui para ajudar. Tem mais alguma pergunta sobre sua estadia em Campo Grande?',
                'tchau': 'Até logo! Esperamos recebê-lo em breve no Hotel Manzoni em Campo Grande!',
                'adeus': 'Até a próxima! Aguardamos sua visita ao Hotel Manzoni e à bela cidade de Campo Grande!'
            };
            
            setTimeout(() => {
                this.removeTypingIndicator();
                
                // Verificar se há uma resposta predefinida
                let response = null;
                const messageLower = message.toLowerCase();
                
                // Verificar cada palavra-chave nas respostas predefinidas
                for (const key in commonResponses) {
                    if (messageLower.includes(key)) {
                        response = commonResponses[key];
                        break;
                    }
                }
                
                // Se não houver resposta predefinida mas contém palavras relacionadas a quartos
                if (!response) {
                    if (messageLower.includes('quarto') || messageLower.includes('acomodação') || 
                        messageLower.includes('cama') || messageLower.includes('suíte')) {
                        response = "Temos diferentes tipos de quartos: Suíte Luxo (R$350/diária), Quarto Casal Superior (R$280/diária), Quarto Casal Standard (R$220/diária) e Quarto Solteiro (R$180/diária). Todos incluem ar-condicionado, TV, Wi-Fi e café da manhã com produtos regionais do Pantanal. Qual tipo de quarto você prefere?";
                    }
                    // Perguntas sobre a cidade ou turismo
                    else if (messageLower.includes('campo grande') || messageLower.includes('turismo') || 
                             messageLower.includes('visitar') || messageLower.includes('passeio')) {
                        response = "Campo Grande oferece diversas atrações turísticas como o Parque das Nações Indígenas, Museu das Culturas Dom Bosco, Feira Central (famosa pelo sobá) e o Mercadão Municipal. A cidade também é porta de entrada para o Pantanal Sul e Bonito. Nossa recepção pode fornecer mais informações e dicas de passeios.";
                    }
                    // Perguntas sobre o Pantanal
                    else if (messageLower.includes('pantanal') || messageLower.includes('fauna') || 
                             messageLower.includes('flora') || messageLower.includes('natureza')) {
                        response = "O Pantanal é a maior planície alagável do mundo e fica a aproximadamente 2 horas de Campo Grande. Oferecemos pacotes de turismo com passeios de barco, safáris fotográficos e observação de aves. A melhor época para visitar é durante a seca (maio a outubro), quando os animais se concentram próximos às fontes de água.";
                    }
                    // Perguntas sobre Bonito
                    else if (messageLower.includes('bonito') || messageLower.includes('gruta') || 
                             messageLower.includes('flutuação') || messageLower.includes('cachoeira')) {
                        response = "Bonito fica a cerca de 3 horas de Campo Grande e é famoso por suas águas cristalinas, grutas, cachoeiras e atividades como flutuação e mergulho em rios de águas transparentes. Podemos ajudar a organizar passeios de um dia ou pacotes completos para Bonito.";
                    }
                    // Resposta genérica para outras perguntas
                    else {
                        response = "Desculpe, não entendi completamente sua pergunta. Posso ajudar com informações sobre reservas, quartos, serviços, turismo em Campo Grande, passeios ao Pantanal, gastronomia regional ou preços. Poderia reformular sua pergunta?";
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
            const galleryContainer = document.querySelector('.gallery-grid');
            const filterButtons = document.querySelectorAll('.gallery-filter button');
            
            if (galleryContainer && filterButtons.length) {
                const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
                
                // Filtrar itens (sem depender de Isotope)
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
                            const category = item.getAttribute('data-category');
                            if (filterValue === 'all') {
                                item.style.display = 'block';
                            } else if (category === filterValue) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    });
                });
            }
        },

        // Mapa interativo
        setupInteractiveMap: function() {
            const mapContainer = document.getElementById('hotel-map');
            
            if (mapContainer && typeof L !== 'undefined') {
                // Coordenadas do hotel em Campo Grande, MS
                const hotelLat = -20.462780;
                const hotelLng = -54.615520;
                
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
                    .bindPopup('<strong>Hotel Manzoni</strong><br>Seu refúgio de luxo no coração de Campo Grande')
                    .openPopup();
                
                // Adicionar pontos de interesse próximos
                const pointsOfInterest = [
                    { name: 'Parque das Nações Indígenas', lat: -20.455120, lng: -54.575780 },
                    { name: 'Shopping Campo Grande', lat: -20.469414, lng: -54.605804 },
                    { name: 'Mercadão Municipal', lat: -20.481895, lng: -54.619499 },
                    { name: 'Praça Ary Coelho', lat: -20.465231, lng: -54.618271 },
                    { name: 'Feira Central (Sobá)', lat: -20.472580, lng: -54.622308 }
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

