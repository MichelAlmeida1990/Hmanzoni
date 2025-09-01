// ===== GALERIA ANIMADA - TÉCNICA "TRANSFORMANDO UM EM NOVE" =====
// Baseado em Anime.js para criar efeitos de transformação elegantes

class GalleryAnimations {
    constructor() {
        this.isAnimating = false;
        this.currentLayout = 'grid'; // grid, expanded, mosaic
        this.init();
    }

    init() {
        // Carregar Anime.js se não estiver carregado
        this.loadAnimeJS();
        
        // Inicializar após o carregamento
        setTimeout(() => {
            this.setupGallery();
            this.setupEventListeners();
        }, 100);
    }

    loadAnimeJS() {
        if (typeof anime === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
            script.onload = () => {
                console.log('Anime.js carregado com sucesso!');
            };
            document.head.appendChild(script);
        }
    }

    setupGallery() {
        const gallery = document.querySelector('.gallery-grid');
        if (!gallery) return;

        // Adicionar classes para animação
        gallery.classList.add('animated-gallery');
        
        // Configurar layout inicial
        this.applyGridLayout();
    }

    setupEventListeners() {
        // Botão para alternar layouts
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'gallery-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-th-large"></i> Alternar Layout';
        toggleBtn.addEventListener('click', () => this.toggleLayout());

        const gallerySection = document.querySelector('.gallery');
        if (gallerySection) {
            const header = gallerySection.querySelector('.section-header');
            if (header) {
                header.appendChild(toggleBtn);
            }
        }

        // Event listeners para os itens da galeria
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.expandItem(index));
            item.addEventListener('mouseenter', () => this.hoverEffect(item));
            item.addEventListener('mouseleave', () => this.resetHover(item));
        });
    }

    toggleLayout() {
        if (this.isAnimating) return;

        switch (this.currentLayout) {
            case 'grid':
                this.applyMosaicLayout();
                break;
            case 'mosaic':
                this.applyExpandedLayout();
                break;
            case 'expanded':
                this.applyGridLayout();
                break;
        }
    }

    applyGridLayout() {
        this.isAnimating = true;
        this.currentLayout = 'grid';

        const gallery = document.querySelector('.gallery-grid');
        const items = gallery.querySelectorAll('.gallery-item');

        // Reset para grid padrão
        gallery.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        gallery.style.gridTemplateRows = 'auto';

        anime({
            targets: items,
            scale: [0.8, 1],
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutElastic(1, 0.5)',
            complete: () => {
                this.isAnimating = false;
            }
        });

        items.forEach(item => {
            item.style.gridColumn = 'auto';
            item.style.gridRow = 'auto';
        });
    }

    applyMosaicLayout() {
        this.isAnimating = true;
        this.currentLayout = 'mosaic';

        const gallery = document.querySelector('.gallery-grid');
        const items = Array.from(gallery.querySelectorAll('.gallery-item'));

        // Layout mosaico: 3x3 grid com diferentes tamanhos
        gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gallery.style.gridTemplateRows = 'repeat(3, 200px)';

        const mosaicPositions = [
            { col: '1 / 3', row: '1 / 3' }, // Grande no topo esquerdo
            { col: '3 / 4', row: '1 / 2' }, // Pequeno no topo direito
            { col: '3 / 4', row: '2 / 3' }, // Pequeno no meio direito
            { col: '1 / 2', row: '3 / 4' }, // Pequeno no baixo esquerdo
            { col: '2 / 4', row: '3 / 4' }, // Médio no baixo
        ];

        anime({
            targets: items,
            scale: [1, 1.1],
            duration: 600,
            delay: anime.stagger(50),
            easing: 'easeOutQuart',
            complete: () => {
                this.isAnimating = false;
            }
        });

        items.forEach((item, index) => {
            if (mosaicPositions[index]) {
                item.style.gridColumn = mosaicPositions[index].col;
                item.style.gridRow = mosaicPositions[index].row;
            }
        });
    }

    applyExpandedLayout() {
        this.isAnimating = true;
        this.currentLayout = 'expanded';

        const gallery = document.querySelector('.gallery-grid');
        const items = gallery.querySelectorAll('.gallery-item');

        // Layout expandido: uma linha com todas as imagens
        gallery.style.gridTemplateColumns = 'repeat(auto-fit, 300px)';
        gallery.style.gridTemplateRows = '300px';

        anime({
            targets: items,
            scale: [1, 1.2],
            rotateY: [0, 360],
            duration: 1000,
            delay: anime.stagger(100),
            easing: 'easeInOutQuart',
            complete: () => {
                this.isAnimating = false;
            }
        });
    }

    expandItem(index) {
        if (this.isAnimating) return;

        const items = document.querySelectorAll('.gallery-item');
        const targetItem = items[index];

        // Criar overlay de expansão
        const overlay = document.createElement('div');
        overlay.className = 'gallery-expand-overlay';
        overlay.innerHTML = `
            <div class="expanded-content">
                <img src="${targetItem.querySelector('img').src}" alt="${targetItem.querySelector('img').alt}">
                <button class="close-expand">&times;</button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Animar entrada
        anime({
            targets: overlay,
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 400,
            easing: 'easeOutQuart'
        });

        // Event listener para fechar
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('close-expand')) {
                anime({
                    targets: overlay,
                    opacity: [1, 0],
                    scale: [1, 0.8],
                    duration: 300,
                    easing: 'easeInQuart',
                    complete: () => {
                        overlay.remove();
                    }
                });
            }
        });
    }

    hoverEffect(item) {
        if (this.isAnimating) return;

        anime({
            targets: item,
            scale: 1.05,
            rotateY: 5,
            duration: 300,
            easing: 'easeOutQuart'
        });

        // Efeito de brilho
        const glow = document.createElement('div');
        glow.className = 'item-glow';
        item.appendChild(glow);

        anime({
            targets: glow,
            opacity: [0, 0.3],
            scale: [0, 1],
            duration: 400,
            easing: 'easeOutQuart'
        });
    }

    resetHover(item) {
        anime({
            targets: item,
            scale: 1,
            rotateY: 0,
            duration: 300,
            easing: 'easeOutQuart'
        });

        const glow = item.querySelector('.item-glow');
        if (glow) {
            anime({
                targets: glow,
                opacity: [0.3, 0],
                scale: [1, 0],
                duration: 200,
                easing: 'easeInQuart',
                complete: () => {
                    glow.remove();
                }
            });
        }
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    new GalleryAnimations();
});

// ===== ESTILOS CSS DINÂMICOS =====
const galleryStyles = `
<style>
.animated-gallery {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-toggle-btn {
    background: linear-gradient(135deg, #d4af37, #b8941f);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 20px;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.gallery-toggle-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item img {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.item-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 12px;
}

.gallery-expand-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(10px);
}

.expanded-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
}

.expanded-content img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 15px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-expand {
    position: absolute;
    top: -50px;
    right: 0;
    background: #d4af37;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-expand:hover {
    background: #b8941f;
    transform: scale(1.1);
}

/* Animações responsivas */
@media (max-width: 768px) {
    .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
    }
    
    .gallery-toggle-btn {
        margin: 10px 0;
        width: 100%;
    }
}

/* Efeitos de partículas */
.gallery-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.1) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
}

.gallery-item:hover::before {
    transform: translateX(100%);
}
</style>
`;

// Injetar estilos
document.head.insertAdjacentHTML('beforeend', galleryStyles);
