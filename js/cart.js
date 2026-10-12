/**
 * Aether Voyage - Luggage Cart & Wishlist Drawer Engine
 */

(function () {
    'use strict';

    const CART_KEY = 'aether_cart_items';
    const WISHLIST_KEY = 'aether_wishlist_items';
    const PROMO_KEY = 'aether_promo_code';

    const PROMOS = {
        'VOYAGE10': { discount: 0.10, label: '10% Member Discount' },
        'FIRSTCLASS': { discount: 0.20, label: '20% Welcome Discount' }
    };

    const FREE_SHIPPING_THRESHOLD = 500;

    const AetherCart = {
        cart: [],
        wishlist: [],
        appliedPromo: null,

        init() {
            this.loadState();
            this.bindEvents();
            this.updateUI();
        },

        loadState() {
            try {
                this.cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
            } catch (e) {
                this.cart = [];
            }

            try {
                this.wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
            } catch (e) {
                this.wishlist = [];
            }

            const savedPromo = localStorage.getItem(PROMO_KEY);
            if (savedPromo && PROMOS[savedPromo]) {
                this.appliedPromo = savedPromo;
            }
        },

        saveState() {
            localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlist));
            if (this.appliedPromo) {
                localStorage.setItem(PROMO_KEY, this.appliedPromo);
            } else {
                localStorage.removeItem(PROMO_KEY);
            }
        },

        // --- Cart Operations ---
        addToCart(productId, colorName = null, quantity = 1) {
            const product = (window.AETHER_PRODUCTS || []).find(p => p.id === productId);
            if (!product) return;

            const chosenColor = (product.colors && product.colors.length > 0)
                ? (colorName ? (product.colors.find(c => c.name === colorName) || product.colors[0]) : product.colors[0])
                : { name: product.brand || 'Luxury Edition', hex: '#d4af37', filterStyle: 'none' };

            const cartItemId = product.id;
            const existingItem = this.cart.find(item => item.cartItemId === cartItemId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.cart.push({
                    cartItemId,
                    productId: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    color: chosenColor.name,
                    colorHex: chosenColor.hex,
                    filterStyle: chosenColor.filterStyle,
                    image: product.baseImage,
                    category: product.category,
                    quantity: quantity
                });
            }

            this.saveState();
            this.updateUI();
            this.openCartDrawer();

            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast(`Added ${product.name} to your Luggage Cart`, 'success');
            }
        },

        addCustomItem(customData) {
            if (!customData) return;

            const cartItemId = 'bespoke-' + Date.now();
            this.cart.push({
                cartItemId: cartItemId,
                productId: customData.id || 'bespoke-luggage',
                name: customData.name || 'Bespoke Custom Luggage',
                brand: customData.brand || 'Aether Atelier',
                price: Number(customData.price) || 1450,
                color: customData.color || 'Titanium Silver',
                colorHex: customData.colorHex || '#c0c0c4',
                leather: customData.leather || 'Tuscan Tan Leather',
                hardware: customData.hardware || '24K Polished Gold',
                monogram: customData.monogram || 'AV',
                filterStyle: 'none',
                image: customData.image || 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80',
                category: customData.category || 'Bespoke Studio Piece',
                quantity: customData.quantity || 1,
                isBespoke: true,
                details: customData.details || ''
            });

            this.saveState();
            this.updateUI();
            this.openCartDrawer();

            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast(`Bespoke commission added to your Luggage Cart`, 'success');
            }
        },

        updateQuantity(cartItemId, delta) {
            const item = this.cart.find(i => i.cartItemId === cartItemId);
            if (!item) return;

            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeFromCart(cartItemId);
            } else {
                this.saveState();
                this.updateUI();
            }
        },

        removeFromCart(cartItemId) {
            this.cart = this.cart.filter(i => i.cartItemId !== cartItemId);
            this.saveState();
            this.updateUI();
            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast('Item removed from luggage cart', 'info');
            }
        },

        clearCart() {
            this.cart = [];
            this.saveState();
            this.updateUI();
        },

        // --- Wishlist Operations ---
        toggleWishlist(productId) {
            const product = (window.AETHER_PRODUCTS || []).find(p => p.id === productId);
            if (!product) return;

            const index = this.wishlist.findIndex(id => id === productId);
            if (index > -1) {
                this.wishlist.splice(index, 1);
                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast(`Removed ${product.name} from Wishlist`, 'info');
                }
            } else {
                this.wishlist.push(productId);
                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast(`Added ${product.name} to Wishlist`, 'success');
                }
            }

            this.saveState();
            this.updateUI();
            if (window.AetherCatalog && window.AetherCatalog.updateWishlistButtons) {
                window.AetherCatalog.updateWishlistButtons();
            }
        },

        isInWishlist(productId) {
            return this.wishlist.includes(productId);
        },

        moveAllWishlistToCart() {
            if (!this.wishlist || this.wishlist.length === 0) return;

            const count = this.wishlist.length;
            const itemsToMove = [...this.wishlist];

            itemsToMove.forEach(productId => {
                const product = (window.AETHER_PRODUCTS || []).find(p => p.id === productId);
                if (!product) return;

                const chosenColor = (product.colors && product.colors.length > 0)
                    ? product.colors[0]
                    : { name: product.brand || 'Luxury Edition', hex: '#d4af37', filterStyle: 'none' };

                const cartItemId = product.id;
                const existingItem = this.cart.find(item => item.cartItemId === cartItemId);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    this.cart.push({
                        cartItemId,
                        productId: product.id,
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        color: chosenColor.name,
                        colorHex: chosenColor.hex,
                        filterStyle: chosenColor.filterStyle,
                        image: product.baseImage,
                        category: product.category,
                        quantity: 1
                    });
                }
            });

            this.wishlist = [];
            this.saveState();
            this.updateUI();

            if (window.AetherCatalog && window.AetherCatalog.updateWishlistButtons) {
                window.AetherCatalog.updateWishlistButtons();
            }

            this.closeWishlistDrawer();
            this.openCartDrawer();

            if (window.AetherApp && window.AetherApp.showToast) {
                const msg = count === 1
                    ? 'Moved item to your Luggage Cart'
                    : `Moved all ${count} items to your Luggage Cart`;
                window.AetherApp.showToast(msg, 'success');
            }
        },

        // --- Promo Codes ---
        applyPromo(code) {
            const cleanCode = (code || '').trim().toUpperCase();
            if (PROMOS[cleanCode]) {
                this.appliedPromo = cleanCode;
                this.saveState();
                this.updateUI();
                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast(`Promo "${cleanCode}" applied: ${PROMOS[cleanCode].label}`, 'success');
                }
            } else {
                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast('Invalid promo code. Try VOYAGE10 or FIRSTCLASS', 'error');
                }
            }
        },

        removePromo() {
            this.appliedPromo = null;
            this.saveState();
            this.updateUI();
        },

        // --- Drawers Open/Close ---
        openCartDrawer() {
            this.closeWishlistDrawer();
            const drawer = document.getElementById('cartDrawer');
            const backdrop = document.getElementById('drawerBackdrop');
            if (drawer) drawer.classList.add('open');
            if (backdrop) backdrop.classList.add('active');
            document.body.classList.add('no-scroll');
        },

        closeCartDrawer() {
            const drawer = document.getElementById('cartDrawer');
            const backdrop = document.getElementById('drawerBackdrop');
            if (drawer) drawer.classList.remove('open');
            if (backdrop) backdrop.classList.remove('active');
            document.body.classList.remove('no-scroll');
        },

        openWishlistDrawer() {
            this.closeCartDrawer();
            const drawer = document.getElementById('wishlistDrawer');
            const backdrop = document.getElementById('drawerBackdrop');
            if (drawer) drawer.classList.add('open');
            if (backdrop) backdrop.classList.add('active');
            document.body.classList.add('no-scroll');
            this.renderWishlistItems();
        },


        closeWishlistDrawer() {
            const drawer = document.getElementById('wishlistDrawer');
            const backdrop = document.getElementById('drawerBackdrop');
            if (drawer) drawer.classList.remove('open');
            if (backdrop) backdrop.classList.remove('active');
            document.body.classList.remove('no-scroll');
        },

        // --- UI Updates & Calculations ---
        updateUI() {
            const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            const wishlistCount = this.wishlist.length;

            // Badges
            document.querySelectorAll('.cart-count-badge').forEach(badge => {
                badge.textContent = totalCount;
                badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
            });

            document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
                badge.textContent = wishlistCount;
                badge.style.display = wishlistCount > 0 ? 'inline-flex' : 'none';
            });

            this.renderCartItems();
            this.renderWishlistItems();
            this.renderTotals();
            this.renderShippingProgress();
        },

        renderCartItems() {
            const container = document.getElementById('cartItemsList');
            if (!container) return;

            if (this.cart.length === 0) {
                container.innerHTML = `
                    <div class="drawer-empty-state">
                        <i class="fa-solid fa-suitcase-rolling"></i>
                        <h4>Your Luggage Cart is Empty</h4>
                        <p>Explore our premium luggage and travel bags.</p>
                        <button class="btn btn-primary" onclick="window.AetherCart.closeCartDrawer(); window.AetherRouter.navigateTo('collections');">
                            Explore Collections
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = this.cart.map(item => {
                const itemPrice = window.AetherTheme ? window.AetherTheme.formatPrice(item.price * item.quantity) : `$${item.price * item.quantity}`;
                return `
                    <div class="cart-item-card" data-cart-id="${item.cartItemId}">
                        <div class="cart-item-img">
                            <img src="${item.image}" alt="${item.name}" style="filter: ${item.filterStyle || 'none'};" loading="lazy">
                        </div>
                        <div class="cart-item-details">
                            <div>
                                <span class="cart-item-brand">${item.brand}</span>
                                <h5 class="cart-item-title">${item.name}</h5>
                                <div class="cart-item-color-tag">
                                    <span class="cart-item-color-dot" style="background-color: ${item.colorHex};"></span>
                                    <span>${item.color}</span>
                                </div>
                                ${item.isBespoke ? `
                                    <div class="cart-bespoke-specs" style="font-size: 0.68rem; color: var(--color-gold); margin-top: 3px; display: flex; flex-wrap: wrap; gap: 4px;">
                                        <span style="background: rgba(197, 160, 89, 0.15); padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(197, 160, 89, 0.3);">Monogram: <strong>${item.monogram}</strong></span>
                                        <span style="background: rgba(197, 160, 89, 0.1); padding: 1px 6px; border-radius: 4px;">${item.leather}</span>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="cart-item-qty-row">
                                <button class="qty-btn" onclick="window.AetherCart.updateQuantity('${item.cartItemId}', -1)">-</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button class="qty-btn" onclick="window.AetherCart.updateQuantity('${item.cartItemId}', 1)">+</button>
                            </div>
                        </div>
                        <div class="cart-item-price-col">
                            <button class="cart-item-remove-btn" onclick="window.AetherCart.removeFromCart('${item.cartItemId}')" title="Remove">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                            <span class="cart-item-price">${itemPrice}</span>
                        </div>
                    </div>
                `;
            }).join('');
        },

        renderTotals() {
            const subtotalUSD = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            let discountUSD = 0;

            if (this.appliedPromo && PROMOS[this.appliedPromo]) {
                discountUSD = subtotalUSD * PROMOS[this.appliedPromo].discount;
            }

            const shippingUSD = (subtotalUSD >= FREE_SHIPPING_THRESHOLD || subtotalUSD === 0) ? 0 : 45;
            const finalUSD = Math.max(0, subtotalUSD - discountUSD + shippingUSD);

            const format = (amt) => window.AetherTheme ? window.AetherTheme.formatPrice(amt) : `$${amt}`;

            const subtotalEl = document.getElementById('cartSubtotal');
            const discountRow = document.getElementById('cartDiscountRow');
            const discountEl = document.getElementById('cartDiscount');
            const shippingEl = document.getElementById('cartShipping');
            const totalEl = document.getElementById('cartFinalTotal');
            const checkoutBtn = document.getElementById('checkoutBtn');

            if (subtotalEl) subtotalEl.textContent = format(subtotalUSD);
            
            if (discountRow && discountEl) {
                if (discountUSD > 0) {
                    discountRow.style.display = 'flex';
                    discountEl.textContent = `-${format(discountUSD)}`;
                } else {
                    discountRow.style.display = 'none';
                }
            }

            if (shippingEl) {
                shippingEl.textContent = shippingUSD === 0 ? 'FREE' : format(shippingUSD);
            }

            if (totalEl) totalEl.textContent = format(finalUSD);

            if (checkoutBtn) {
                checkoutBtn.disabled = this.cart.length === 0;
            }
        },

        renderShippingProgress() {
            const subtotalUSD = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalUSD);
            const pct = Math.min(100, (subtotalUSD / FREE_SHIPPING_THRESHOLD) * 100);

            const textEl = document.getElementById('shippingProgressText');
            const barEl = document.getElementById('shippingProgressBar');

            if (textEl) {
                if (subtotalUSD >= FREE_SHIPPING_THRESHOLD) {
                    textEl.innerHTML = '🎉 <strong>Complimentary Worldwide Express Shipping</strong> Unlocked!';
                } else {
                    const remFormatted = window.AetherTheme ? window.AetherTheme.formatPrice(remaining) : `$${remaining}`;
                    textEl.innerHTML = `Add <strong>${remFormatted}</strong> more for Complimentary Express Shipping`;
                }
            }

            if (barEl) {
                barEl.style.width = `${pct}%`;
            }
        },

        renderWishlistItems() {
            const container = document.getElementById('wishlistItemsList');
            if (!container) return;

            const drawer = document.getElementById('wishlistDrawer');
            let footer = document.getElementById('wishlistDrawerFooter');
            if (!footer && drawer) {
                footer = document.createElement('div');
                footer.className = 'drawer-footer';
                footer.id = 'wishlistDrawerFooter';
                drawer.appendChild(footer);
            }

            const products = (window.AETHER_PRODUCTS || []).filter(p => this.wishlist.includes(p.id));

            if (products.length === 0) {
                container.innerHTML = `
                    <div class="drawer-empty-state">
                        <i class="fa-regular fa-heart"></i>
                        <h4>Your Wishlist is Empty</h4>
                        <p>Save items you desire for your next trip.</p>
                        <button class="btn btn-primary" onclick="window.AetherCart.closeWishlistDrawer(); window.AetherRouter.navigateTo('collections');">
                            Explore Luggage
                        </button>
                    </div>
                `;
                if (footer) {
                    footer.style.display = 'none';
                    footer.innerHTML = '';
                }
                return;
            }

            container.innerHTML = products.map(p => {
                const price = window.AetherTheme ? window.AetherTheme.formatPrice(p.price) : `$${p.price}`;
                return `
                    <div class="cart-item-card" data-wishlist-id="${p.id}">
                        <div class="cart-item-img">
                            <img src="${p.baseImage}" alt="${p.name}" loading="lazy">
                        </div>
                        <div class="cart-item-details">
                            <div>
                                <span class="cart-item-brand">${p.brand}</span>
                                <h5 class="cart-item-title">${p.name}</h5>
                                <span class="cart-item-price">${price}</span>
                            </div>
                        </div>
                        <div class="cart-item-price-col">
                            <button class="cart-item-remove-btn" onclick="window.AetherCart.toggleWishlist('${p.id}')" title="Remove from Wishlist">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            if (footer) {
                footer.style.display = 'flex';
                const label = products.length === 1 ? 'Move to Cart' : `Move All to Cart (${products.length})`;
                footer.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                        <span>Wishlist Total</span>
                        <span style="font-weight: 700; color: var(--text-primary);">${products.length} ${products.length === 1 ? 'Piece' : 'Pieces'}</span>
                    </div>
                    <button class="checkout-btn" id="moveWishlistToCartBtn" onclick="window.AetherCart.moveAllWishlistToCart()">
                        <i class="fa-solid fa-bag-shopping"></i> ${label}
                    </button>
                `;
            }
        },

        proceedToCheckout() {
            if (this.cart.length === 0) {
                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast('Your Luggage Cart is empty', 'warning');
                }
                return;
            }

            this.closeCartDrawer();
            if (window.AetherCheckout) {
                window.AetherCheckout.open();
            } else {
                const checkoutModal = document.getElementById('checkoutModal');
                if (checkoutModal) checkoutModal.classList.add('active');
            }
        },

        bindEvents() {
            // Cart Triggers
            document.querySelectorAll('.cart-open-btn').forEach(btn => {
                btn.addEventListener('click', () => this.openCartDrawer());
            });

            const cartCloseBtn = document.getElementById('cartDrawerClose');
            if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => this.closeCartDrawer());

            // Wishlist Triggers
            document.querySelectorAll('.wishlist-open-btn').forEach(btn => {
                btn.addEventListener('click', () => this.openWishlistDrawer());
            });

            const wishlistCloseBtn = document.getElementById('wishlistDrawerClose');
            if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', () => this.closeWishlistDrawer());

            // Backdrop
            const backdrop = document.getElementById('drawerBackdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    this.closeCartDrawer();
                    this.closeWishlistDrawer();
                });
            }

            // Promo code form
            const promoBtn = document.getElementById('applyPromoBtn');
            const promoInput = document.getElementById('promoCodeInput');
            if (promoBtn && promoInput) {
                promoBtn.addEventListener('click', () => {
                    this.applyPromo(promoInput.value);
                    promoInput.value = '';
                });
                promoInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.applyPromo(promoInput.value);
                        promoInput.value = '';
                    }
                });
            }

            // Checkout trigger
            const checkoutBtn = document.getElementById('checkoutBtn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    this.proceedToCheckout();
                });
            }
        }
    };

    window.AetherCart = AetherCart;
})();
