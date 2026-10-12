/**
 * Aether Voyage - Theme, Direction & Currency Engine
 */

(function () {
    'use strict';

    const THEME_KEY = 'aether_theme';
    const DIR_KEY = 'aether_dir';
    const CURRENCY_KEY = 'aether_currency';

    const EXCHANGE_RATES = {
        USD: { symbol: '$', rate: 1.0, prefix: true },
        EUR: { symbol: '€', rate: 0.92, prefix: false },
        GBP: { symbol: '£', rate: 0.79, prefix: true },
        JPY: { symbol: '¥', rate: 155.0, prefix: true },
        AED: { symbol: 'AED ', rate: 3.67, prefix: true }
    };

    const AetherTheme = {
        currentTheme: 'light',
        currentDir: 'ltr',
        currentCurrency: 'USD',

        init() {
            // Restore persisted settings immediately without flash (supports URL ?theme= for testing)
            const urlTheme = new URLSearchParams(window.location.search).get('theme');
            const savedTheme = urlTheme || localStorage.getItem(THEME_KEY) || 'light';
            const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
            const savedCurrency = localStorage.getItem(CURRENCY_KEY) || 'USD';

            this.setTheme(savedTheme, false, false);
            this.setDir(savedDir, false);
            this.setCurrency(savedCurrency, false);

            this.bindEvents();
        },

        setTheme(theme, save = true, animate = true) {
            this.currentTheme = theme;
            
            if (animate && document.body) {
                document.body.classList.add('theme-transitioning');
                setTimeout(() => {
                    if (document.body) document.body.classList.remove('theme-transitioning');
                }, 350);
            }

            document.documentElement.setAttribute('data-theme', theme);
            if (save) localStorage.setItem(THEME_KEY, theme);
            this.updateThemeIcons();
        },

        toggleTheme() {
            const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(nextTheme, true, true);
            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast(`Switched to ${nextTheme.toUpperCase()} mode`, 'info');
            }
        },

        updateThemeIcons() {
            const isDark = this.currentTheme === 'dark';
            const iconClass = isDark ? 'fa-sun' : 'fa-moon';
            const btns = [
                document.getElementById('themeToggle'),
                document.getElementById('themeToggleMobile')
            ];
            btns.forEach(btn => {
                if (btn) {
                    btn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
                    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
                    btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
                }
            });
        },

        rtlObserver: null,

        setDir(dir, save = true) {
            this.currentDir = dir;
            document.documentElement.setAttribute('dir', dir);
            document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
            if (save) localStorage.setItem(DIR_KEY, dir);
            this.updateDirButtons();

            if (dir === 'rtl') {
                this.applyRtlPunctuationProtection();
                this.startRtlObserver();
            } else {
                this.stopRtlObserver();
            }
        },

        applyRtlPunctuationProtection(root = document.body) {
            if (!root || this.currentDir !== 'rtl') return;
            const LRM = '\u200E';
            const selectors = 'p, h1, h2, h3, h4, h5, h6, li, span, label, td, th, dt, dd, blockquote, figcaption, .bento-card-text, .portal-subtitle, .section-subtitle, .hero-description, .product-card-desc, .footer-brand-desc, .toast-notification, .checkout-step-desc, .drawer-title, .modal-title';
            const elements = root.querySelectorAll(selectors);

            elements.forEach(el => {
                if (el.children.length === 0 && el.textContent) {
                    const val = el.textContent;
                    if (/[.!?:]\s*$/.test(val) && !val.endsWith(LRM)) {
                        el.textContent = val.replace(/([.!?:]\s*)$/, `$1${LRM}`);
                    }
                } else {
                    Array.from(el.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
                            const val = node.textContent;
                            if (/[.!?:]\s*$/.test(val) && !val.endsWith(LRM)) {
                                node.textContent = val.replace(/([.!?:]\s*)$/, `$1${LRM}`);
                            }
                        }
                    });
                }
            });
        },

        startRtlObserver() {
            if (this.rtlObserver || typeof MutationObserver === 'undefined' || !document.body) return;
            this.rtlObserver = new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.applyRtlPunctuationProtection(node);
                        }
                    });
                });
            });
            this.rtlObserver.observe(document.body, { childList: true, subtree: true });
        },

        stopRtlObserver() {
            if (this.rtlObserver) {
                this.rtlObserver.disconnect();
                this.rtlObserver = null;
            }
        },

        toggleDir() {
            const nextDir = this.currentDir === 'ltr' ? 'rtl' : 'ltr';
            this.setDir(nextDir);
            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast(`Layout switched to ${nextDir.toUpperCase()}`, 'info');
            }
        },

        updateDirButtons() {
            const isRtl = this.currentDir === 'rtl';
            const btns = [
                document.getElementById('dirToggle'),
                document.getElementById('dirToggleMobile')
            ];
            btns.forEach(btn => {
                if (btn) {
                    btn.innerHTML = `<span>${isRtl ? 'LTR' : 'RTL'}</span>`;
                    btn.setAttribute('aria-label', isRtl ? 'Switch to LTR' : 'Switch to RTL');
                    btn.title = isRtl ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left';
                }
            });
        },

        setCurrency(currency, save = true) {
            if (EXCHANGE_RATES[currency]) {
                this.currentCurrency = currency;
                if (save) localStorage.setItem(CURRENCY_KEY, currency);
                
                const selects = document.querySelectorAll('.currency-select');
                selects.forEach(sel => {
                    if (sel.value !== currency) sel.value = currency;
                });

                // Trigger re-render of catalog and cart if available
                if (window.AetherCatalog && window.AetherCatalog.render) {
                    window.AetherCatalog.render();
                }
                if (window.AetherCatalog && window.AetherCatalog.renderFeatured) {
                    window.AetherCatalog.renderFeatured();
                }
                if (window.AetherCart && window.AetherCart.updateUI) {
                    window.AetherCart.updateUI();
                }
            }
        },

        formatPrice(amountInUSD) {
            const conf = EXCHANGE_RATES[this.currentCurrency] || EXCHANGE_RATES.USD;
            const converted = amountInUSD * conf.rate;
            const formatted = Math.round(converted).toLocaleString();
            return conf.prefix ? `${conf.symbol}${formatted}` : `${formatted} ${conf.symbol}`;
        },

        bindEvents() {
            // Theme toggles
            const themeBtn = document.getElementById('themeToggle');
            if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

            const themeBtnMobile = document.getElementById('themeToggleMobile');
            if (themeBtnMobile) themeBtnMobile.addEventListener('click', () => this.toggleTheme());

            // Direction toggles
            const dirBtn = document.getElementById('dirToggle');
            if (dirBtn) dirBtn.addEventListener('click', () => this.toggleDir());

            const dirBtnMobile = document.getElementById('dirToggleMobile');
            if (dirBtnMobile) dirBtnMobile.addEventListener('click', () => this.toggleDir());

            // Currency selects
            document.querySelectorAll('.currency-select').forEach(sel => {
                sel.addEventListener('change', (e) => this.setCurrency(e.target.value));
            });
        }
    };

    window.AetherTheme = AetherTheme;
})();
