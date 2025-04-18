document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.classList.add('hidden');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
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
        } else {
            themeButton.textContent = 'Tema Escuro';
            localStorage.setItem('theme', 'light');
            
            // Remover efeito dourado
            document.querySelectorAll('.gold-text').forEach(el => {
                el.classList.remove('gold-text');
            });
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
    }
    
    // Formulário de contato
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de envio de formulário
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }
    
    // Animação suave de rolagem para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
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
            } else {
                this.innerHTML = '<i class="fas fa-bars"></i>';
            }
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
                    } else {
                        item.style.display = 'none';
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
                document.body.style.overflow = 'hidden';
            });
        });
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Navegação do lightbox
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        
        if (lightboxPrev && lightboxNext) {
            lightboxPrev.addEventListener('click', function() {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                lightboxImage.src = galleryImages[currentImageIndex].src;
                lightboxImage.alt = galleryImages[currentImageIndex].alt;
            });
            
            lightboxNext.addEventListener('click', function() {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                lightboxImage.src = galleryImages[currentImageIndex].src;
                lightboxImage.alt = galleryImages[currentImageIndex].alt;
            });
        }
    }
    
    // Animações de scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verificar elementos visíveis no carregamento inicial
    
    // Header fixo com efeito ao rolar
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
