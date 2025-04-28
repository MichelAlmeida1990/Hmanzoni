/**
 * Hotel Manzoni - Script Principal
 * Versão: 1.1
 */

document.addEventListener('DOMContentLoaded', function() {
    // Objeto para armazenar todas as funções
    const HotelApp = {
        // Configurações
        settings: {
            animationsEnabled: true,
            darkThemeClass: 'dark-theme',
            dataTheme: localStorage.getItem('theme') || 'light',
            isMobile: window.innerWidth < 768,
            scrollOffset: 80,
            animationDelay: 100
        },

        // Inicialização
        init: function() {
            this.setupPreloader();
            this.setupThemeToggle();
            this.setupContactForm();
            this.setupBookingForm();
            this.setupSmoothScroll();
            this.setupMobileMenu();
            this.setupGallery();
            this.setupLightbox();
            this.setupScrollAnimations();
            this.setupHeaderScroll();
            this.setupBackToTop();
            this.setupChatbot();
            this.setupLazyLoading();
            this.setupNotifications();
            this.setupDatePickers();
            this.setupRoomSlider();
            this.setupTestimonialSlider();
            this.setupVideoModal();
            
            // Verificar se já deve iniciar com tema escuro
            if (this.settings.dataTheme === 'dark') {
                document.body.classList.add(this.settings.darkThemeClass);
                const themeButton = document.getElementById('theme-button');
                if (themeButton) themeButton.textContent = 'Tema Claro';
            }
            
            // Detectar mudanças na preferência de tema do sistema
            this.setupSystemThemeDetection();
            
            // Atualizar variável isMobile em resize
            window.addEventListener('resize', () => {
                this.settings.isMobile = window.innerWidth < 768;
            });
            
            console.log('Hotel Manzoni App inicializado com sucesso!');
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
                }, 1000);
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
                } else {
                    themeButton.textContent = 'Tema Escuro';
                    localStorage.setItem('theme', 'light');
                }
                
                // Disparar evento personalizado de mudança de tema
                document.dispatchEvent(new CustomEvent('themeChanged', {
                    detail: {
                        theme: document.body.classList.contains(this.settings.darkThemeClass) ? 'dark' : 'light'
                    }
                }));
            });
        },
        
        // Detectar tema do sistema
        setupSystemThemeDetection: function() {
            if (window.matchMedia) {
                const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                
                // Verificar tema inicial se não houver preferência salva
                if (!localStorage.getItem('theme')) {
                    if (darkModeMediaQuery.matches) {
                        document.body.classList.add(this.settings.darkThemeClass);
                        const themeButton = document.getElementById('theme-button');
                        if (themeButton) themeButton.textContent = 'Tema Claro';
                    }
                }
                
                // Ouvir mudanças na preferência do sistema
                darkModeMediaQuery.addEventListener('change', (e) => {
                    // Só aplicar se o usuário não tiver uma preferência salva
                    if (!localStorage.getItem('theme')) {
                        if (e.matches) {
                            document.body.classList.add(this.settings.darkThemeClass);
                            const themeButton = document.getElementById('theme-button');
                            if (themeButton) themeButton.textContent = 'Tema Claro';
                        } else {
                            document.body.classList.remove(this.settings.darkThemeClass);
                            const themeButton = document.getElementById('theme-button');
                            if (themeButton) themeButton.textContent = 'Tema Escuro';
                        }
                    }
                });
            }
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
                    } else if (field.type === 'email' && field.required) {
                        // Validação simples de email
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(field.value.trim())) {
                            field.classList.add('error');
                            isValid = false;
                        } else {
                            field.classList.remove('error');
                        }
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (!isValid) {
                    // Mostrar notificação de erro
                    HotelApp.showNotification('Por favor, preencha todos os campos corretamente.', 'error');
                    return;
                }
                
                // Simulação de envio de formulário
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                
                setTimeout(() => {
                    HotelApp.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                    contactForm.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 1500);
            });
            
            // Validação em tempo real
            contactForm.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', function() {
                    if (this.required && !this.value.trim()) {
                        this.classList.add('error');
                    } else if (this.type === 'email' && this.required) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(this.value.trim())) {
                            this.classList.add('error');
                        } else {
                            this.classList.remove('error');
                        }
                    } else {
                        this.classList.remove('error');
                    }
                });
            });
        }
    };
});
// Formulário de reserva
setupBookingForm: function() {
    const bookingForm = document.querySelector('.booking-form');
    const bookingButtons = document.querySelectorAll('.booking-btn');
    const bookingFormContainer = document.querySelector('.booking-form-container');
    const bookingFormClose = document.querySelector('.booking-form-close');
    
    if (!bookingForm || !bookingFormContainer) return;
    
    // Abrir formulário de reserva
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            bookingFormContainer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impedir rolagem
            
            // Se o botão tem data-room, preencher o campo de quarto
            const roomType = this.getAttribute('data-room');
            if (roomType) {
                const roomSelect = bookingForm.querySelector('select[name="room"]');
                if (roomSelect) {
                    roomSelect.value = roomType;
                }
            }
        });
    });
    
    // Fechar formulário de reserva
    if (bookingFormClose) {
        bookingFormClose.addEventListener('click', function() {
            bookingFormContainer.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar rolagem
        });
    }
    
    // Fechar ao clicar fora do formulário
    bookingFormContainer.addEventListener('click', function(e) {
        if (e.target === bookingFormContainer) {
            bookingFormContainer.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar rolagem
        }
    });
    
    // Submissão do formulário
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário
        const formFields = this.querySelectorAll('input, select');
        let isValid = true;
        
        formFields.forEach(field => {
            if (field.required && !field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!isValid) {
            HotelApp.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Verificar datas (checkin deve ser antes do checkout)
        const checkinDate = new Date(this.querySelector('input[name="checkin"]').value);
        const checkoutDate = new Date(this.querySelector('input[name="checkout"]').value);
        
        if (checkinDate >= checkoutDate) {
            HotelApp.showNotification('A data de saída deve ser posterior à data de entrada.', 'error');
            return;
        }
        
        // Simulação de envio de reserva
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        
        setTimeout(() => {
            HotelApp.showNotification('Reserva solicitada com sucesso! Enviaremos a confirmação por e-mail.', 'success');
            bookingForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Fechar o formulário após envio
            setTimeout(() => {
                bookingFormContainer.classList.remove('active');
                document.body.style.overflow = ''; // Restaurar rolagem
            }, 1500);
        }, 2000);
    });
},

