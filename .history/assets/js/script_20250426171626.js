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
