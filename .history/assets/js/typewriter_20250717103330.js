/* ===== TYPEWRITER EFFECT - HOTEL MANZONI ===== */

class TypewriterEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            speed: options.speed || 80,
            delay: options.delay || 1200,
            deleteSpeed: options.deleteSpeed || 40,
            loop: options.loop !== false,
            cursor: options.cursor || '|',
            ...options
        };
        this.texts = [];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }
    init() {
        // Coletar todos os textos dos elementos filhos
        const textElements = this.element.querySelectorAll('.typewriter-line');
        textElements.forEach(el => {
            this.texts.push(el.textContent);
            el.textContent = '';
        });
        // Iniciar a animação
        this.type();
    }
    type() {
        const currentText = this.texts[this.currentTextIndex];
        const textElement = this.element.querySelectorAll('.typewriter-line')[this.currentTextIndex];
        if (!this.isDeleting) {
            // Digitando
            textElement.textContent = currentText.substring(0, this.currentCharIndex) + this.options.cursor;
            this.currentCharIndex++;
            if (this.currentCharIndex <= currentText.length) {
                setTimeout(() => this.type(), this.options.speed);
            } else {
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.options.delay);
            }
        } else {
            // Apagando
            textElement.textContent = currentText.substring(0, this.currentCharIndex) + this.options.cursor;
            this.currentCharIndex--;
            if (this.currentCharIndex >= 0) {
                setTimeout(() => this.type(), this.options.deleteSpeed);
            } else {
                // Limpar texto
                textElement.textContent = '';
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 400);
            }
        }
    }
    
    finish() {
        // Remover cursor e finalizar
        const textElements = this.element.querySelectorAll('.typewriter-line');
        textElements.forEach((el, index) => {
            if (index < this.texts.length) {
                el.textContent = this.texts[index];
            }
        });
        
        // Adicionar classe para indicar que terminou
        this.element.classList.add('typewriter-finished');
        
        // Disparar evento customizado
        this.element.dispatchEvent(new CustomEvent('typewriterComplete'));
    }
}

// ===== INICIALIZAÇÃO AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', () => {
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    
    typewriterElements.forEach(element => {
        new TypewriterEffect(element, {
            speed: 80,
            delay: 800,
            cursor: '|',
            cursorSpeed: 500
        });
    });
});

// ===== EFEITO DE CURSOR PISCANTE =====
class BlinkingCursor {
    constructor(element) {
        this.element = element;
        this.cursor = null;
        this.init();
    }
    
    init() {
        this.cursor = document.createElement('span');
        this.cursor.className = 'blinking-cursor';
        this.cursor.textContent = '|';
        this.cursor.style.animation = 'blink 1s infinite';
        
        // Adicionar cursor ao final do texto
        this.element.appendChild(this.cursor);
    }
    
    hide() {
        if (this.cursor) {
            this.cursor.style.display = 'none';
        }
    }
    
    show() {
        if (this.cursor) {
            this.cursor.style.display = 'inline';
        }
    }
}

// ===== ANIMAÇÕES ADICIONAIS =====
class HeroAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Animar elementos quando entrarem na viewport
        this.observeElements();
        
        // Animar scroll suave
        this.initSmoothScroll();
        
        // Animar botões
        this.initButtonAnimations();
    }
    
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observar elementos que devem ser animados
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    initSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    initButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
            
            button.addEventListener('click', () => {
                // Efeito de ripple
                this.createRippleEffect(button, event);
            });
        });
    }
    
    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar animações do hero
    new HeroAnimations();
    
    // Adicionar classe para indicar que o JavaScript está carregado
    document.body.classList.add('js-loaded');
});

// ===== PERFORMANCE OPTIMIZATIONS =====
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Carregar animações em background quando o navegador estiver ocioso
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        typewriterElements.forEach(element => {
            if (!element.classList.contains('typewriter-initialized')) {
                element.classList.add('typewriter-initialized');
                new TypewriterEffect(element);
            }
        });
    });
} 