// Rolagem suave
setupSmoothScroll: function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Ignorar se for apenas "#"
            if (targetId === '#') return;
            
            e.preventDefault();
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
                    }
                }
                
                // Destacar a seção
                targetElement.classList.add('highlight-section');
                setTimeout(() => {
                    targetElement.classList.remove('highlight-section');
                }, 1000);
                
                // Rolar para o elemento
                window.scrollTo({
                    top: targetElement.offsetTop - HotelApp.settings.scrollOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
},

// Menu mobile
setupMobileMenu: function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (!mobileMenuToggle || !nav) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            this.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden'; // Impedir rolagem quando menu aberto
        } else {
            this.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = ''; // Restaurar rolagem
        }
    });
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = ''; // Restaurar rolagem
            }
        });
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            e.target !== mobileMenuToggle) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = ''; // Restaurar rolagem
        }
    });
    
    // Impedir que cliques dentro do nav fechem o menu
    nav.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}
// Galeria com filtro
setupGallery: function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    // Inicializar com animações
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Aplicar filtro com animação
            galleryItems.forEach((item, index) => {
                // Reset da animação
                item.style.opacity = '0';
                
                setTimeout(() => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        // Aplicar nova animação com delay
                        item.style.animationDelay = `${index * 0.1}s`;
                        item.style.opacity = '1';
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });


// Lightbox para galeria
setupLightbox: function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.gallery-lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    
    if (!lightbox || !lightboxImage || !lightboxClose) return;
    
    let currentIndex = 0;
    const images = [];
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            images.push({
                src: img.getAttribute('data-full') || img.src,
                alt: img.alt,
                caption: item.getAttribute('data-caption') || ''
            });
            
            item.addEventListener('click', function(e) {
                e.preventDefault();
                currentIndex = index;
                openLightbox();
            });
        }
    });
    
    function openLightbox() {
        lightboxImage.src = images[currentIndex].src;
        lightboxImage.alt = images[currentIndex].alt;
        
        // Atualizar legenda se existir
        if (lightboxCaption) {
            lightboxCaption.textContent = images[currentIndex].caption;
            lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
        }
        
        lightbox.style.display = 'flex';
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
        
        // Desabilitar rolagem do body
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            // Restaurar rolagem do body
            document.body.style.overflow = '';
        }, 300);
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    if (lightboxPrev && lightboxNext) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImage.src = images[currentIndex].src;
            lightboxImage.alt = images[currentIndex].alt;
            
            // Atualizar legenda se existir
            if (lightboxCaption) {
                lightboxCaption.textContent = images[currentIndex].caption;
                lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
            }
        });
        
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImage.src = images[currentIndex].src;
            lightboxImage.alt = images[currentIndex].alt;
            
            // Atualizar legenda se existir
            if (lightboxCaption) {
                lightboxCaption.textContent = images[currentIndex].caption;
                lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
            }
        });
    }
    
    // Fechar lightbox ao clicar fora da imagem
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navegação com teclado
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                lightboxImage.src = images[currentIndex].src;
                lightboxImage.alt = images[currentIndex].alt;
                
                // Atualizar legenda se existir
                if (lightboxCaption) {
                    lightboxCaption.textContent = images[currentIndex].caption;
                    lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
                }
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                lightboxImage.src = images[currentIndex].src;
                lightboxImage.alt = images[currentIndex].alt;
                
                // Atualizar legenda se existir
                if (lightboxCaption) {
                    lightboxCaption.textContent = images[currentIndex].caption;
                    lightboxCaption.style.display = images[currentIndex].caption ? 'block' : 'none';
                }
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });
    
    // Adicionar contador de imagens
    if (images.length > 1) {
        const counter = document.createElement('div');
        counter.className = 'lightbox-counter';
        lightbox.appendChild(counter);
        
        function updateCounter() {
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
        }
        
        // Atualizar contador ao navegar
        lightboxPrev.addEventListener('click', updateCounter);
        lightboxNext.addEventListener('click', updateCounter);
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                updateCounter();
            }
        });
        
        // Inicializar contador
        updateCounter();
    }
},

// Animações de scroll
setupScrollAnimations: function() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Adicionar delay progressivo para elementos da mesma seção
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * this.settings.animationDelay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        animateElements.forEach(element => {
            element.classList.add('animated');
        });
    }
}
