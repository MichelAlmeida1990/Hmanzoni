// Espera o DOM ser carregado completamente
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }, 2000);

    // Toggle do menu mobile
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        // Acessibilidade - alterna o atributo aria-expanded
        const expanded = nav.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', expanded);
    });

    // Fecha o menu ao clicar em um link (para dispositivos móveis)
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Botão de voltar ao topo
    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Toggle do tema
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        
        // Salva a preferência do usuário
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
            themeToggle.setAttribute('aria-label', 'Alternar para modo escuro');
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
            themeToggle.setAttribute('aria-label', 'Alternar para modo claro');
        }
    });
    
    // Verifica se há uma preferência salva ou preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
        themeToggle.setAttribute('aria-label', 'Alternar para modo escuro');
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
        themeToggle.setAttribute('aria-label', 'Alternar para modo claro');
    } else if (prefersDarkScheme.matches) {
        document.body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
        themeToggle.setAttribute('aria-label', 'Alternar para modo claro');
    } else {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
        themeToggle.setAttribute('aria-label', 'Alternar para modo escuro');
    }

    // Lightbox para a galeria
    const galleryLinks = document.querySelectorAll('.gallery-link');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Adiciona navegação do lightbox
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentImageIndex = 0;
    
    function openLightbox(index) {
        currentImageIndex = index;
        const link = galleryLinks[index];
        const imgSrc = link.getAttribute('href');
        const imgAlt = link.querySelector('img').getAttribute('alt');
        
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        
        if (lightboxCaption) {
            lightboxCaption.textContent = imgAlt;
        }
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Foca no elemento de fechar para acessibilidade
        setTimeout(() => {
            lightboxClose.focus();
        }, 100);
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Retorna o foco para o link que foi clicado
        galleryLinks[currentImageIndex].focus();
    }
    
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryLinks.length;
        openLightbox(currentImageIndex);
    }
    
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryLinks.length) % galleryLinks.length;
        openLightbox(currentImageIndex);
    }
    
    galleryLinks.forEach(function(link, index) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(index);
        });
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navegação do lightbox com teclado
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        }
    });

    // Filtro de galeria
    const galleryFilters = document.querySelectorAll('.gallery-filter button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryFilters.length > 0) {
        galleryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove a classe active de todos os filtros
                galleryFilters.forEach(btn => btn.classList.remove('active'));
                
                // Adiciona a classe active ao filtro clicado
                this.classList.add('active');
                
                const category = this.getAttribute('data-filter');
                
                // Filtra os itens da galeria
                galleryItems.forEach(item => {
                    if (category === 'all' || item.classList.contains(category)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Chatbot redesenhado
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    
    // Inicializa o chatbot com uma mensagem de boas-vindas
    if (chatbotMessages) {
        // Adiciona mensagem de boas-vindas quando o chatbot é aberto pela primeira vez
        let chatbotInitialized = false;
        
        function initChatbot() {
            if (!chatbotInitialized) {
                addMessage('bot', 'Olá! Bem-vindo ao Hotel Manzoni. Como posso ajudar você hoje?');
                chatbotInitialized = true;
            }
        }
        
        if (chatbotIcon) {
            chatbotIcon.addEventListener('click', function() {
                chatbotContainer.classList.add('active');
                initChatbot();
                
                // Foca no input para facilitar a digitação
                setTimeout(() => {
                    chatbotInput.focus();
                }, 300);
            });
        }
        
        if (chatbotClose) {
            chatbotClose.addEventListener('click', function() {
                chatbotContainer.classList.remove('active');
            });
        }
        
        function sendMessage() {
            const message = chatbotInput.value.trim();
            
            if (message !== '') {
                // Adiciona a mensagem do usuário
                addMessage('user', message);
                
                // Limpa o input
                chatbotInput.value = '';
                
                // Mostra indicador de digitação
                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'message bot typing';
                typingIndicator.innerHTML = '<div class="message-content"><span class="typing-dots">...</span></div>';
                chatbotMessages.appendChild(typingIndicator);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                
                // Simula uma resposta do bot após um tempo
                setTimeout(function() {
                    // Remove o indicador de digitação
                    chatbotMessages.removeChild(typingIndicator);
                    
                    // Adiciona a resposta do bot
                    const botResponse = getBotResponse(message);
                    addMessage('bot', botResponse);
                    
                    // Rola para o final da conversa
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 1000 + Math.random() * 1000); // Tempo aleatório para parecer mais natural
            }
        }
        
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
    }
    
    function addMessage(type, content) {
        if (!chatbotMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatbotMessages.appendChild(messageDiv);
        
        // Rola para o final da conversa
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function getBotResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('reserva') || message.includes('reservar') || message.includes('quarto')) {
            return 'Para fazer uma reserva, por favor entre em contato pelo telefone (11) 3456-7890 ou preencha o formulário na seção de contato.';
        } else if (message.includes('preço') || message.includes('valor') || message.includes('custo') || message.includes('diária')) {
            return 'Nossos preços variam de R$ 180,00 a R$ 350,00 dependendo do tipo de quarto e da temporada. Temos promoções especiais para estadias mais longas!';
        } else if (message.includes('check-in') || message.includes('entrada')) {
            return 'Nosso horário de check-in é a partir das 14h. Para check-in antecipado, por favor entre em contato conosco com antecedência.';
        } else if (message.includes('check-out') || message.includes('saída')) {
            return 'Nosso horário de check-out é até às 12h. Late check-out pode ser solicitado, sujeito à disponibilidade.';
        } else if (message.includes('café') || message.includes('refeição') || message.includes('comida') || message.includes('restaurante')) {
            return 'Oferecemos café da manhã completo incluso em todas as diárias, servido das 6h às 10h. Nosso restaurante também serve almoço e jantar com o melhor da culinária local e internacional.';
        } else if (message.includes('localização') || message.includes('endereço') || message.includes('onde')) {
            return 'Estamos localizados na Rua das Flores, 123 - Centro, próximo às principais atrações turísticas da cidade e a apenas 10 minutos do aeroporto.';
        } else if (message.includes('estacionamento') || message.includes('garagem') || message.includes('carro')) {
            return 'Sim, oferecemos estacionamento privativo para nossos hóspedes com serviço de manobrista. O valor é de R$ 25,00 por diária.';
        } else if (message.includes('wifi') || message.includes('internet')) {
            return 'Oferecemos Wi-Fi gratuito de alta velocidade em todas as áreas do hotel.';
        } else if (message.includes('pet') || message.includes('cachorro') || message.includes('gato') || message.includes('animal')) {
            return 'Somos pet friendly! Aceitamos animais de pequeno e médio porte com uma taxa adicional de R$ 50,00 por estadia.';
        } else if (message.includes('piscina') || message.includes('academia') || message.includes('spa')) {
            return 'Temos piscina aquecida, academia completa e spa com diversos tratamentos disponíveis para nossos hóspedes.';
        } else if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
            return 'Olá! Como posso ajudar você hoje?';
        } else if (message.includes('obrigado') || message.includes('obrigada') || message.includes('agradecido')) {
            return 'Por nada! Estou aqui para ajudar. Tem mais alguma pergunta?';
        } else if (message.includes('ajuda') || message.includes('dúvida')) {
            return 'Posso ajudar com informações sobre reservas, preços, horários de check-in/check-out, serviços do hotel, localização e muito mais. O que você gostaria de saber?';
        } else {
            return 'Não entendi sua pergunta. Pode reformular ou perguntar sobre reservas, preços, horários de check-in/check-out, serviços do hotel ou nossa localização.';
        }
    }

    // Formulário de contato com validação
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Limpa mensagens de erro anteriores
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Valida nome
            if (name.value.trim() === '') {
                showError(name, 'Por favor, informe seu nome');
                isValid = false;
            }
            
            // Valida email
            if (email.value.trim() === '') {
                showError(email, 'Por favor, informe seu e-mail');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Por favor, informe um e-mail válido');
                isValid = false;
            }
            
            // Valida mensagem
            if (message.value.trim() === '') {
                showError(message, 'Por favor, escreva sua mensagem');
                isValid = false;
            }
            
            if (isValid) {
                // Simulação de envio
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
                
                setTimeout(() => {
                    // Mostra mensagem de sucesso
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    contactForm.appendChild(successMessage);
                    
                    // Reset do formulário
                    contactForm.reset();
                    
                    // Restaura o botão
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    
                    // Remove a mensagem após alguns segundos
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
        
        function showError(input, message) {
            const formGroup = input.closest('.form-group');
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            formGroup.appendChild(error);
            input.classList.add('error');
            
            // Remove a classe de erro quando o usuário começar a digitar
            input.addEventListener('input', function() {
                input.classList.remove('error');
                const errorMsg = formGroup.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }, { once: true });
        }
        
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    }

    // Newsletter no footer
    const newsletterForm = document.querySelector('.footer-newsletter form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = this.querySelector('input');
            const email = input.value.trim();
            
            if (email === '' || !isValidEmail(email)) {
                alert('Por favor, informe um e-mail válido.');
                return;
            }
            
            // Simulação de inscrição
            input.value = '';
            alert('Obrigado por se inscrever em nossa newsletter!');
        });
        
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    }

    // Animação de elementos ao rolar a página
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        elementsToAnimate.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verifica elementos visíveis no carregamento inicial
    
    // Adiciona classe para animação aos elementos que devem ser animados
    document.querySelectorAll('.section-title, .accommodation-card, .service-card, .gallery-item, .about-image, .feature-item').forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Inicializa animações com delay para cada elemento
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    document.querySelectorAll('.accommodation-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.05}s`;
    });
    
    document.querySelectorAll('.feature-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Lazy loading para imagens
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    img.onload = () => {
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }

    // Detecção de conexão lenta para otimização
    if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g' || 
        navigator.connection.effectiveType === '2g') {
        document.body.classList.add('slow-connection');
    }

    // Smooth scroll para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora se for o link do lightbox
            if (this.classList.contains('gallery-link')) return;
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Inicializa o carrossel de depoimentos se existir
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (testimonialsContainer) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.testimonial-slide');
        const dotsContainer = document.querySelector('.testimonial-dots');
        const totalSlides = slides.length;
        
        // Cria os pontos de navegação
        if (dotsContainer) {
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('testimonial-dot');
                dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        // Inicializa o carrossel
        function initTestimonials() {
            if (slides.length > 0) {
                slides[0].classList.add('active');
                
                if (dotsContainer) {
                    dotsContainer.children[0].classList.add('active');
                }
                
                // Avança automaticamente a cada 5 segundos
                setInterval(() => {
                    nextSlide();
                }, 5000);
            }
        }
        
        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            
            if (dotsContainer) {
                dotsContainer.children[currentSlide].classList.remove('active');
            }
            
            currentSlide = index;
            
            slides[currentSlide].classList.add('active');
            
            if (dotsContainer) {
                dotsContainer.children[currentSlide].classList.add('active');
            }
        }
        
        function nextSlide() {
            goToSlide((currentSlide + 1) % totalSlides);
        }
        
        function prevSlide() {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        }
        
        // Botões de navegação
        const prevButton = document.querySelector('.testimonial-prev');
        const nextButton = document.querySelector('.testimonial-next');
        
        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }
        
        // Inicializa o carrossel
        initTestimonials();
        
        // Pausa o carrossel ao passar o mouse
        testimonialsContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });
        
        testimonialsContainer.addEventListener('mouseleave', () => {
            autoSlide = setInterval(nextSlide, 5000);
        });
    }

    // Função para verificar se o navegador suporta o formato webp
    function checkWebpSupport() {
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }
    
    // Adiciona classe ao body se o navegador suportar webp
    if (checkWebpSupport()) {
        document.body.classList.add('webp-support');
    }
});

// Detecta quando a página está totalmente carregada
window.addEventListener('load', function() {
    // Remover o preloader imediatamente se a página já estiver carregada
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }
    
    // Registra o tempo de carregamento da página
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`Página carregada em ${loadTime}ms`);
});
