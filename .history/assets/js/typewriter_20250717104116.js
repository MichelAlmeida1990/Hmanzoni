/* ===== TYPEWRITER EFFECT - HOTEL MANZONI ===== */

class TypewriterEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            speed: options.speed || 80,
            cursor: options.cursor || '|',
            ...options
        };
        
        this.texts = [];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        
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
        if (this.currentTextIndex >= this.texts.length) {
            this.finish();
            return;
        }
        
        const currentText = this.texts[this.currentTextIndex];
        const textElement = this.element.querySelectorAll('.typewriter-line')[this.currentTextIndex];
        
        if (this.currentCharIndex <= currentText.length) {
            // Digitando
            textElement.textContent = currentText.substring(0, this.currentCharIndex) + this.options.cursor;
            this.currentCharIndex++;
            setTimeout(() => this.type(), this.options.speed);
        } else {
            // Próximo texto
            this.currentTextIndex++;
            this.currentCharIndex = 0;
            setTimeout(() => this.type(), 300);
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
    }
}

// ===== INICIALIZAÇÃO AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', () => {
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    
    typewriterElements.forEach(element => {
        new TypewriterEffect(element, {
            speed: 80,
            cursor: '|'
        });
    });
});

// ===== ANIMAÇÕES ADICIONAIS =====
class HeroAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Animar scroll suave
        this.initSmoothScroll();
        
        // Animar botões
        this.initButtonAnimations();
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
        });
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar animações do hero
    new HeroAnimations();
}); 