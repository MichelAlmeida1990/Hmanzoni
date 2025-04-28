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

        // Menu mobile - VERSÃO CORRIGIDA
        setupMobileMenu: function() {
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const nav = document.querySelector('nav');
            const body = document.body;
            
            if (mobileMenuToggle && nav) {
                // Configuração inicial para acessibilidade
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                nav.setAttribute('aria-hidden', 'true');
                
                // Evento de clique no botão do menu
                mobileMenuToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle das classes
                    nav.classList.toggle('active');
                    mobileMenuToggle.classList.toggle('active');
                    body.classList.toggle('menu-open');
                    
                    // Atualizar atributos de acessibilidade
                    const expanded = nav.classList.contains('active');
                    mobileMenuToggle.setAttribute('aria-expanded', expanded);
                    nav.setAttribute('aria-hidden', !expanded);
                });
                
                // Fechar menu ao clicar em um link
                const navLinks = nav.querySelectorAll('a');
                navLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        nav.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                        body.classList.remove('menu-open');
                        
                        // Atualizar atributos de acessibilidade
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        nav.setAttribute('aria-hidden', 'true');
                    });
                });
                
                // Fechar menu ao clicar fora dele
                document.addEventListener('click', function(e) {
                    if (nav.classList.contains('active') && 
                        !nav.contains(e.target) && 
                        e.target !== mobileMenuToggle && 
                        !mobileMenuToggle.contains(e.target)) {
                        
                        nav.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                        body.classList.remove('menu-open');
                        
                        // Atualizar atributos de acessibilidade
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        nav.setAttribute('aria-hidden', 'true');
                    }
                });
            }
        },
        
        // Alternar tema - VERSÃO CORRIGIDA
        setupThemeToggle: function() {
            const themeButton = document.getElementById('theme-button');
            
            if (themeButton) {
                // Verificar se já existe um tema salvo no localStorage
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    document.documentElement.setAttribute('data-theme', savedTheme);
                    // Atualizar ícone do botão se necessário
                    this.updateThemeButtonIcon(savedTheme);
                }
                
                themeButton.addEventListener('click', () => {
                    // Obter o tema atual
                    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    
                    // Definir o próximo tema (alternar entre light e dark)
                    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                    
                    // Aplicar o novo tema
                    document.documentElement.setAttribute('data-theme', newTheme);
                    
                    // Salvar preferência no localStorage
                    localStorage.setItem('theme', newTheme);
                    
                    // Atualizar ícone do botão
                    this.updateThemeButtonIcon(newTheme);
                    
                    // Disparar evento personalizado para outros componentes
                    const themeEvent = new CustomEvent('themeChanged', {
                        detail: {
                            theme: newTheme
                        }
                    });
                    document.dispatchEvent(themeEvent);
                    
                    if (this.config.debug) {
                        console.log('Tema alterado para:', newTheme);
                    }
                });
            }
        },
        
        // Atualizar ícone do botão de tema
        updateThemeButtonIcon: function(theme) {
            const themeButton = document.getElementById('theme-button');
            if (!themeButton) return;
            
            // Remover classes existentes
            themeButton.classList.remove('fa-sun', 'fa-moon');
            
            // Adicionar classe apropriada
            if (theme === 'dark') {
                themeButton.classList.add('fa-sun'); // Mostrar sol no modo escuro
                themeButton.setAttribute('aria-label', 'Mudar para tema claro');
                themeButton.setAttribute('title', 'Mudar para tema claro');
            } else {
                themeButton.classList.add('fa-moon'); // Mostrar lua no modo claro
                themeButton.setAttribute('aria-label', 'Mudar para tema escuro');
                themeButton.setAttribute('title', 'Mudar para tema escuro');
            }
        },

        // Galeria básica - CORRIGIDA
        setupGallery: function() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const lightbox = document.querySelector('.lightbox');
            const lightboxImage = document.querySelector('.lightbox-image');
            const lightboxClose = document.querySelector('.lightbox-close');
            
            if (galleryItems.length && lightbox && lightboxImage) {
                // Abrir lightbox ao clicar em uma imagem ou no ícone de lupa
                galleryItems.forEach(item => {
                    // Captura o elemento da imagem
                    const img = item.querySelector('img');
                    // Captura o ícone de lupa (se existir)
                    const searchIcon = item.querySelector('.gallery-icon');
                    
                    // Função para abrir o lightbox
                    const openLightbox = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const imgSrc = img.getAttribute('src');
                        lightboxImage.setAttribute('src', imgSrc);
                        lightbox.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    };
                    
                    // Adiciona evento ao item da galeria
                    item.addEventListener('click', openLightbox);
                    
                    // Adiciona evento específico ao ícone de lupa, se existir
                    if (searchIcon) {
                        searchIcon.addEventListener('click', openLightbox);
                    }
                });
                
                // Fechar lightbox ao clicar no botão de fechar
                if (lightboxClose) {
                    lightboxClose.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
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
                
                // Fechar lightbox com tecla ESC
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
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
                
                // Fechar chatbot ao clicar fora dele
                document.addEventListener('click', (e) => {
                    if (chatbotContainer.classList.contains('active') && 
                        !chatbotContainer.contains(e.target) && 
                        e.target !== chatbotToggle && 
                        !chatbotToggle.contains(e.target)) {
                        chatbotContainer.classList.remove('active');
                        chatbotContainer.setAttribute('aria-hidden', 'true');
                    }
                });
                
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
            
            // Remover qualquer indicador de digitação existente
            this.removeTypingIndicator();
            
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
                'preço': 'Nossos preços: Quarto Casal (R$150), Quarto Solteiro (R$120) e Quarto Standard (R$130). Todos incluem Wi-Fi e ar-condicionado.',
                'valor': 'Nossos preços: Quarto Casal (R$150), Quarto Solteiro (R$120) e Quarto Standard (R$130). Todos incluem Wi-Fi e ar-condicionado.',
                'diária': 'Nossas diárias: Quarto Casal (R$150), Quarto Solteiro (R$120) e Quarto Standard (R$130). Todos incluem Wi-Fi e ar-condicionado.',
                'tarifa': 'Nossas tarifas: Quarto Casal (R$150), Quarto Solteiro (R$120) e Quarto Standard (R$130). Todos incluem Wi-Fi e ar-condicionado.',
                'quarto': 'Temos: Quarto Casal (R$150), Quarto Solteiro (R$120) e Quarto Standard (R$130). Todos com ar-condicionado, TV e Wi-Fi.',
                'acomodação': 'Oferecemos Quarto Casal (R$150), Quarto Solteiro (R$120) e Quarto Standard (R$130). Todos com ar-condicionado, TV e Wi-Fi.',
                'cama': 'Quarto Casal: cama de casal. Quarto Solteiro: cama de solteiro. Quarto Standard: cama de casal ou solteiro.',

                // Reservas
                'reserva': 'Para fazer uma reserva, use nosso formulário de contato online ou ligue para (11) 5555-5555. Precisamos de seus dados, datas de check-in/check-out e tipo de quarto desejado.',
                'reservar': 'Reserve pelo site ou telefone (11) 5555-5555. Preencha o formulário de contato com suas datas de check-in/check-out.',
                'disponibilidade': 'Para verificar disponibilidade, informe suas datas de interesse pelo telefone (11) 5555-5555 ou pelo formulário de contato em nosso site.',
                'cancelamento': 'Para informações sobre cancelamento, entre em contato conosco pelo telefone (11) 5555-5555 ou email contato@hotelmanzoni.com.br.',
                
                // Serviços e facilidades
                'wifi': 'Oferecemos Wi-Fi gratuito em todas as áreas do hotel.',
                'internet': 'Wi-Fi gratuito disponível em todos os quartos e áreas comuns.',
                'tv': 'Todos os quartos possuem TV para seu entretenimento.',
                'ar condicionado': 'Todos os quartos são equipados com ar-condicionado para seu conforto.',
                'banheiro': 'Todos os quartos possuem banheiros privativos e bem equipados.',
                
                // Localização
                'localização': 'Estamos localizados na Av. Afonso Pena, 1000 - Centro, Campo Grande, MS - CEP 79002-000.',
                'onde': 'O Hotel Manzoni fica na Av. Afonso Pena, 1000 - Centro, Campo Grande, MS - CEP 79002-000.',
                'endereço': 'Nosso endereço é Av. Afonso Pena, 1000 - Centro, Campo Grande, MS - CEP 79002-000.',
                'como chegar': 'Estamos localizados no centro de Campo Grande, com fácil acesso a transporte público. Para mais informações, entre em contato conosco.',
                
                // Contato
                'telefone': 'Nosso telefone para contato é (11) 5555-5555.',
                'email': 'Nosso email para contato é contato@hotelmanzoni.com.br.',
                'contato': 'Entre em contato pelo telefone (11) 5555-5555 ou email contato@hotelmanzoni.com.br.',
                
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
            
            // Criar uma cópia do indicador de digitação para garantir que seja removido corretamente
            const typingIndicator = document.getElementById('typing-indicator');
            
            setTimeout(() => {
                // Remover o indicador de digitação
                if (typingIndicator) {
                    typingIndicator.remove();
                } else {
                    this.removeTypingIndicator();
                }
                
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
                        response = "Temos 3 tipos de quartos: Quarto Casal (R$150), Quarto Solteiro (R$120) e Quarto Standard (R$130). Todos incluem Wi-Fi, ar-condicionado e TV. Qual tipo de quarto você gostaria de reservar?";
                    }
                    // Perguntas sobre serviços gerais
                    else if (messageLower.includes('serviço') || messageLower.includes('oferecem') || 
                             messageLower.includes('disponível') || messageLower.includes('tem')) {
                        response = "Oferecemos diversos serviços: Wi-Fi gratuito, TV, ar-condicionado, banheiros privativos e atendimento cordial. Algum serviço específico que gostaria de saber mais?";
                    }
                    // Perguntas sobre reservas ou disponibilidade
                    else if (messageLower.includes('reserv') || messageLower.includes('dispon') || 
                             messageLower.includes('vaga') || messageLower.includes('data')) {
                        response = "Para verificar disponibilidade e fazer reservas, entre em contato pelo telefone (11) 5555-5555 ou use o formulário de contato em nosso site. Precisamos saber a data de check-in/check-out, número de hóspedes e tipo de quarto desejado.";
                    }
                    // Perguntas sobre localização
                    else if (messageLower.includes('onde') || messageLower.includes('local') || 
                             messageLower.includes('fica') || messageLower.includes('endereço')) {
                        response = "Estamos localizados na Av. Afonso Pena, 1000 - Centro, Campo Grande, MS - CEP 79002-000. Uma localização privilegiada no centro da cidade.";
                    }
                    // Resposta genérica para outras perguntas
                    else {
                        response = "Posso ajudar com informações sobre quartos, preços, reservas, serviços e localização do Hotel Manzoni. Por favor, especifique sua dúvida para que eu possa atendê-lo melhor.";
                    }
                }
                
                // Adicionar a resposta do bot
                this.addChatMessage(response, 'bot');
            }, 1500);
        },
        
        // Buscar resposta da API de IA (mantido para referência, mas não usado)
        fetchAIResponse: function(message) {
            const payload = {
                inputs: `Você é um assistente virtual do Hotel Manzoni, um hotel em Campo Grande, MS. Responda de forma educada e prestativa. Pergunta do cliente: ${message}`,
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
                // Coordenadas do hotel (Campo Grande, MS)
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
                    .bindPopup('<strong>Hotel Manzoni</strong><br>Conforto e simplicidade no centro de Campo Grande')
                    .openPopup();
                
                // Adicionar pontos de interesse próximos
                const pointsOfInterest = [
                    { name: 'Shopping Campo Grande', lat: -20.457890, lng: -54.619320 },
                    { name: 'Parque das Nações Indígenas', lat: -20.452180, lng: -54.605870 },
                    { name: 'Praça Ary Coelho', lat: -20.462120, lng: -54.618271 },
                    { name: 'Mercado Municipal', lat: -20.465580, lng: -54.610308 }
                ];
                
                pointsOfInterest.forEach(poi => {
                    L.marker([poi.lat, poi.lng])
                        .addTo(map)
                        .bindPopup(`<strong>${poi.name}</strong><br>Ponto de interesse`);
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
            
            // Detectar preferência de tema do sistema
            if (window.matchMedia) {
                const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
                
                // Aplicar tema inicial baseado na preferência do sistema (se não houver tema salvo)
                if (!localStorage.getItem('theme')) {
                    const initialTheme = prefersDarkScheme.matches ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', initialTheme);
                    localStorage.setItem('theme', initialTheme);
                    this.updateThemeButtonIcon(initialTheme);
                }
                
                // Atualizar tema quando a preferência do sistema mudar
                prefersDarkScheme.addEventListener('change', (e) => {
                    // Só atualizar automaticamente se o usuário não tiver escolhido um tema
                    if (!localStorage.getItem('userSelectedTheme')) {
                        const newTheme = e.matches ? 'dark' : 'light';
                        document.documentElement.setAttribute('data-theme', newTheme);
                        localStorage.setItem('theme', newTheme);
                        this.updateThemeButtonIcon(newTheme);
                    }
                });
            }
        },

        // Atualizar tema dos componentes
        updateComponentsTheme: function(theme) {
            // Atualizar cursor personalizado
            const cursorElements = document.querySelectorAll('.cursor-dot, .cursor-ring');
            cursorElements.forEach(el => {
                el.setAttribute('data-theme', theme);
            });
            
            // Atualizar ícone do botão de tema
            this.updateThemeButtonIcon(theme);
            
            // Atualizar outros componentes conforme necessário
            // Chatbot
            const chatbotContainer = document.querySelector('.chatbot-container');
            if (chatbotContainer) {
                chatbotContainer.setAttribute('data-theme', theme);
            }
            
            // Galeria
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                item.setAttribute('data-theme', theme);
            });
            
            // Lightbox
            const lightbox = document.querySelector('.lightbox');
            if (lightbox) {
                lightbox.setAttribute('data-theme', theme);
            }
            
            // Formulários
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.setAttribute('data-theme', theme);
            });
        }
    };
    
    // Inicializar quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        HotelManzoni.init();
    });
})();
