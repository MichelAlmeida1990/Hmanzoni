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
                        if (link) link
