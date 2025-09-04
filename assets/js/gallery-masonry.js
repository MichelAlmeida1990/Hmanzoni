/* ========================================
   GALERIA MASONRY - HOTEL MANZONI
   ======================================== */

(function() {
    'use strict';

    // =========== CONFIGURAÇÃO DA GALERIA ===========
    const GalleryMasonry = {
        // Configurações
        config: {
            animationDuration: 600,
            filterAnimationDuration: 400,
            lightboxAnimationDuration: 300,
            masonryGap: 24,
            masonryColumns: {
                desktop: 4,
                tablet: 3,
                mobile: 2,
                smallMobile: 1
            }
        },

        // Elementos DOM
        elements: {
            gallery: null,
            filterButtons: null,
            galleryItems: null,
            lightboxModal: null,
            lightboxImage: null,
            lightboxClose: null,
            lightboxPrev: null,
            lightboxNext: null
        },

        // Estado da galeria
        state: {
            currentFilter: 'all',
            currentImageIndex: 0,
            filteredImages: [],
            isLightboxOpen: false
        },

        // =========== INICIALIZAÇÃO ===========
        init: function() {
            console.log('Galeria Masonry inicializada');
            
            this.cacheElements();
            this.setupEventListeners();
            this.initializeMasonry();
            this.setupLazyLoading();
            this.setupIntersectionObserver();
        },

        // =========== CACHEAR ELEMENTOS ===========
        cacheElements: function() {
            this.elements.gallery = document.getElementById('masonryGallery');
            this.elements.filterButtons = document.querySelectorAll('.filter-btn');
            this.elements.galleryItems = document.querySelectorAll('.gallery-item');
            this.elements.lightboxModal = document.getElementById('lightboxModal');
            this.elements.lightboxImage = document.getElementById('lightboxImage');
            this.elements.lightboxClose = document.getElementById('lightboxClose');
            this.elements.lightboxPrev = document.getElementById('lightboxPrev');
            this.elements.lightboxNext = document.getElementById('lightboxNext');
        },

        // =========== CONFIGURAR EVENT LISTENERS ===========
        setupEventListeners: function() {
            // Filtros
            this.elements.filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.handleFilterClick(e);
                });
            });

            // Lightbox
            if (this.elements.lightboxClose) {
                this.elements.lightboxClose.addEventListener('click', () => {
                    this.closeLightbox();
                });
            }

            if (this.elements.lightboxPrev) {
                this.elements.lightboxPrev.addEventListener('click', () => {
                    this.showPreviousImage();
                });
            }

            if (this.elements.lightboxNext) {
                this.elements.lightboxNext.addEventListener('click', () => {
                    this.showNextImage();
                });
            }

            // Botões de zoom da galeria
            document.addEventListener('click', (e) => {
                if (e.target.closest('.gallery-zoom')) {
                    e.preventDefault();
                    const button = e.target.closest('.gallery-zoom');
                    const imageSrc = button.dataset.image;
                    this.openLightbox(imageSrc);
                }
            });

            // Fechar lightbox com ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.state.isLightboxOpen) {
                    this.closeLightbox();
                }
                
                if (e.key === 'ArrowLeft' && this.state.isLightboxOpen) {
                    this.showPreviousImage();
                }
                
                if (e.key === 'ArrowRight' && this.state.isLightboxOpen) {
                    this.showNextImage();
                }
            });

            // Fechar lightbox clicando fora
            if (this.elements.lightboxModal) {
                this.elements.lightboxModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.lightboxModal) {
                        this.closeLightbox();
                    }
                });
            }

            // Redimensionar da janela
            window.addEventListener('resize', () => {
                this.debounce(() => {
                    this.updateMasonryLayout();
                }, 300);
            });
        },

        // =========== INICIALIZAR MASONRY ===========
        initializeMasonry: function() {
            this.updateMasonryLayout();
            this.animateGalleryItems();
        },

        // =========== ATUALIZAR LAYOUT MASONRY ===========
        updateMasonryLayout: function() {
            const width = window.innerWidth;
            let columns = this.config.masonryColumns.desktop;

            if (width <= 480) {
                columns = this.config.masonryColumns.smallMobile;
            } else if (width <= 768) {
                columns = this.config.masonryColumns.mobile;
            } else if (width <= 1200) {
                columns = this.config.masonryColumns.tablet;
            }

            if (this.elements.gallery) {
                this.elements.gallery.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            }
        },

        // =========== ANIMAR ITENS DA GALERIA ===========
        animateGalleryItems: function() {
            this.elements.galleryItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('visible');
            });
        },

        // =========== HANDLER DE CLIQUE NO FILTRO ===========
        handleFilterClick: function(e) {
            const button = e.currentTarget;
            const filter = button.dataset.filter;

            // Atualizar botões ativos
            this.elements.filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            // Aplicar filtro
            this.applyFilter(filter);
        },

        // =========== APLICAR FILTRO ===========
        applyFilter: function(filter) {
            this.state.currentFilter = filter;
            
            this.elements.galleryItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    this.showGalleryItem(item);
                } else {
                    this.hideGalleryItem(item);
                }
            });

            // Atualizar layout após filtro
            setTimeout(() => {
                this.updateMasonryLayout();
            }, this.config.filterAnimationDuration);
        },

        // =========== MOSTRAR ITEM DA GALERIA ===========
        showGalleryItem: function(item) {
            item.classList.remove('hidden');
            item.classList.add('visible');
            item.style.display = 'block';
        },

        // =========== ESCONDER ITEM DA GALERIA ===========
        hideGalleryItem: function(item) {
            item.classList.remove('visible');
            item.classList.add('hidden');
            item.style.display = 'none';
        },

        // =========== ABRIR LIGHTBOX ===========
        openLightbox: function(imageSrc) {
            if (!this.elements.lightboxModal || !this.elements.lightboxImage) return;

            // Atualizar imagem
            this.elements.lightboxImage.src = imageSrc;
            this.elements.lightboxImage.alt = 'Imagem da galeria';

            // Atualizar estado
            this.state.isLightboxOpen = true;
            this.state.currentImageIndex = this.getImageIndex(imageSrc);

            // Mostrar modal
            this.elements.lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Animar entrada
            setTimeout(() => {
                this.elements.lightboxModal.style.opacity = '1';
            }, 10);

            console.log('Lightbox aberto:', imageSrc);
        },

        // =========== FECHAR LIGHTBOX ===========
        closeLightbox: function() {
            if (!this.elements.lightboxModal) return;

            // Animar saída
            this.elements.lightboxModal.style.opacity = '0';

            setTimeout(() => {
                this.elements.lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
                this.state.isLightboxOpen = false;
            }, this.config.lightboxAnimationDuration);

            console.log('Lightbox fechado');
        },

        // =========== MOSTRAR IMAGEM ANTERIOR ===========
        showPreviousImage: function() {
            const currentItems = this.getVisibleItems();
            if (currentItems.length === 0) return;

            let newIndex = this.state.currentImageIndex - 1;
            if (newIndex < 0) {
                newIndex = currentItems.length - 1;
            }

            const newImage = currentItems[newIndex];
            this.openLightbox(newImage.src);
        },

        // =========== MOSTRAR PRÓXIMA IMAGEM ===========
        showNextImage: function() {
            const currentItems = this.getVisibleItems();
            if (currentItems.length === 0) return;

            let newIndex = this.state.currentImageIndex + 1;
            if (newIndex >= currentItems.length) {
                newIndex = 0;
            }

            const newImage = currentItems[newIndex];
            this.openLightbox(newImage.src);
        },

        // =========== OBTER ÍNDICE DA IMAGEM ===========
        getImageIndex: function(imageSrc) {
            const currentItems = this.getVisibleItems();
            return currentItems.findIndex(item => item.src === imageSrc);
        },

        // =========== OBTER ITENS VISÍVEIS ===========
        getVisibleItems: function() {
            return Array.from(this.elements.galleryItems).filter(item => {
                return !item.classList.contains('hidden');
            });
        },

        // =========== LAZY LOADING ===========
        setupLazyLoading: function() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            this.loadImage(img);
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                });

                // Observar todas as imagens
                this.elements.galleryItems.forEach(item => {
                    const img = item.querySelector('img');
                    if (img) {
                        imageObserver.observe(img);
                    }
                });
            }
        },

        // =========== CARREGAR IMAGEM ===========
        loadImage: function(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('loading');
                img.classList.add('loaded');
                delete img.dataset.src;
            }
        },

        // =========== INTERSECTION OBSERVER ===========
        setupIntersectionObserver: function() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -100px 0px'
                });

                // Observar itens da galeria
                this.elements.galleryItems.forEach(item => {
                    observer.observe(item);
                });
            }
        },

        // =========== UTILITÁRIOS ===========
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // =========== DESTRUIR ===========
        destroy: function() {
            // Remover event listeners
            this.elements.filterButtons.forEach(btn => {
                btn.removeEventListener('click', this.handleFilterClick);
            });

            // Fechar lightbox se estiver aberto
            if (this.state.isLightboxOpen) {
                this.closeLightbox();
            }

            console.log('Galeria Masonry destruída');
        }
    };

    // =========== INICIALIZAR QUANDO DOM ESTIVER PRONTO ===========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            GalleryMasonry.init();
        });
    } else {
        GalleryMasonry.init();
    }

    // =========== EXPORTER PARA USO GLOBAL ===========
    window.GalleryMasonry = GalleryMasonry;

    // =========== RECARREGAR AO MUDAR ORIENTAÇÃO ===========
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            GalleryMasonry.updateMasonryLayout();
        }, 500);
    });

})();


