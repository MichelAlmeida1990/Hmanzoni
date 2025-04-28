/**
 * Hotel Manzoni - Script Principal
 * Versão: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Remover o preloader após o carregamento da página
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

    // Funcionalidade do botão de menu mobile
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Funcionalidade de alternar tema
    const themeButton = document.getElementById('theme-button');
    
    if (themeButton) {
        themeButton.addEventListener('click', function() {
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

    // Configuração da galeria e lightbox
    setupGallery();
    
    // Configuração do chatbot
    setupChatbot();
    
    // Configuração do botão voltar ao topo
    setupBackToTop();
    
    // Validação de formulários
    setupForms();
});

// Configuração da galeria e lightbox
function setupGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.gallery-lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let currentIndex = 0;
    let filteredItems = [...galleryItems];
    
    // Filtrar itens da galeria
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Atualizar botão ativo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filtrar itens
                document.querySelectorAll('.gallery-item').forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Atualizar lista filtrada
                filteredItems = [...document.querySelectorAll('.gallery-item')].filter(item => {
                    return filter === 'all' || item.getAttribute('data-category') === filter;
                });
            });
        });
    }
    
    // Abrir lightbox ao clicar em um item da galeria
    if (galleryItems.length > 0 && lightbox && lightboxImage) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const imgAlt = this.querySelector('img').getAttribute('alt');
                
                lightboxImage.setAttribute('src', imgSrc);
                lightboxImage.setAttribute('alt', imgAlt);
                
                currentIndex = filteredItems.indexOf(this);
                
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Fechar lightbox
    if (lightboxClose && lightbox) {
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
        
        // Fechar ao clicar fora da imagem
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                lightbox.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Navegação no lightbox
    if (lightboxNext && lightboxPrev && lightboxImage) {
        lightboxNext.addEventListener('click', function() {
            if (filteredItems.length <= 1) return;
            
            currentIndex = (currentIndex + 1) % filteredItems.length;
            const nextItem = filteredItems[currentIndex].querySelector('img');
            
            lightboxImage.setAttribute('src', nextItem.getAttribute('src'));
            lightboxImage.setAttribute('alt', nextItem.getAttribute('alt'));
        });
        
        lightboxPrev.addEventListener('click', function() {
            if (filteredItems.length <= 1) return;
            
            currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
            const prevItem = filteredItems[currentIndex].querySelector('img');
            
            lightboxImage.setAttribute('src', prevItem.getAttribute('src'));
            lightboxImage.setAttribute('alt', prevItem.getAttribute('alt'));
        });
        
        // Navegação com teclado
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'ArrowRight') {
                lightboxNext.click();
            } else if (e.key === 'ArrowLeft') {
                lightboxPrev.click();
            } else if (e.key === 'Escape') {
                lightboxClose.click();
            }
        });
    }
}

// Configuração do chatbot
function setupChatbot() {
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSend = document.querySelector('.chatbot-send');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    
    // Abrir chatbot
    if (chatbotIcon && chatbotContainer) {
        chatbotIcon.addEventListener('click', function() {
            chatbotContainer.classList.add('active');
            chatbotContainer.setAttribute('aria-hidden', 'false');
            chatbotInput.focus();
        });
    }
    
    // Fechar chatbot
    if (chatbotClose && chatbotContainer) {
        chatbotClose.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
            chatbotContainer.setAttribute('aria-hidden', 'true');
        });
    }
    
    // Enviar mensagem
    if (chatbotSend && chatbotInput && chatbotMessages) {
        const sendMessage = function() {
            const message = chatbotInput.value.trim();
            
            if (message) {
                // Adicionar mensagem do usuário
                const userMessageElement = document.createElement('div');
                userMessageElement.className = 'message user';
                userMessageElement.textContent = message;
                chatbotMessages.appendChild(userMessageElement);
                
                // Limpar input
                chatbotInput.value = '';
                
                // Rolar para a última mensagem
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                
                // Simular resposta do bot
                setTimeout(function() {
                    const botResponse = getBotResponse(message);
                    
                    const botMessageElement = document.createElement('div');
                    botMessageElement.className = 'message bot';
                    botMessageElement.textContent = botResponse;
                    chatbotMessages.appendChild(botMessageElement);
                    
                    // Rolar para a última mensagem
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 1000);
            }
        };
        
        chatbotSend.addEventListener('click', sendMessage);
        
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Respostas simples do bot
    function getBotResponse(message) {
        const messageLower = message.toLowerCase();
        
        if (messageLower.includes('reserva') || messageLower.includes('quarto')) {
            return "Para fazer uma reserva, você pode entrar em contato pelo telefone (11) 5555-5555 ou preencher o formulário de contato. Em qual data você gostaria de se hospedar?";
        } else if (messageLower.includes('preço') || messageLower.includes('valor') || messageLower.includes('custo')) {
            return "Nossos preços variam de R$120 a R$150 por diária, dependendo do tipo de quarto. Para um orçamento específico, informe a data e o tipo de quarto desejado.";
        } else if (messageLower.includes('endereço') || messageLower.includes('localização') || messageLower.includes('onde fica')) {
            return "Estamos localizados na Av. Principal, 1000 - Centro, São Paulo, SP - CEP 01000-000.";
        } else if (messageLower.includes('check-in') || messageLower.includes('checkout') || messageLower.includes('horário')) {
            return "Nosso horário de check-in é a partir das 14h e o check-out até às 12h.";
        } else if (messageLower.includes('wifi') || messageLower.includes('internet')) {
            return "Sim, oferecemos Wi-Fi gratuito em todas as áreas do hotel.";
        } else if (messageLower.includes('obrigado') || messageLower.includes('valeu') || messageLower.includes('agradeço')) {
            return "Por nada! Estou aqui para ajudar. Tem mais alguma dúvida sobre o Hotel Manzoni?";
        } else if (messageLower.includes('oi') || messageLower.includes('olá') || messageLower.includes('bom dia') || messageLower.includes('boa tarde') || messageLower.includes('boa noite')) {
            return "Olá! Bem-vindo ao Hotel Manzoni. Como posso ajudar você hoje?";
        } else {
            return "Obrigado pelo seu contato! Para informações mais específicas, entre em contato pelo telefone (11) 5555-5555 ou preencha o formulário de contato. Posso ajudar com algo mais?";
        }
    }
}

// Configuração do botão voltar ao topo
function setupBackToTop() {
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

// Configuração e validação de formulários
function setupForms() {
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
