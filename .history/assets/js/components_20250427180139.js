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
            debug: false,
            animationEnabled: true,
            cursorEnabled: window.innerWidth > 1024,
            chatbotApiEnabled: true,
            chatbotApiUrl: 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V3-0324',
            chatbotApiKey: 'hf_sua_chave_da_huggingface_aqui'
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
        
        // Métodos para cada funcionalidade virão aqui...
    };
    
    // Inicializar quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        HotelManzoni.init();
    });
})();
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
}

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
}

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
}

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
}

// Atualizar tema dos componentes
updateComponentsTheme: function(theme) {
    // Atualizar cursor personalizado
    const cursorElements = document.querySelectorAll('.custom-cursor, .cursor-dot, .cursor-ring');
    cursorElements.forEach(el => {
        el.setAttribute('data-theme', theme);
    });
    
    // Atualizar outros componentes conforme necessário
}
