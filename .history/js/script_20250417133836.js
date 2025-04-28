document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.classList.add('hidden');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 2000);
    }
    
    // Botão para alternar tema
    const themeButton = document.getElementById('theme-button');
    
    themeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if(document.body.classList.contains('dark-theme')) {
            themeButton.textContent = 'Tema Claro';
            localStorage.setItem('theme', 'dark');
            
            // Adicionar efeito dourado brilhante aos elementos
            document.querySelectorAll('.section-title, .room-type, .service-icon, .footer-title').forEach(el => {
                el.classList.add('gold-text');
            });
            
            // Adicionar padrão hexagonal como background
            addHexagonPattern();
        } else {
            themeButton.textContent = 'Tema Escuro';
            localStorage.setItem('theme', 'light');
            
            // Remover efeito dourado
            document.querySelectorAll('.gold-text').forEach(el => {
                el.classList.remove('gold-text');
            });
            
            // Remover padrão hexagonal
            removeHexagonPattern();
        }
    });
    
    // Verificar tema salvo
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeButton.textContent = 'Tema Claro';
        
        // Adicionar efeito dourado brilhante aos elementos
        document.querySelectorAll('.section-title, .room-type, .service-icon, .footer-title').forEach(el => {
            el.classList.add('gold-text');
        });
        
        // Adicionar padrão hexagonal como background
        addHexagonPattern();
    }
    
    function addHexagonPattern() {
        const sections = document.querySelectorAll('section, .footer');
        sections.forEach(section => {
            if (!section.querySelector('.hexagon-pattern')) {
                const pattern = document.createElement('div');
                pattern.classList.add('hexagon-pattern');
                section.appendChild(pattern);
            }
        });
    }
    
    function removeHexagonPattern() {
        const patterns = document.querySelectorAll('.hexagon-pattern');
        patterns.forEach(pattern => {
            pattern.remove();
        });
    }
    
    // Formulário de contato
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Efeito de carregamento no botão
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            // Simulação de envio de formulário
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // Animação suave de rolagem para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adicionar efeito de destaque ao elemento alvo
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
            }
        });
    });
    
    // Menu mobile
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden'; // Impedir rolagem quando menu está aberto
            } else {
                this.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = ''; // Permitir rolagem novamente
            }
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }
    
    // Galeria de imagens com filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0) {
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
        });
    }
    
    // Lightbox para galeria
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const lightbox = document.querySelector('.gallery-lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (galleryImages.length > 0 && lightbox) {
        let currentImageIndex = 0;
        
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                currentImageIndex = index;
                lightboxImage.src = this.src;
                lightboxImage.alt = this.alt;
                lightbox.style.display = 'flex';
                setTimeout(() => {
                    lightbox.style.opacity = '1';
                }, 50);
                document.body.style.overflow = 'hidden';
            });
        });
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.style.display = 'none';
                }, 300);
                document.body.style.overflow = 'auto';
            });
        }
        
        // Fechar lightbox ao clicar fora da imagem
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.style.display = 'none';
                }, 300);
                document.body.style.overflow = 'auto';
            }
        });
        
        // Navegação do lightbox
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        
        if (lightboxPrev && lightboxNext) {
            lightboxPrev.addEventListener('click', function() {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                updateLightboxImage();
            });
            
            lightboxNext.addEventListener('click', function() {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                updateLightboxImage();
            });
            
            // Navegação com teclado
            document.addEventListener('keydown', function(e) {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') {
                        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                        updateLightboxImage();
                    } else if (e.key === 'ArrowRight') {
                        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                        updateLightboxImage();
                    } else if (e.key === 'Escape') {
                        lightbox.style.opacity = '0';
                        setTimeout(() => {
                            lightbox.style.display = 'none';
                        }, 300);
                        document.body.style.overflow = 'auto';
                    }
                }
            });
            
            function updateLightboxImage() {
                lightboxImage.style.opacity = '0';
                setTimeout(() => {
                    lightboxImage.src = galleryImages[currentImageIndex].src;
                    lightboxImage.alt = galleryImages[currentImageIndex].alt;
                    lightboxImage.style.opacity = '1';
                }, 300);
            }
        }
    }
    
    // Animações de scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll, .section-title, .room-card, .service-item, .gallery-item');
    
    function checkScroll() {
        const triggerBottom = window.
