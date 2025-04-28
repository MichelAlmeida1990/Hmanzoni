/**
 * Hotel Website - Script Principal
 * Versão: 2.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Objeto para armazenar todas as funções
    const HotelApp = {
        // Configurações
        settings: {
            animationsEnabled: true,
            darkThemeClass: 'dark-theme',
            dataTheme: localStorage.getItem('theme') || 'light',
            isMobile: window.innerWidth < 768
        },

        // Inicialização
        init: function() {
            this.setupPreloader();
            this.setupThemeToggle();
            this.setupContactForm();
            this.setupSmoothScroll();
            this.setupMobileMenu();
            this.setupGallery();
            this.setupLightbox();
            this.setupScrollAnimations();
            this.setupHeaderScroll();
            this.setupParallaxEffect();
            this.setupCardEffects();
            this.setupHeroTyping();
            this.setupCounters();
            this.setupButtonEffects();
            this.setupGlowEffects();
            this.setupIconEffects();
            this.setupLazyLoading();
            this.setupBookingSystem();
            this.setupChatbot();
            this.setupAccessibility();
            
            // Verificar se já deve iniciar com tema escuro
            if (this.settings.dataTheme === 'dark') {
                document.body.classList.add(this.settings.darkThemeClass);
                const themeButton = document.getElementById('theme-button');
                if (themeButton) themeButton.textContent = 'Tema Claro';
                this.applyDarkThemeEffects();
            }
            
            // Detectar preferência do sistema
            this.detectSystemTheme();
            
            // Ajustar para dispositivos móveis
            this.setupMobileOptimizations();
        },

        // Preloader
        setupPreloader: function() {
            const preloader = document.querySelector('.preloader');
            if (!preloader) return;
            
            window.addEventListener('load', function() {
                setTimeout(function() {
                    preloader.classList.add('hidden');
                    setTimeout(function() {
                        preloader.style.display = 'none';
                    }, 500);
                }, 1000); // Reduzido para 1 segundo para melhor UX
            });
        },

        // Alternador de Tema
        setupThemeToggle: function() {
            const themeButton = document.getElementById('theme-button');
            if (!themeButton) return;
            
            themeButton.addEventListener('click', () => {
                document.body.classList.toggle(this.settings.darkThemeClass);
                
                if (document.body.classList.contains(this.settings.darkThemeClass)) {
                    themeButton.textContent = 'Tema Claro';
                    localStorage.setItem('theme', 'dark');
                    this.applyDarkThemeEffects();
                } else {
                    themeButton.textContent = 'Tema Escuro';
                    localStorage.setItem('theme', 'light');
                    this.removeDarkThemeEffects();
                }
                
                // Atualizar atributo ARIA
                themeButton.setAttribute('aria-label', 
                    document.body.classList.contains(this.settings.darkThemeClass) 
                        ? 'Mudar para tema claro' 
                        : 'Mudar para tema escuro'
                );
            });
        },

        // Aplicar efeitos do tema escuro
        applyDarkThemeEffects: function() {
            document.querySelectorAll('.section-title, .room-type, .service-icon, .footer-title').forEach(el => {
                el.classList.add('gold-text');
            });
            
            this.addHexagonPattern();
            this.updateGlowEffects();
        },

        // Remover efeitos do tema escuro
        removeDarkThemeEffects: function() {
            document.querySelectorAll('.gold-text').forEach(el => {
                el.classList.remove('gold-text');
            });
            
            this.removeHexagonPattern();
            this.updateGlowEffects();
        },

        // Detectar tema do sistema
        detectSystemTheme: function() {
            if (localStorage.getItem('theme')) return; // Respeitar preferência do usuário
            
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            if (prefersDarkScheme.matches) {
                document.body.classList.add(this.settings.darkThemeClass);
                const themeButton = document.getElementById('theme-button');
                if (themeButton) themeButton.textContent = 'Tema Claro';
                this.applyDarkThemeEffects();
                localStorage.setItem('theme', 'dark');
            }
            
            // Ouvir mudanças no tema do sistema
            prefersDarkScheme.addEventListener('change', (e) => {
                if (localStorage.getItem('theme')) return; // Ignorar se usuário já definiu
                
                if (e.matches) {
                    document.body.classList.add(this.settings.darkThemeClass);
                    const themeButton = document.getElementById('theme-button');
                    if (themeButton) themeButton.textContent = 'Tema Claro';
                    this.applyDarkThemeEffects();
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove(this.settings.darkThemeClass);
                    const themeButton = document.getElementById('theme-button');
                    if (themeButton) themeButton.textContent = 'Tema Escuro';
                    this.removeDarkThemeEffects();
                    localStorage.setItem('theme', 'light');
                }
            });
        },

        // Adicionar padrão hexagonal
        addHexagonPattern: function() {
            const sections = document.querySelectorAll('section, .footer');
            sections.forEach(section => {
                if (!section.querySelector('.hexagon-pattern')) {
                    const pattern = document.createElement('div');
                    pattern.classList.add('hexagon-pattern');
                    section.appendChild(pattern);
                }
            });
        },

        // Remover padrão hexagonal
        removeHexagonPattern: function() {
            const patterns = document.querySelectorAll('.hexagon-pattern');
            patterns.forEach(pattern => {
                pattern.remove();
            });
        },

        // Formulário de contato
        setupContactForm: function() {
            const contactForm = document.querySelector('.contact-form');
            if (!contactForm) return;
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar formulário
                const formFields = this.querySelectorAll('input, textarea');
                let isValid = true;
                
                formFields.forEach(field => {
                    if (field.required && !field.value.trim()) {
                        field.classList.add('error');
                        isValid = false;
                        
                        // Adicionar mensagem de erro
                        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                            const errorMsg = document.createElement('div');
                            errorMsg.classList.add('error-message');
                            errorMsg.textContent = 'Este campo é obrigatório';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                    } else {
                        field.classList.remove('error');
                        if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                            field.nextElementSibling.remove();
                        }
                    }
                });
                
                if (!isValid) return;
                
                // Efeito de carregamento no botão
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitButton.disabled = true;
                
                // Simulação de envio de formulário
                setTimeout(() => {
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('success-message');
                    successMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <p>Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
                    `;
                    
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successMessage);
                    
                    // Restaurar formulário após alguns segundos
                    setTimeout(() => {
                        location.reload();
                    }, 5000);
                }, 1500);
            });
            
            // Remover mensagens de erro ao digitar
            contactForm.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                    if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                        this.nextElementSibling.remove();
                    }
                });
            });
        },

        // Rolagem suave
        setupSmoothScroll: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Fechar menu mobile se estiver aberto
                        const nav = document.querySelector('nav');
                        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
                        
                        if (nav && nav.classList.contains('active')) {
                            nav.classList.remove('active');
                            if (mobileMenuToggle) {
                                mobileMenuToggle.classList.remove('active');
                                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                                document.body.style.overflow = '';
                            }
                        }
                        
                        // Rolar para o elemento
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                        
                        // Destacar brevemente a seção
                        setTimeout(() => {
                            targetElement.classList.add('highlight-section');
                            setTimeout(() => {
                                targetElement.classList.remove('highlight-section');
                            }, 1000);
                        }, 600);
                        
                        // Atualizar foco para acessibilidade
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus({ preventScroll: true });
                        
                        // Atualizar URL sem recarregar a página
                        history.pushState(null, null, targetId);
                    }
                });
            });
        },

        // Menu mobile
        setupMobileMenu: function() {
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const nav = document.querySelector('nav');
            
            if (!mobileMenuToggle || !nav) return;
            
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-controls', 'navigation');
            
            mobileMenuToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                this.classList.toggle('active');
                
                const isExpanded = this.classList.contains('active');
                
                if (isExpanded) {
                    this.innerHTML = '<i class="fas fa-times"></i>';
                    document.body.style.overflow = 'hidden'; // Impedir rolagem quando menu está aberto
                    this.setAttribute('aria-expanded', 'true');
                } else {
                    this.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = ''; // Permitir rolagem novamente
                    this.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Fechar menu ao clicar em um link
            document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                });
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', function(e) {
                if (nav.classList.contains('active') && 
                    !nav.contains(e.target) && 
                    e.target !== mobileMenuToggle && 
                    !mobileMenuToggle.contains(e.target)) {
                    
                    nav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
            
            // Suporte a navegação por teclado
            mobileMenuToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        },

        // Galeria com filtro
        setupGallery: function() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            if (filterButtons.length === 0 || galleryItems.length === 0) return;
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remover classe active de todos os botões
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Adicionar classe active ao botão clicado
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-filter');
                    
                    galleryItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
                
                // Suporte a navegação por teclado
                button.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        },

        // Lightbox para galeria
        setupLightbox: function() {
            const galleryImages = document.querySelectorAll('.gallery-item img');
            const lightbox = document.querySelector('.gallery-lightbox');
            const lightboxImage = document.querySelector('.lightbox-image');
            const lightboxClose = document.querySelector('.lightbox-close');
            
            if (galleryImages.length === 0 || !lightbox || !lightboxImage || !lightboxClose) return;
            
            let currentImageIndex = 0;
            let touchStartX = 0;
            let touchEndX = 0;
            
            // Adicionar descrição e contador
            const lightboxCaption = document.createElement('div');
            lightboxCaption.classList.add('lightbox-caption');
            lightbox.appendChild(lightboxCaption);
            
            const lightboxCounter = document.createElement('div');
            lightboxCounter.classList.add('lightbox-counter');
            lightbox.appendChild(lightboxCounter);
            
            galleryImages.forEach((img, index) => {
                // Adicionar atributos de acessibilidade
                img.setAttribute('role', 'button');
                img.setAttribute('tabindex', '0');
                img.setAttribute('aria-label', `Ver imagem ${img.alt}`);
                
                img.addEventListener('click', function() {
                    openLightbox(index);
                });
                
                // Suporte a navegação por teclado
                img.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(index);
                    }
                });
            });
            
            function openLightbox(index) {
                currentImageIndex = index;
                updateLightboxContent();
                
                lightbox.style.display = 'flex';
                setTimeout(() => {
                    lightbox.style.opacity = '1';
                }, 50);
                
                document.body.style.overflow = 'hidden';
                
                // Focar no botão de fechar para acessibilidade
                setTimeout(() => {
                    lightboxClose.focus();
                }, 100);
            }
            
            function updateLightboxContent() {
                const img = galleryImages[currentImageIndex];
                
                lightboxImage.style.opacity = '0';
                setTimeout(() => {
                    lightboxImage.src = img.src;
                    lightboxImage.alt = img.alt;
                    
                    // Atualizar descrição
                    lightboxCaption.textContent = img.alt || '';
                    
                    // Atualizar contador
                    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
                    
                    lightboxImage.style.opacity = '1';
                }, 300);
            }
            
            function closeLightbox() {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.style.display = 'none';
                }, 300);
                document.body.style.overflow = 'auto';
                
                // Devolver foco para a imagem original
                galleryImages[currentImageIndex].focus();
            }
            
            lightboxClose.addEventListener('click', closeLightbox);
            
            // Fechar lightbox ao clicar fora da imagem
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            // Navegação do lightbox
            const lightboxPrev = document.querySelector('.lightbox-prev');
            const lightboxNext = document.querySelector('.lightbox-next');
            
            if (lightboxPrev && lightboxNext) {
                lightboxPrev.addEventListener('click', function() {
                    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                    updateLightboxContent();
                });
                
                lightboxNext.addEventListener('click', function() {
                    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                    updateLightboxContent();
                });
                
                // Suporte a navegação por teclado
                lightboxPrev.setAttribute('aria-label', 'Imagem anterior');
                lightboxNext.setAttribute('aria-label', 'Próxima imagem');
                
                lightboxPrev.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
                
                lightboxNext.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            }
            
            // Navegação com teclado
            document.addEventListener('keydown', function(e) {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') {
                        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                        updateLightboxContent();
                    } else if (e.key === 'ArrowRight') {
                        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                        updateLightboxContent();
                    } else if (e.key === 'Escape') {
                        closeLightbox();
                    }
                }
            });
            
            // Suporte a gestos touch
            lightbox.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            lightbox.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleGesture();
            });
            
            function handleGesture() {
                if (touchEndX < touchStartX - 50) {
                    // Swipe para esquerda - próxima imagem
                    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                    updateLightboxContent();
                } else if (touchEndX > touchStartX + 50) {
                    // Swipe para direita - imagem anterior
                    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                    updateLightboxContent();
                }
            }
            
            // Adicionar zoom nas imagens
            let scale = 1;
            let panning = false;
            let pointX = 0;
            let pointY = 0;
            let start = { x: 0, y: 0 };
            
            function setTransform() {
                lightboxImage.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
            }
            
            lightboxImage.addEventListener('mousedown', function(e) {
                e.preventDefault();
                if (scale > 1) {
                    panning = true;
                    start = { x: e.clientX - pointX, y: e.clientY - pointY };
                }
            });
            
            lightboxImage.addEventListener('mouseup', function(e) {
                panning = false;
            });
            
            lightboxImage.addEventListener('mousemove', function(e) {
                e.preventDefault();
                if (panning && scale > 1) {
                    pointX = e.clientX - start.x;
                    pointY = e.clientY - start.y;
                    setTransform();
                }
            });
            
            lightboxImage.addEventListener('dblclick', function(e) {
                e.preventDefault();
                if (scale === 1) {
                    const x = e.clientX - lightboxImage.getBoundingClientRect().left;
                    const y = e.clientY - lightboxImage.getBoundingClientRect().top;
                    pointX = 0;
                    pointY = 0;
                    scale = 2;
                } else {
                    scale = 1;
                    pointX = 0;
                    pointY = 0;
                }
                setTransform();
            });
            
            lightboxImage.addEventListener('wheel', function(e) {
                e.preventDefault();
                const xs = (e.clientX - lightboxImage.getBoundingClientRect().left) / scale;
                const ys = (e.clientY - lightboxImage.getBoundingClientRect().top) / scale;
                
                // Direção do zoom
                const delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
                
                // Limitar o zoom
                if (delta > 0) {
                    scale *= 1.2;
                    if (scale > 4) scale = 4;
                } else {
                    scale /= 1.2;
                    if (scale < 1) {
                        scale = 1;
                        pointX = 0;
                        pointY = 0;
                    }
                }
                
                if (scale > 1) {
                    pointX = e.clientX - xs * scale;
                    pointY = e.clientY - ys * scale;
                }
                
                setTransform();
            });
        },

        // Animações de scroll
        setupScrollAnimations: function() {
            const animateElements = document.querySelectorAll('.animate-on-scroll, .section-title, .room-card, .service-item, .gallery-item');
            
            if (animateElements.length === 0) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        
                        // Adicionar delay para elementos em sequência
                        if (entry.target.classList.contains('room-card') || 
                            entry.target.classList.contains('service-item') || 
                            entry.target.classList.contains('gallery-item')) {
                            
                            const siblings = Array.from(entry.target.parentElement.children);
                            const index = siblings.indexOf(entry.target);
                            entry.target.style.animationDelay = `${index * 0.15}s`;
                        }
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            
            animateElements.forEach(element => {
                observer.observe(element);
            });
        },

        // Header fixo com efeito ao rolar
        setupHeaderScroll: function() {
            const header = document.querySelector('header');
            if (!header) return;
            
            let lastScrollTop = 0;
            const scrollThreshold = 50;
            
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > scrollThreshold) {
                    header.classList.add('scrolled');
                    
                    // Efeito de esconder/mostrar ao rolar
                    if (scrollTop > lastScrollTop && scrollTop > 200) {
                        // Rolando para baixo
                        header.classList.add('header-hidden');
                    } else {
                        // Rolando para cima
                        header.classList.remove('header-hidden');
                    }
                } else {
                    header.classList.remove('scrolled');
                    header.classList.remove('header-hidden');
                }
                
                lastScrollTop = scrollTop;
            });
        },

        // Efeito parallax
        setupParallaxEffect: function() {
            const hero = document.querySelector('.hero');
            const parallaxSections = document.querySelectorAll('.parallax-section');
            
            if (hero) {
                window.addEventListener('scroll', function() {
                    const scrollPosition = window.scrollY;
                    if (scrollPosition < window.innerHeight) {
                        requestAnimationFrame(() => {
                            hero.style.backgroundPositionY = `calc(50% + ${scrollPosition * 0.5}px)`;
                        });
                    }
                });
            }
            
            if (parallaxSections.length > 0) {
                window.addEventListener('scroll', function() {
                    const scrollY = window.scrollY;
                    
                    parallaxSections.forEach(section => {
                        const speed = section.getAttribute('data-speed') || 0.5;
                        const offset = section.offsetTop;
                        const height = section.offsetHeight;
                        
                        if (scrollY > offset - window.innerHeight && scrollY < offset + height) {
                            requestAnimationFrame(() => {
                                const yPos = (scrollY - offset) * speed;
                                section.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
                            });
                        }
                    });
                });
            }
        },

        // Efeito hover nos cards
        setupCardEffects: function() {
            const cards = document.querySelectorAll('.room-card, .service-item');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px)';
                    this.style.boxShadow = document.body.classList.contains('dark-theme') 
                        ? '0 15px 30px rgba(212, 175, 55, 0.15)'
                        : '0 15px 30px rgba(0, 0, 0, 0.15)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = document.body.classList.contains('dark-theme')
                        ? '0 2px 10px rgba(212, 175, 55, 0.15)'
                        : '0 2px 10px rgba(0, 0, 0, 0.1)';
                });
                
                // Suporte a navegação por teclado
                card.setAttribute('tabindex', '0');
                
                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        const link = this.querySelector('a');
                        if (link) link.click();
                    }
                });
            });
        },

        // Efeito de digitação no título do hero
        setupHeroTyping: function() {
            const heroTitle = document.querySelector('.hero h1');
            if (!heroTitle) return;
            
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.setAttribute('aria-label', text);
            
            function typeWriter(text, i, fnCallback) {
                if (i < text.length) {
                    heroTitle.innerHTML = text.substring(0, i+1) + '<span class="cursor">|</span>';
                    
                    // Velocidade de digitação variável para efeito mais natural
                    const delay = Math.random() * 50 + 80;
                    
                    setTimeout(function() {
                        typeWriter(text, i + 1, fnCallback);
                    }, delay);
                } else if (typeof fnCallback == 'function') {
                    setTimeout(fnCallback, 700);
                }
            }
            
            // Iniciar o efeito após o preloader
            setTimeout(() => {
                typeWriter(text, 0, function() {
                    heroTitle.innerHTML = text;
                    heroTitle.classList.add('typed');
                });
            }, 1500);
        },

        // Contadores animados
        setupCounters: function() {
            const counters = document.querySelectorAll('.counter');
            if (counters.length === 0) return;
            
            const observerOptions = {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            };
            
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
                        const increment = target / (duration / 16);
                        let current = 0;
                        
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.textContent = Math.ceil(current).toLocaleString();
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target.toLocaleString();
                            }
                        };
                        
                        counter.textContent = '0';
                        requestAnimationFrame(updateCounter);
                        counterObserver.unobserve(counter);
                    }
                });
            }, observerOptions);
            
            counters.forEach(counter => {
                counterObserver.observe(counter);
            });
        },

        // Efeitos para botões
        setupButtonEffects: function() {
            const goldButtons = document.querySelectorAll('.btn');
            
            goldButtons.forEach(button => {
                // Efeito de gradiente ao passar o mouse
                button.addEventListener('mousemove', function(e) {
                    if (this.classList.contains('btn-outline')) return;
                    
                    const rect = button.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    button.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(247, 211, 88, 0.5) 0%, rgba(212, 175, 55, 1) 50%)`;
                });
                
                button.addEventListener('mouseleave', function() {
                    if (this.classList.contains('btn-outline')) {
                        button.style.background = 'transparent';
                    } else {
                        button.style.background = 'var(--gold-accent)';
                    }
                });
                
                // Efeito de ripple ao clicar
                button.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    ripple.classList.add('ripple-effect');
                    
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.width = ripple.style.height = `${size}px`;
                    ripple.style.left = `${x}px`;
                    ripple.style.top = `${y}px`;
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
                
                // Suporte a navegação por teclado
                button.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        },

        // Efeitos de borda brilhante
        setupGlowEffects: function() {
            this.updateGlowEffects();
        },
        
        updateGlowEffects: function() {
            if (document.body.classList.contains('dark-theme')) {
                document.querySelectorAll('.room-card, .service-item, .gallery-item, .contact-info, .contact-form, .booking-form').forEach(el => {
                    el.classList.add('gold-border-glow');
                });
            } else {
                document.querySelectorAll('.gold-border-glow').forEach(el => {
                    el.classList.remove('gold-border-glow');
                });
            }
        },

        // Efeitos para ícones
        setupIconEffects: function() {
            document.querySelectorAll('.feature-icon, .service-icon, .contact-icon').forEach(icon => {
                icon.addEventListener('mouseenter', function() {
                    this.classList.add('icon-pulse');
                });
                
                icon.addEventListener('mouseleave', function() {
                    this.classList.remove('icon-pulse');
                });
                
                // Suporte a navegação por teclado
                icon.setAttribute('tabindex', '0');
                
                icon.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.classList.add('icon-pulse');
                        setTimeout(() => {
                            this.classList.remove('icon-pulse');
                        }, 1000);
                    }
                });
            });
        },

        // Lazy loading para imagens
        setupLazyLoading: function() {
            if ('loading' in HTMLImageElement.prototype) {
                // Navegador suporta lazy loading nativo
                document.querySelectorAll('img[data-src]').forEach(img => {
                    img.src = img.dataset.src;
                    img.setAttribute('loading', 'lazy');
                });
            } else {
                // Fallback para navegadores que não suportam lazy loading nativo
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.getAttribute('data-src');
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
            
            // Lazy loading para backgrounds
            const bgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const bg = element.getAttribute('data-bg');
                        if (bg) {
                            element.style.backgroundImage = `url(${bg})`;
                            element.removeAttribute('data-bg');
                            bgObserver.unobserve(element);
                        }
                    }
                });
            });
            
            document.querySelectorAll('[data-bg]').forEach(el => {
                bgObserver.observe(el);
            });
        },

        // Sistema de reservas simples
        setupBookingSystem: function() {
            const bookingForm = document.querySelector('.booking-form');
            
            if (!bookingForm) return;
            
            // Inicializar datepickers se existirem
            const checkInInput = bookingForm.querySelector('#check-in');
            const checkOutInput = bookingForm.querySelector('#check-out');
            
            if (checkInInput && checkOutInput) {
                // Definir data mínima como hoje
                const today = new Date().toISOString().split('T')[0];
                checkInInput.min = today;
                
                // Atualizar data mínima de checkout quando check-in mudar
                checkInInput.addEventListener('change', function() {
                    checkOutInput.min = this.value;
                    
                    // Se checkout for anterior ao check-in, atualizar
                    if (checkOutInput.value && checkOutInput.value < this.value) {
                        // Definir checkout para o dia seguinte ao check-in
                        const nextDay = new Date(this.value);
                        nextDay.setDate(nextDay.getDate() + 1);
                        checkOutInput.value = nextDay.toISOString().split('T')[0];
                    }
                });
            }
            
            // Validação e envio do formulário
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar formulário
                let isValid = true;
                const requiredFields = this.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('error');
                        isValid = false;
                        
                        // Adicionar mensagem de erro
                        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                            const errorMsg = document.createElement('div');
                            errorMsg.classList.add('error-message');
                            errorMsg.textContent = 'Este campo é obrigatório';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                    } else {
                        field.classList.remove('error');
                        if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                            field.nextElementSibling.remove();
                        }
                    }
                });
                
                // Validação específica para datas
                if (checkInInput && checkOutInput && checkInInput.value && checkOutInput.value) {
                    if (checkInInput.value >= checkOutInput.value) {
                        checkOutInput.classList.add('error');
                        isValid = false;
                        
                        if (!checkOutInput.nextElementSibling || !checkOutInput.nextElementSibling.classList.contains('error-message')) {
                            const errorMsg = document.createElement('div');
                            errorMsg.classList.add('error-message');
                            errorMsg.textContent = 'A data de saída deve ser posterior à data de entrada';
                            checkOutInput.parentNode.insertBefore(errorMsg, checkOutInput.nextSibling);
                        }
                    }
                }
                
                if (!isValid) return;
                
                // Efeito de carregamento no botão
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                submitButton.disabled = true;
                
                // Simulação de envio de reserva
                setTimeout(() => {
                    const bookingDetails = {
                        checkIn: this.querySelector('#check-in').value,
                        checkOut: this.querySelector('#check-out').value,
                        guests: this.querySelector('#guests').value,
                        roomType: this.querySelector('#room-type').value
                    };
                    
                    // Calcular número de diárias
                    const checkInDate = new Date(bookingDetails.checkIn);
                    const checkOutDate = new Date(bookingDetails.checkOut);
                    const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
                    
                    // Simular preço baseado no tipo de quarto
                    let pricePerNight = 0;
                    switch(bookingDetails.roomType) {
                        case 'standard':
                            pricePerNight = 250;
                            break;
                        case 'deluxe':
                            pricePerNight = 350;
                            break;
                        case 'suite':
                            pricePerNight = 500;
                            break;
                    }
                    
                    const totalPrice = pricePerNight * nights;
                    
                    const confirmationMessage = `
                        <div class="booking-confirmation">
                            <div class="confirmation-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h3>Reserva Pré-Confirmada</h3>
                            <div class="confirmation-details">
                                <p><strong>Check-in:</strong> ${new Date(bookingDetails.checkIn).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Check-out:</strong> ${new Date(bookingDetails.checkOut).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Hóspedes:</strong> ${bookingDetails.guests}</p>
                                <p><strong>Tipo de Quarto:</strong> ${bookingDetails.roomType.charAt(0).toUpperCase() + bookingDetails.roomType.slice(1)}</p>
                                <p><strong>Diárias:</strong> ${nights}</p>
                                <p><strong>Valor Total:</strong> R$ ${totalPrice.toLocaleString('pt-BR')}</p>
                            </div>
                            <p class="confirmation-message">Entraremos em contato em breve para confirmar sua reserva.</p>
                            <button class="btn new-booking">Fazer Nova Reserva</button>
                        </div>
                    `;
                    
                    bookingForm.innerHTML = confirmationMessage;
                    
                    // Botão para nova reserva
                    const newBookingBtn = bookingForm.querySelector('.new-booking');
                    if (newBookingBtn) {
                        newBookingBtn.addEventListener('click', function() {
                            location.reload();
                        });
                    }
                }, 1500);
            });
            
            // Remover mensagens de erro ao digitar
            bookingForm.querySelectorAll('input, select').forEach(field => {
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                    if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                        this.nextElementSibling.remove();
                    }
                });
            });
        },

        // Chatbot simples
        setupChatbot: function() {
            // Verificar se o chatbot já existe
            if (document.querySelector('.chatbot-icon')) return;
            
            // Criar ícone do chatbot
            const chatbotIcon = document.createElement('div');
            chatbotIcon.classList.add('chatbot-icon');
            chatbotIcon.innerHTML = '<i class="fas fa-comments"></i>';
            chatbotIcon.setAttribute('aria-label', 'Abrir chat de atendimento');
            chatbotIcon.setAttribute('role', 'button');
            chatbotIcon.setAttribute('tabindex', '0');
            document.body.appendChild(chatbotIcon);
            
            // Criar container do chatbot
            const chatbotContainer = document.createElement('div');
            chatbotContainer.classList.add('chatbot-container');
            chatbotContainer.innerHTML = `
                <div class="chatbot-header">
                    <h3>Assistente Virtual</h3>
                    <button class="chatbot-close" aria-label="Fechar chat"><i class="fas fa-times"></i></button>
                </div>
                <div class="chatbot-messages">
                    <div class="message bot">
                        Olá! Como posso ajudar você hoje?
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" placeholder="Digite sua mensagem..." aria-label="Digite sua mensagem">
                    <button aria-label="Enviar mensagem"><i class="fas fa-paper-plane"></i></button>
                </div>
            `;
            document.body.appendChild(chatbotContainer);
            
            // Funcionalidades do chatbot
            chatbotIcon.addEventListener('click', function() {
                chatbotContainer.classList.toggle('active');
                chatbotIcon.style.display = 'none';
                chatbotContainer.querySelector('input').focus();
            });
            
            // Suporte a navegação por teclado
            chatbotIcon.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            const closeBtn = chatbotContainer.querySelector('.chatbot-close');
            closeBtn.addEventListener('click', function() {
                chatbotContainer.classList.remove('active');
                chatbotIcon.style.display = 'flex';
            });
            
            const chatInput = chatbotContainer.querySelector('input');
            const sendBtn = chatbotContainer.querySelector('.chatbot-input button');
            const messagesContainer = chatbotContainer.querySelector('.chatbot-messages');
            
            function sendMessage() {
                const message = chatInput.value.trim();
                if (!message) return;
                
                // Adicionar mensagem do usuário
                messagesContainer.innerHTML += `
                    <div class="message user">
                        ${message}
                    </div>
                `;
                chatInput.value = '';
                
                // Rolar para a última mensagem
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Mostrar indicador de digitação
                messagesContainer.innerHTML += `
                    <div class="message bot typing">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                `;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Simular resposta do bot
                setTimeout(() => {
                    // Remover indicador de digitação
                    const typingIndicator = messagesContainer.querySelector('.typing');
                    if (typingIndicator) {
                        typingIndicator.remove();
                    }
                    
                    let response = "Obrigado pelo seu contato! Um de nossos atendentes entrará em contato em breve.";
                    
                    // Respostas simples baseadas em palavras-chave
                    const lowerMessage = message.toLowerCase();
                    
                    if (lowerMessage.includes('reserva') || lowerMessage.includes('quarto') || lowerMessage.includes('hospedagem')) {
                        response = "Para fazer uma reserva, você pode usar nosso formulário online ou ligar para (XX) XXXX-XXXX. Posso te ajudar com mais alguma informação?";
                    } else if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custo')) {
                        response = "Nossos preços variam de acordo com o tipo de quarto e temporada. Quartos standard a partir de R$250, deluxe a partir de R$350 e suítes a partir de R$500. Posso verificar disponibilidade para datas específicas.";
                    } else if (lowerMessage.includes('localização') || lowerMessage.includes('endereço') || lowerMessage.includes('onde fica')) {
                        response = "Estamos localizados na Av. Principal, 1000 - Centro. A 10 minutos do aeroporto e 5 minutos da praia. Posso enviar o link da localização se desejar.";
                    } else if (lowerMessage.includes('check-in') || lowerMessage.includes('check-out') || lowerMessage.includes('horário')) {
                        response = "Nosso check-in é a partir das 14h e o check-out até as 12h. Oferecemos early check-in e late check-out mediante disponibilidade e taxa adicional.";
                    } else if (lowerMessage.includes('café') || lowerMessage.includes('refeição') || lowerMessage.includes('restaurante')) {
                        response = "Oferecemos café da manhã incluso em todas as diárias, das 6h30 às 10h. Nosso restaurante funciona para almoço e jantar, com menu à la carte e serviço de quarto 24h.";
                    } else if (lowerMessage.includes('wifi') || lowerMessage.includes('internet')) {
                        response = "Oferecemos WiFi gratuito de alta velocidade em todas as áreas do hotel.";
                    } else if (lowerMessage.includes('piscina') || lowerMessage.includes('academia') || lowerMessage.includes('spa')) {
                        response = "Contamos com piscina aquecida, academia 24h e spa com diversos tratamentos. Todos os serviços podem ser agendados na recepção.";
                    } else if (lowerMessage.includes('cancelamento') || lowerMessage.includes('reembolso')) {
                        response = "Nossa política de cancelamento permite cancelamentos gratuitos até 48h antes do check-in. Após esse período, é cobrada uma diária como taxa de cancelamento.";
                    } else if (lowerMessage.includes('obrigado') || lowerMessage.includes('valeu') || lowerMessage.includes('agradeço')) {
                        response = "Estou à disposição! Se precisar de mais alguma informação, é só perguntar.";
                    } else if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
                        response = "Olá! Como posso ajudar você hoje? Estou aqui para fornecer informações sobre nosso hotel, reservas e serviços.";
                    }
                    
                    // Adicionar resposta do bot
                    messagesContainer.innerHTML += `
                        <div class="message bot">
                            ${response}
                        </div>
                    `;
                    
                    // Rolar para a última mensagem
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 1000);
            }
            
            sendBtn.addEventListener('click', sendMessage);
            
            chatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        },

        // Melhorias de acessibilidade
        setupAccessibility: function() {
            // Adicionar atributos ARIA aos elementos interativos
            document.querySelectorAll('button, a, [role="button"]').forEach(el => {
                if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
                    const text = el.textContent.trim();
                    if (text) {
                        el.setAttribute('aria-label', text);
                    }
                }
            });
            
            // Adicionar skip link para acessibilidade
            const skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.classList.add('skip-link');
            skipLink.textContent = 'Pular para o conteúdo principal';
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Garantir que o primeiro elemento de cada seção possa receber foco
            document.querySelectorAll('section').forEach(section => {
                if (!section.hasAttribute('tabindex')) {
                    section.setAttribute('tabindex', '-1');
                }
            });
            
            // Adicionar indicador de foco visível
            const style = document.createElement('style');
            style.textContent = `
                :focus {
                    outline: 2px solid var(--gold-accent) !important;
                    outline-offset: 2px !important;
                }
                
                .skip-link {
                    position: absolute;
                    top: -40px;
                    left: 0;
                    background: var(--gold-accent);
                    color: var(--dark-bg);
                    padding: 8px;
                    z-index: 100;
                    transition: top 0.3s;
                }
                
                .skip-link:focus {
                    top: 0;
                }
            `;
            document.head.appendChild(style);
        },

        // Otimizações para dispositivos móveis
        setupMobileOptimizations: function() {
            if (!this.settings.isMobile) return;
            
            // Reduzir animações em dispositivos móveis para melhor performance
            document.body.classList.add('reduce-motion');
            
            // Detectar conexão lenta
            if (navigator.connection && navigator.connection.effectiveType === 'slow-2g' || 
                navigator.connection.effectiveType === '2g') {
                document.body.classList.add('save-data');
                this.settings.animationsEnabled = false;
                
                // Notificar usuário
                const saveDataNotice = document.createElement('div');
                saveDataNotice.classList.add('save-data-notice');
                saveDataNotice.textContent = 'Modo de economia de dados ativado devido a conexão lenta';
                document.body.appendChild(saveDataNotice);
                
                setTimeout(() => {
                    saveDataNotice.style.opacity = '0';
                    setTimeout(() => {
                        saveDataNotice.remove();
                    }, 500);
                }, 3000);
            }
            
            // Otimizar touch para dispositivos móveis
            document.querySelectorAll('.btn, .room-card, .service-item, .gallery-item').forEach(el => {
                el.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                }, { passive: true });
                
                el.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                }, { passive: true });
            });
        }
    };

    // Inicializar o aplicativo
    HotelApp.init();
});

// Fun��o para configurar o lightbox da galeria
function setupLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (!galleryItems.length || !lightbox || !lightboxImg) return;
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt || ''
    }));
    
    // Fun��o para abrir o lightbox
    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[index].src;
        lightboxImg.alt = images[index].alt;
        
        if (lightboxCaption) {
            lightboxCaption.textContent = images[index].alt;
        }
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Fun��o para fechar o lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Adicionar eventos de clique �s imagens da galeria
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });
    
    // Evento para fechar o lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Eventos para navega��o do lightbox
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentIndex].src;
            lightboxImg.alt = images[currentIndex].alt;
            if (lightboxCaption) {
                lightboxCaption.textContent = images[currentIndex].alt;
            }
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImg.src = images[currentIndex].src;
            lightboxImg.alt = images[currentIndex].alt;
            if (lightboxCaption) {
                lightboxCaption.textContent = images[currentIndex].alt;
            }
        });
    }
    
    // Fechar lightbox ao clicar fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navega��o com teclado
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.alt = images[currentIndex].alt;
                if (lightboxCaption) {
                    lightboxCaption.textContent = images[currentIndex].alt;
                }
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.alt = images[currentIndex].alt;
                if (lightboxCaption) {
                    lightboxCaption.textContent = images[currentIndex].alt;
                }
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });
}

// Inicializar o lightbox quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupLightbox);

// Fun��o para adicionar classes de anima��o ao scroll
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.section-title, .room-card, .service-item, .gallery-item, .contact-info, .contact-form');
    
    if (!animateElements.length) return;
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    const observerOptions = {
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Inicializar anima��es de scroll
document.addEventListener('DOMContentLoaded', setupScrollAnimations);
