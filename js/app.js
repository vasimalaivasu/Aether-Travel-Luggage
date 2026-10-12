/**
 * Aether Voyage - Master Application Coordinator & Utilities
 */

(function () {
    'use strict';

    const AetherApp = {
        init() {
            // Initialize Submodules in Dependency Order
            try {
                if (window.AetherTheme && window.AetherTheme.init) window.AetherTheme.init();
            } catch (e) { console.error('Theme init error:', e); }

            try {
                if (window.AetherRouter && window.AetherRouter.init) window.AetherRouter.init();
            } catch (e) { console.error('Router init error:', e); }

            try {
                if (window.AetherCart && window.AetherCart.init) window.AetherCart.init();
            } catch (e) { console.error('Cart init error:', e); }

            try {
                if (window.AetherCatalog && window.AetherCatalog.init) window.AetherCatalog.init();
            } catch (e) { console.error('Catalog init error:', e); }

            try {
                if (window.AetherWarranty && window.AetherWarranty.init) window.AetherWarranty.init();
            } catch (e) { console.error('Warranty init error:', e); }

            try {
                if (window.AetherAuth && window.AetherAuth.init) window.AetherAuth.init();
            } catch (e) { console.error('Auth init error:', e); }

            try {
                if (window.AetherCheckout && window.AetherCheckout.init) window.AetherCheckout.init();
            } catch (e) { console.error('Checkout init error:', e); }

            this.initBackToTop();
            this.initFloatingContact();
            this.initFooterDocking();
            this.initMobileMenu();
            this.initNavDropdowns();
            this.initBrandLogo();
            this.initBrandFiltering();
            this.checkPendingCheckoutAction();
        },

        checkPendingCheckoutAction() {
            const params = new URLSearchParams(window.location.search);
            if (params.get('action') === 'checkout') {
                setTimeout(() => {
                    if (window.AetherCheckout && window.AetherAuth && window.AetherAuth.currentUser) {
                        window.AetherCheckout.open();
                    } else if (window.AetherCart) {
                        window.AetherCart.openCartDrawer();
                    }
                    try {
                        const newUrl = window.location.pathname + window.location.hash;
                        window.history.replaceState({}, document.title, newUrl);
                    } catch(e) {}
                }, 400);
            }
        },

        initBrandFiltering() {
            const searchInput = document.getElementById('brandSearchInput');
            const filterPills = document.querySelectorAll('.brand-filter-pill');
            const brandCards = document.querySelectorAll('.brand-luxury-card');
            const resultCount = document.getElementById('brandResultCount');

            if (!filterPills.length && !searchInput) return;

            let activeCat = 'all';
            let searchQuery = '';

            const applyFilter = () => {
                let visibleCount = 0;
                brandCards.forEach(card => {
                    const cat = card.getAttribute('data-category') || '';
                    const text = card.textContent.toLowerCase();

                    const matchesCat = (activeCat === 'all' || cat === activeCat);
                    const matchesSearch = (!searchQuery || text.includes(searchQuery));

                    if (matchesCat && matchesSearch) {
                        card.style.display = 'flex';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (resultCount) {
                    resultCount.textContent = `${visibleCount} Brands Displayed`;
                }
            };

            filterPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    filterPills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    activeCat = pill.getAttribute('data-category') || 'all';
                    applyFilter();
                });
            });

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    searchQuery = e.target.value.trim().toLowerCase();
                    applyFilter();
                });
            }
        },

        showToast(message, type = 'info', duration = 3500) {
            const container = document.getElementById('toastContainer');
            if (!container) return;

            const iconMap = {
                success: 'fa-solid fa-circle-check',
                info: 'fa-solid fa-circle-info',
                warning: 'fa-solid fa-triangle-exclamation',
                error: 'fa-solid fa-circle-exclamation'
            };

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <i class="${iconMap[type] || iconMap.info}"></i>
                <span>${message}</span>
            `;

            container.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        },

        initBackToTop() {
            const btn = document.getElementById('backToTopBtn');
            if (!btn) return;

            const handleScroll = () => {
                if (btn.classList.contains('docked') || window.scrollY > 300) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        initFloatingContact() {
            const contactBtn = document.getElementById('floatingContactBtn');
            if (!contactBtn) return;

            contactBtn.addEventListener('click', (e) => {
                // Smooth redirection to contact.html
                window.location.href = 'contact.html';
            });
        },

        initFooterDocking() {
            const dock = document.getElementById('footerActionsDock');
            const contactBtn = document.getElementById('floatingContactBtn');
            const backToTopBtn = document.getElementById('backToTopBtn');
            if (!dock) return;

            const updateDockState = () => {
                const dockRect = dock.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;

                // When user reaches near the bottom of the page / footer dock is in viewport
                if (dockRect.top <= windowHeight - 15) {
                    if (contactBtn) contactBtn.classList.add('docked');
                    if (backToTopBtn) {
                        backToTopBtn.classList.add('docked');
                        backToTopBtn.classList.add('visible');
                    }
                    dock.classList.add('is-docked');
                } else {
                    if (contactBtn) contactBtn.classList.remove('docked');
                    if (backToTopBtn) {
                        backToTopBtn.classList.remove('docked');
                        if (window.scrollY <= 300) {
                            backToTopBtn.classList.remove('visible');
                        }
                    }
                    dock.classList.remove('is-docked');
                }
            };

            window.addEventListener('scroll', updateDockState, { passive: true });
            window.addEventListener('resize', updateDockState, { passive: true });
            setTimeout(updateDockState, 150);
        },

        initMobileMenu() {
            const toggle = document.getElementById('mobileMenuToggle');
            const menu = document.getElementById('mobileMenu');
            const close = document.getElementById('mobileMenuClose');

            if (toggle && menu) {
                toggle.addEventListener('click', () => {
                    menu.classList.add('open');
                    document.body.classList.add('no-scroll');
                });
            }

            if (close && menu) {
                close.addEventListener('click', () => {
                    menu.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                });
            }
        },

        initNavDropdowns() {
            document.querySelectorAll('.nav-item-dropdown').forEach(dropdown => {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.addEventListener('click', (e) => {
                        if (window.innerWidth <= 1024 || ('ontouchstart' in window)) {
                            e.preventDefault();
                            dropdown.classList.toggle('is-open');
                        }
                    });
                }
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-item-dropdown')) {
                    document.querySelectorAll('.nav-item-dropdown').forEach(d => d.classList.remove('is-open'));
                }
            });
        },

        initBrandLogo() {
            document.querySelectorAll('.brand-logo').forEach(logo => {
                logo.addEventListener('click', (e) => {
                    const mobileMenu = document.getElementById('mobileMenu');
                    if (mobileMenu && mobileMenu.classList.contains('open')) {
                        mobileMenu.classList.remove('open');
                        document.body.classList.remove('no-scroll');
                    }

                    const path = window.location.pathname.split('/').pop() || 'index.html';
                    if (path === '' || path === 'index.html') {
                        if (window.scrollY > 0) {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    } else {
                        window.location.href = 'index.html';
                    }
                });
            });
        },

        initCheckoutModal() {
            const modal = document.getElementById('checkoutModal');
            const closeBtn = document.getElementById('checkoutModalClose');
            const form = document.getElementById('checkoutForm');
            const receiptView = document.getElementById('checkoutReceiptView');
            const formView = document.getElementById('checkoutFormView');

            if (closeBtn && modal) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    if (receiptView) receiptView.style.display = 'none';
                    if (formView) formView.style.display = 'block';
                });
            }

            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                        if (receiptView) receiptView.style.display = 'none';
                        if (formView) formView.style.display = 'block';
                    }
                });
            }

            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const orderId = `VOY-${Math.floor(100000 + Math.random() * 900000)}`;
                    
                    if (formView) formView.style.display = 'none';
                    if (receiptView) {
                        receiptView.style.display = 'block';
                        const orderNumEl = document.getElementById('receiptOrderNumber');
                        if (orderNumEl) orderNumEl.textContent = orderId;
                    }

                    if (window.AetherCart) {
                        window.AetherCart.clearCart();
                    }

                    this.showToast(`Order ${orderId} confirmed with Express Delivery!`, 'success', 5000);
                });
            }
        }
    };

    window.AetherApp = AetherApp;

    document.addEventListener('DOMContentLoaded', () => {
        window.AetherApp.init();
    });
})();
