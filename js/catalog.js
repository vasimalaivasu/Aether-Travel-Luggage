/**
 * Aether Voyage - Collections Catalog Engine
 * Sleek, Luxury Luggage Masterpieces with Authentic High-Definition Photography
 */

(function () {
    'use strict';

    const AetherCatalog = {
        activeFilter: 'all',
        searchQuery: '',
        sortBy: 'featured',
        selectedProductForQuickView: null,

        init() {
            this.readQueryParams();
            this.bindControls();
            this.render();
            this.renderFeatured();
            this.renderBestSellers();
        },

        readQueryParams() {
            try {
                const params = new URLSearchParams(window.location.search);
                const brandParam = params.get('category') || params.get('brand') || params.get('filter');
                if (brandParam) {
                    this.setActiveFilter(brandParam, false);
                } else {
                    this.updateFilterUI();
                }
            } catch (e) {
                // Ignore query param error on restricted environments
            }
        },

        setActiveFilter(filterVal, shouldRender = true) {
            this.activeFilter = filterVal || 'all';
            this.updateFilterUI();
            if (shouldRender) {
                this.render();
            }
        },

        updateFilterUI() {
            const current = (this.activeFilter || 'all').toLowerCase();

            // 1. Sync Category Segmented Tabs
            document.querySelectorAll('.collection-tab-btn').forEach(tab => {
                const tabFilter = (tab.getAttribute('data-filter') || '').toLowerCase();
                const isTabActive = (tabFilter === current) || (current === 'all' && tabFilter === 'all');
                tab.classList.toggle('active', isTabActive);
                tab.setAttribute('aria-selected', isTabActive ? 'true' : 'false');
            });

            // 2. Sync Maison Quick Chips
            document.querySelectorAll('.maison-chip-btn').forEach(chip => {
                const chipFilter = (chip.getAttribute('data-filter') || '').toLowerCase();
                const isChipActive = (chipFilter === current);
                chip.classList.toggle('active', isChipActive);
            });

            // 3. Sync Maison Select Dropdown
            const maisonSelect = document.getElementById('maisonFilterSelect');
            if (maisonSelect) {
                let matched = false;
                Array.from(maisonSelect.options).forEach(opt => {
                    if (opt.value.toLowerCase() === current) {
                        maisonSelect.value = opt.value;
                        matched = true;
                    }
                });
                if (!matched) {
                    maisonSelect.value = 'all';
                }
            }

            // 4. Backwards compatibility for .filter-pill
            document.querySelectorAll('.filter-pill').forEach(pill => {
                const pFilter = (pill.getAttribute('data-filter') || '').toLowerCase();
                pill.classList.toggle('active', pFilter === current);
            });

            // 5. Active Filter Indicator Tag
            const tag = document.getElementById('activeFilterTag');
            const label = document.getElementById('activeFilterLabel');
            if (tag && label) {
                if (current !== 'all') {
                    tag.style.display = 'inline-flex';
                    // Human friendly label
                    const categoryNames = {
                        'suitcases': 'Hardcase Trunks',
                        'duffles': 'Duffels & Bags',
                        'backpacks': 'City Backpacks',
                        'accessories': 'Business & Tech'
                    };
                    label.textContent = categoryNames[current] || this.activeFilter;
                } else {
                    tag.style.display = 'none';
                }
            }
        },

        getFilteredProducts() {
            const products = window.AETHER_PRODUCTS || [];

            return products.filter(product => {
                // Category or Brand Filter
                let matchesFilter = true;
                if (this.activeFilter !== 'all') {
                    const filterLower = this.activeFilter.toLowerCase();
                    const brandLower = (product.brand || '').toLowerCase();
                    const categoryLower = (product.category || '').toLowerCase();
                    matchesFilter = brandLower === filterLower || categoryLower === filterLower ||
                                    brandLower.includes(filterLower) || categoryLower.includes(filterLower);
                }

                // Search Query Filter
                let matchesSearch = true;
                if (this.searchQuery.trim() !== '') {
                    const q = this.searchQuery.toLowerCase();
                    matchesSearch = (product.name || '').toLowerCase().includes(q) ||
                                    (product.brand || '').toLowerCase().includes(q) ||
                                    (product.description || '').toLowerCase().includes(q) ||
                                    (product.material || '').toLowerCase().includes(q);
                }

                return matchesFilter && matchesSearch;
            }).sort((a, b) => {
                switch (this.sortBy) {
                    case 'price-low':
                        return a.price - b.price;
                    case 'price-high':
                        return b.price - a.price;
                    case 'rating':
                        return b.rating - a.rating;
                    case 'newest':
                        return (b.badge === 'New' || b.badge === 'Trending') ? 1 : -1;
                    case 'featured':
                    default:
                        return a.id.localeCompare(b.id);
                }
            });
        },

        render() {
            const grid = document.getElementById('productsGrid');
            const countBadge = document.getElementById('catalogResultsCount');
            if (!grid) return;

            const filtered = this.getFilteredProducts();

            if (countBadge) {
                countBadge.textContent = `${filtered.length} products found`;
            }

            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div class="catalog-empty-state">
                        <i class="fa-solid fa-compass"></i>
                        <h3>No Luggage Matches Your Criteria</h3>
                        <p>Try adjusting your search terms, price limit, or selected brand filters.</p>
                        <button class="btn btn-primary" onclick="window.AetherCatalog.resetFilters();">
                            Reset All Filters
                        </button>
                    </div>
                `;
                return;
            }

            grid.innerHTML = filtered.map(product => this.createProductCardHTML(product)).join('');
            this.updateWishlistButtons();
        },

        renderFeatured() {
            const featuredGrid = document.getElementById('featuredProductsGrid');
            if (!featuredGrid) return;

            const products = (window.AETHER_PRODUCTS || []).slice(0, 3);
            featuredGrid.innerHTML = products.map(product => this.createProductCardHTML(product)).join('');
            this.updateWishlistButtons();
        },

        renderBestSellers() {
            const bestSellersGrid = document.getElementById('bestSellersGrid');
            if (!bestSellersGrid) return;

            const allProducts = window.AETHER_PRODUCTS || [];
            const priorityIds = ['prod-aether-horizon', 'prod-rimowa-classic', 'prod-cf-weekender', 'prod-tumi-19deg'];
            let products = priorityIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
            if (products.length < 4) {
                const extras = allProducts.filter(p => !products.some(sel => sel.id === p.id));
                products = products.concat(extras).slice(0, 4);
            }
            bestSellersGrid.innerHTML = products.map(product => this.createProductCardHTML(product)).join('');
            this.updateWishlistButtons();
        },

        createProductCardHTML(product) {
            const priceFormatted = window.AetherTheme ? window.AetherTheme.formatPrice(product.price) : `$${product.price}`;
            const origPriceFormatted = product.originalPrice 
                ? (window.AetherTheme ? window.AetherTheme.formatPrice(product.originalPrice) : `$${product.originalPrice}`)
                : null;

            const isWishlisted = window.AetherCart && window.AetherCart.isInWishlist(product.id);

            const badgeHTML = product.badge ? `
                <div class="product-badges">
                    <span class="product-badge badge-${product.badge.toLowerCase().replace(/[^a-z0-9]/g, '-')}">${product.badge}</span>
                </div>
            ` : '';

            const volumeStr = product.volume || '35 Liters';
            const weightStr = product.weight ? (product.weight.split('(')[0].trim()) : '3.2 kg';

            return `
                <article class="product-card" data-product-card-id="${product.id}">
                    ${badgeHTML}
                    <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                            onclick="window.AetherCart.toggleWishlist('${product.id}')"
                            aria-label="Save to Wishlist" 
                            title="Save to Wishlist">
                        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>

                    <div class="product-media" onclick="window.AetherCatalog.openQuickView('${product.id}')">
                        <div class="product-img-wrapper">
                            <img class="product-img" 
                                 id="product-img-${product.id}"
                                 src="${product.baseImage}" 
                                 alt="${product.name}" 
                                 loading="lazy">
                        </div>
                        <button class="product-quick-view-btn" type="button">
                            <i class="fa-regular fa-eye"></i> Quick View
                        </button>
                    </div>

                    <div class="product-content">
                        <div class="product-header-meta">
                            <span class="product-brand">${product.brand}</span>
                            <div class="product-rating">
                                <i class="fa-solid fa-star"></i>
                                <span>${(product.rating || 4.9).toFixed(1)}</span>
                                <span class="product-rating-count">(${product.reviewsCount || 100})</span>
                            </div>
                        </div>

                        <h3 class="product-title" onclick="window.AetherCatalog.openQuickView('${product.id}')">
                            ${product.name}
                        </h3>
                        <span class="product-series">${product.tagline || product.subCategory || ''}</span>

                        <div class="product-specs-snippet">
                            <span><i class="fa-solid fa-cube"></i> ${volumeStr}</span>
                            <span><i class="fa-solid fa-weight-hanging"></i> ${weightStr}</span>
                            <span><i class="fa-solid fa-shield-halved"></i> TSA Lock</span>
                        </div>

                        <div class="product-footer">
                            <div class="product-price-wrapper">
                                <span class="product-price">${priceFormatted}</span>
                                ${origPriceFormatted ? `<span class="product-orig-price">${origPriceFormatted}</span>` : ''}
                            </div>
                            <div class="product-cta-group">
                                <button class="product-enquire-btn" 
                                        type="button" 
                                        onclick="event.stopPropagation(); window.AetherCatalog.openEnquireModal('${product.id}')"
                                        title="Enquire with Luggage Concierge">
                                    <i class="fa-regular fa-comment-dots"></i> Enquire
                                </button>
                                <button class="product-add-cart-btn" 
                                        type="button" 
                                        onclick="event.stopPropagation(); window.AetherCatalog.handleAddToCart('${product.id}')"
                                        title="Order Luggage">
                                    <i class="fa-solid fa-boxes-packing"></i> Order
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        },

        handleAddToCart(productId) {
            if (window.AetherCart) {
                window.AetherCart.addToCart(productId, null, 1);
            }
        },

        updateWishlistButtons() {
            if (!window.AetherCart) return;
            // Update catalog product cards
            document.querySelectorAll('.product-card').forEach(card => {
                const id = card.getAttribute('data-product-card-id');
                const btn = card.querySelector('.product-wishlist-btn');
                const isWishlisted = window.AetherCart.isInWishlist(id);
                if (btn) {
                    btn.className = `product-wishlist-btn ${isWishlisted ? 'active' : ''}`;
                    btn.innerHTML = `<i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
                }
            });

            // Update Quick View modal floating wishlist button if open
            const qvBtn = document.getElementById('quickViewWishlistBtn');
            if (qvBtn && this.selectedProductForQuickView) {
                const isWishlisted = window.AetherCart.isInWishlist(this.selectedProductForQuickView.id);
                qvBtn.className = `quick-view-wishlist-btn ${isWishlisted ? 'active' : ''}`;
                qvBtn.setAttribute('title', isWishlisted ? 'Added to Wishlist (Click to remove)' : 'Add to Wishlist');
                qvBtn.setAttribute('aria-label', isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist');
                qvBtn.innerHTML = `
                    <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    <span class="quick-view-wishlist-tooltip">${isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                `;
            }
        },

        toggleQuickViewWishlist(productId, event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            if (window.AetherCart) {
                window.AetherCart.toggleWishlist(productId);
            }
            this.updateWishlistButtons();
        },

        // --- Quick View Modal ---
        openQuickView(productId) {
            const product = (window.AETHER_PRODUCTS || []).find(p => p.id === productId);
            if (!product) return;

            this.selectedProductForQuickView = product;
            const modal = document.getElementById('quickViewModal');
            const content = document.getElementById('quickViewContent');
            if (!modal || !content) return;

            const isWishlisted = window.AetherCart ? window.AetherCart.isInWishlist(product.id) : false;
            const priceFormatted = window.AetherTheme ? window.AetherTheme.formatPrice(product.price) : `$${product.price}`;

            const specList = Array.isArray(product.specs) ? product.specs : [
                "Lifetime Unconditional Repair Warranty",
                "Dual TSA-Integrated Lever Combination Locks",
                "Whisper-Quiet 360° Japanese Ball-Bearing Spinner Wheels",
                "Antimicrobial Recycled Interior Compression Lining"
            ];

            const featuresHTML = specList.map(f => `
                <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text-secondary);">
                    <i class="fa-solid fa-check" style="color: var(--color-gold);"></i> ${f}
                </li>
            `).join('');

            const materialClean = product.material ? product.material.split('with')[0].trim() : 'AeroShield™ Alloy';

            content.innerHTML = `
                <div class="quick-view-grid" data-modal-product-id="${product.id}">
                    <div class="quick-view-gallery">
                        <!-- Top-Right of Image Section -->
                        <button id="quickViewWishlistBtn" 
                                class="quick-view-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                                onclick="window.AetherCatalog.toggleQuickViewWishlist('${product.id}', event)"
                                title="${isWishlisted ? 'Added to Wishlist (Click to remove)' : 'Add to Wishlist'}"
                                aria-label="${isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}">
                            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                            <span class="quick-view-wishlist-tooltip">${isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                        </button>
                        <div class="quick-view-img-wrapper">
                            <img id="quickViewMainImg" 
                                 class="quick-view-img" 
                                 src="${product.baseImage}" 
                                 alt="${product.name}">
                        </div>
                    </div>

                    <div class="quick-view-info">
                        <div>
                            <span class="quick-view-brand">${product.brand}</span>
                            <h2 class="quick-view-title">${product.name}</h2>
                            <div class="quick-view-price-row" style="margin-top: 0.5rem;">
                                <span class="quick-view-price">${priceFormatted}</span>
                                <span style="font-size: 0.8rem; color: var(--text-tertiary);">| Lifetime Warranty</span>
                            </div>
                        </div>

                        <p class="quick-view-desc">${product.description || product.tagline || ''}</p>

                        <div class="quick-view-specs">
                            <div class="spec-item">
                                <span class="spec-label">Dimensions</span>
                                <span class="spec-val">${product.dimensions || '55 x 40 x 20 cm'}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Volume</span>
                                <span class="spec-val">${product.volume || '35 Liters'}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Weight</span>
                                <span class="spec-val">${product.weight || '3.2 kg'}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Material</span>
                                <span class="spec-val">${materialClean}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Security</span>
                                <span class="spec-val">TSA 008 Integrated Lock</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Mobility</span>
                                <span class="spec-val">360° Ball-Bearing Spinner</span>
                            </div>
                        </div>

                        <div class="quick-view-actions">
                            <button class="btn btn-primary" onclick="window.AetherCatalog.addQuickViewToCart()">
                                <i class="fa-solid fa-boxes-packing"></i> Order Now
                            </button>
                            <button class="btn btn-secondary" onclick="window.AetherCatalog.openEnquireModal('${product.id}')">
                                <i class="fa-solid fa-headset"></i> Enquire Concierge
                            </button>
                        </div>
                    </div>
                </div>
            `;

            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        },

        addQuickViewToCart() {
            if (!this.selectedProductForQuickView) return;
            if (window.AetherCart) {
                window.AetherCart.addToCart(this.selectedProductForQuickView.id, null, 1);
            }
            this.closeQuickView();
        },

        closeQuickView() {
            const modal = document.getElementById('quickViewModal');
            if (modal) modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            this.selectedProductForQuickView = null;
        },

        resetFilters() {
            this.activeFilter = 'all';
            this.searchQuery = '';
            this.sortBy = 'featured';

            // Reset UI inputs
            const searchInput = document.getElementById('catalogSearchInput');
            if (searchInput) searchInput.value = '';

            const sortSelect = document.getElementById('catalogSortSelect');
            if (sortSelect) sortSelect.value = 'featured';

            const maisonSelect = document.getElementById('maisonFilterSelect');
            if (maisonSelect) maisonSelect.value = 'all';

            this.setActiveFilter('all', true);
        },

        bindControls() {
            // 1. Category Segmented Tabs
            document.querySelectorAll('.collection-tab-btn').forEach(tab => {
                tab.addEventListener('click', () => {
                    const filter = tab.getAttribute('data-filter') || 'all';
                    this.setActiveFilter(filter);
                });
            });

            // 2. Maison Quick Chips
            document.querySelectorAll('.maison-chip-btn').forEach(chip => {
                chip.addEventListener('click', () => {
                    const filter = chip.getAttribute('data-filter') || 'all';
                    // Toggle if clicked again
                    if (this.activeFilter.toLowerCase() === filter.toLowerCase()) {
                        this.setActiveFilter('all');
                    } else {
                        this.setActiveFilter(filter);
                    }
                });
            });

            // 3. Maison Select Dropdown
            const maisonSelect = document.getElementById('maisonFilterSelect');
            if (maisonSelect) {
                maisonSelect.addEventListener('change', (e) => {
                    this.setActiveFilter(e.target.value);
                });
            }

            // 4. Clear Active Filter Button
            const clearBtn = document.getElementById('clearActiveFilterBtn');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.setActiveFilter('all');
                });
            }

            // 5. Backwards compatibility for .filter-pill
            document.querySelectorAll('.filter-pill').forEach(pill => {
                pill.addEventListener('click', () => {
                    const filter = pill.getAttribute('data-filter') || 'all';
                    this.setActiveFilter(filter);
                });
            });

            // 6. Search Input (Real-time live keyword filter)
            const searchInput = document.getElementById('catalogSearchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchQuery = e.target.value;
                    this.render();
                });
            }

            // 7. Sort Select
            const sortSelect = document.getElementById('catalogSortSelect');
            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    this.sortBy = e.target.value;
                    this.render();
                });
            }

            // 8. Quick View Close & Backdrop
            const qvClose = document.getElementById('quickViewCloseBtn');
            if (qvClose) qvClose.addEventListener('click', () => this.closeQuickView());

            const modal = document.getElementById('quickViewModal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) this.closeQuickView();
                });
            }
        },

        ensureEnquireModalDOM() {
            let overlay = document.getElementById('luggageEnquireModal');
            if (overlay) return overlay;

            overlay = document.createElement('div');
            overlay.id = 'luggageEnquireModal';
            overlay.className = 'enquire-modal-overlay';
            overlay.innerHTML = `
                <div class="enquire-modal-card" role="dialog" aria-modal="true" aria-labelledby="enquireModalTitle">
                    <button class="enquire-modal-close" id="enquireModalCloseBtn" type="button" aria-label="Close Enquiry Modal" onclick="window.AetherCatalog.closeEnquireModal()">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    
                    <div class="enquire-modal-header">
                        <span class="enquire-modal-badge"><i class="fa-solid fa-headset"></i> VIP Travel Concierge</span>
                        <h2 class="enquire-modal-title" id="enquireModalTitle">Luggage & Voyage Enquiry</h2>
                        <p class="enquire-modal-subtitle">Speak with an Aether Voyage travel consultant regarding airline compliance, custom monogramming, or bespoke delivery.</p>
                    </div>

                    <div class="enquire-product-preview" id="enquireProductPreview">
                        <!-- Populated dynamically -->
                    </div>

                    <form class="enquire-form" id="enquireModalForm" onsubmit="window.AetherCatalog.submitEnquiry(event)">
                        <div class="enquire-form-row">
                            <div class="enquire-field-group">
                                <label for="enquireName">Full Name *</label>
                                <input type="text" id="enquireName" required placeholder="Lord / Lady / Mr / Ms">
                            </div>
                            <div class="enquire-field-group">
                                <label for="enquireEmail">VIP Email *</label>
                                <input type="email" id="enquireEmail" required placeholder="contact@traveler.com">
                            </div>
                        </div>

                        <div class="enquire-form-row">
                            <div class="enquire-field-group">
                                <label for="enquirePhone">Phone / WhatsApp</label>
                                <input type="tel" id="enquirePhone" placeholder="+1 (555) 000-0000">
                            </div>
                            <div class="enquire-field-group">
                                <label for="enquireTopic">Inquiry Type</label>
                                <select id="enquireTopic">
                                    <option value="airline">Airline Cabin Sizing & Compliance</option>
                                    <option value="monogram">Custom Initials & Monogramming</option>
                                    <option value="delivery">Expedited Global Delivery / White-Glove</option>
                                    <option value="corporate">Corporate / Private Jet Fleet Order</option>
                                    <option value="bespoke">Bespoke Commission Consultation</option>
                                </select>
                            </div>
                        </div>

                        <div class="enquire-field-group">
                            <label for="enquireMessage">Travel Requirements & Questions</label>
                            <textarea id="enquireMessage" rows="3" placeholder="Tell us about your upcoming voyage, destination airlines, or specific custom luggage requests..."></textarea>
                        </div>

                        <button type="submit" class="enquire-submit-btn">
                            <i class="fa-solid fa-paper-plane"></i> Submit Travel Enquiry
                        </button>
                    </form>
                </div>
            `;

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeEnquireModal();
            });

            document.body.appendChild(overlay);
            return overlay;
        },

        openEnquireModal(productId) {
            const overlay = this.ensureEnquireModalDOM();
            const product = (window.AETHER_PRODUCTS || []).find(p => p.id === productId);
            const previewBox = document.getElementById('enquireProductPreview');

            if (previewBox) {
                if (product) {
                    const priceFormatted = window.AetherTheme ? window.AetherTheme.formatPrice(product.price) : `$${product.price}`;
                    previewBox.innerHTML = `
                        <img src="${product.baseImage}" alt="${product.name}" class="enquire-product-img">
                        <div style="flex: 1; display: flex; flex-direction: column;">
                            <span style="font-size: 0.72rem; color: var(--color-gold); font-weight: 800; text-transform: uppercase;">${product.brand}</span>
                            <strong style="font-size: 0.95rem; color: var(--text-primary); font-family: var(--font-serif);">${product.name}</strong>
                            <span style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${priceFormatted} &bull; ${product.volume || '35L'} &bull; ${product.weight || '3.2kg'}</span>
                        </div>
                    `;
                    previewBox.style.display = 'flex';
                } else {
                    previewBox.innerHTML = `
                        <div style="padding: 0.5rem 0;">
                            <span style="font-size: 0.75rem; color: var(--color-gold); font-weight: 800; text-transform: uppercase;">Aether Atelier Concierge</span>
                            <strong style="font-size: 1rem; color: var(--text-primary); display: block;">General Travel Luggage Commission Inquiry</strong>
                        </div>
                    `;
                }
            }

            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        },

        closeEnquireModal() {
            const overlay = document.getElementById('luggageEnquireModal');
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        },

        submitEnquiry(event) {
            event.preventDefault();
            const nameInput = document.getElementById('enquireName');
            const name = nameInput ? nameInput.value : 'Traveler';

            this.closeEnquireModal();

            if (window.AetherCart && typeof window.AetherCart.showToast === 'function') {
                window.AetherCart.showToast(`Thank you, ${name}! Your luggage inquiry has been received. Our Concierge will contact you within 2 hours.`);
            } else {
                alert(`Thank you, ${name}! Your luggage inquiry has been received. Our Concierge will contact you shortly.`);
            }

            const form = document.getElementById('enquireModalForm');
            if (form) form.reset();
        }
    };

    window.AetherCatalog = AetherCatalog;
})();
