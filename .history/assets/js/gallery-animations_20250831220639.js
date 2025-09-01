// ===== GALERIA ANIMADA SIMPLIFICADA =====
// Versão robusta com fallbacks para garantir funcionamento

(function() {
    'use strict';
    
    console.log('🚀 Iniciando GalleryAnimations...');
    
    // Aguardar DOM estar pronto
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    // Carregar Anime.js
    function loadAnimeJS() {
        return new Promise((resolve, reject) => {
            if (typeof anime !== 'undefined') {
                console.log('✅ Anime.js já carregado');
                resolve();
                return;
            }
            
            console.log('📦 Carregando Anime.js...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
            script.onload = () => {
                console.log('✅ Anime.js carregado com sucesso!');
                resolve();
            };
            script.onerror = () => {
                console.warn('⚠️ Erro ao carregar Anime.js, usando fallbacks');
                reject();
            };
            document.head.appendChild(script);
        });
    }
    
    // Adicionar estilos CSS
    function addStyles() {
        const styles = `
        <style>
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
            cursor: pointer;
        }
        
        .gallery-item:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
        }
        
        .gallery-item img {
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .gallery-item:hover img {
            transform: scale(1.1);
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
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .gallery-expand-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .expanded-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        
        .gallery-expand-overlay.active .expanded-content {
            transform: scale(1);
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
        
        .gallery-grid {
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .gallery-grid.mosaic {
            grid-template-columns: repeat(3, 1fr) !important;
            grid-template-rows: repeat(3, 200px) !important;
        }
        
        .gallery-grid.expanded {
            grid-template-columns: repeat(auto-fit, 300px) !important;
            grid-template-rows: 300px !important;
        }
        
        @media (max-width: 768px) {
            .gallery-toggle-btn {
                margin: 10px 0;
                width: 100%;
            }
        }
        </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Classe principal da galeria
    class GalleryAnimations {
        constructor() {
            this.currentLayout = 'grid';
            this.isAnimating = false;
        }
        
        init() {
            console.log('🎨 Inicializando galeria...');
            
            // Adicionar estilos
            addStyles();
            
            // Configurar galeria
            this.setupGallery();
            this.setupEventListeners();
            
            console.log('✅ Galeria inicializada com sucesso!');
        }
        
        setupGallery() {
            const gallery = document.querySelector('.gallery-grid');
            if (!gallery) {
                console.error('❌ Galeria não encontrada!');
                return;
            }
            
            gallery.classList.add('animated-gallery');
        }
        
        setupEventListeners() {
            // Botão de alternar layout
            this.addToggleButton();
            
            // Event listeners para itens
            this.setupItemListeners();
        }
        
        addToggleButton() {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'gallery-toggle-btn';
            toggleBtn.innerHTML = '<i class="fas fa-th-large"></i> Alternar Layout';
            toggleBtn.addEventListener('click', () => this.toggleLayout());
            
            const gallerySection = document.querySelector('.gallery');
            if (gallerySection) {
                const header = gallerySection.querySelector('.section-header');
                if (header) {
                    header.appendChild(toggleBtn);
                    console.log('🔘 Botão de alternar layout adicionado');
                }
            }
        }
        
        setupItemListeners() {
            const items = document.querySelectorAll('.gallery-item');
            console.log(`📸 Encontrados ${items.length} itens da galeria`);
            
            items.forEach((item, index) => {
                item.addEventListener('click', () => this.expandItem(index));
            });
        }
        
        toggleLayout() {
            if (this.isAnimating) return;
            
            console.log('🔄 Alternando layout...');
            
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
            gallery.classList.remove('mosaic', 'expanded');
            
            this.animateItems(() => {
                this.isAnimating = false;
                console.log('✅ Layout grid aplicado');
            });
        }
        
        applyMosaicLayout() {
            this.isAnimating = true;
            this.currentLayout = 'mosaic';
            
            const gallery = document.querySelector('.gallery-grid');
            gallery.classList.remove('expanded');
            gallery.classList.add('mosaic');
            
            this.animateItems(() => {
                this.isAnimating = false;
                console.log('✅ Layout mosaico aplicado');
            });
        }
        
        applyExpandedLayout() {
            this.isAnimating = true;
            this.currentLayout = 'expanded';
            
            const gallery = document.querySelector('.gallery-grid');
            gallery.classList.remove('mosaic');
            gallery.classList.add('expanded');
            
            this.animateItems(() => {
                this.isAnimating = false;
                console.log('✅ Layout expandido aplicado');
            });
        }
        
        animateItems(callback) {
            const items = document.querySelectorAll('.gallery-item');
            
            if (typeof anime !== 'undefined') {
                anime({
                    targets: items,
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 800,
                    delay: anime.stagger(100),
                    easing: 'easeOutElastic(1, 0.5)',
                    complete: callback
                });
            } else {
                // Fallback com CSS
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                        item.style.opacity = '1';
                        item.style.translateY = '0';
                    }, index * 100);
                });
                setTimeout(callback, items.length * 100 + 300);
            }
        }
        
        expandItem(index) {
            const items = document.querySelectorAll('.gallery-item');
            const targetItem = items[index];
            
            if (!targetItem) return;
            
            const img = targetItem.querySelector('img');
            if (!img) return;
            
            this.showExpandedView(img.src, img.alt);
        }
        
        showExpandedView(src, alt) {
            // Remover overlay existente
            const existingOverlay = document.querySelector('.gallery-expand-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            // Criar novo overlay
            const overlay = document.createElement('div');
            overlay.className = 'gallery-expand-overlay';
            overlay.innerHTML = `
                <div class="expanded-content">
                    <img src="${src}" alt="${alt}">
                    <button class="close-expand">&times;</button>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Animar entrada
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
            
            // Event listener para fechar
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay || e.target.classList.contains('close-expand')) {
                    overlay.classList.remove('active');
                    setTimeout(() => {
                        overlay.remove();
                    }, 300);
                }
            });
            
            // Fechar com ESC
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    overlay.classList.remove('active');
                    setTimeout(() => {
                        overlay.remove();
                    }, 300);
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        }
    }
    
    // Inicializar quando DOM estiver pronto
    ready(() => {
        loadAnimeJS()
            .then(() => {
                const gallery = new GalleryAnimations();
                gallery.init();
            })
            .catch(() => {
                // Fallback sem Anime.js
                const gallery = new GalleryAnimations();
                gallery.init();
            });
    });
    
})();
