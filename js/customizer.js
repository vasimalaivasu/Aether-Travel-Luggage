/**
 * AETHER VOYAGE — Bespoke Luggage Atelier Engine
 * Powers interactive bag customization, dynamic SVG visualizer, hot-stamp monograms & cart integration
 */

(function () {
    'use strict';

    // Atelier Configuration Catalog
    const ATELIER_CONFIG = {
        silhouettes: {
            'grand-tourer': {
                id: 'grand-tourer',
                name: 'The Grand Tourer (Check-In 30")',
                basePrice: 1650,
                weight: '5.2 kg / 11.4 lbs',
                capacity: '98 Liters',
                dimensions: '78 x 52 x 28 cm',
                leadTime: '7–10 Atelier Days',
                description: 'Full-volume long haul luggage engineered from aerospace magnesium-aluminum alloy.'
            },
            'continental': {
                id: 'continental',
                name: 'The Continental (Carry-On 22")',
                basePrice: 1350,
                weight: '4.1 kg / 9.0 lbs',
                capacity: '42 Liters',
                dimensions: '55 x 40 x 23 cm',
                leadTime: '5–7 Atelier Days',
                description: 'Global cabin-approved carry-on tailored for effortless intercontinental transit.'
            },
            'diplomat': {
                id: 'diplomat',
                name: 'The Diplomat (Executive Cabin)',
                basePrice: 1100,
                weight: '3.1 kg / 6.8 lbs',
                capacity: '32 Liters',
                dimensions: '50 x 36 x 20 cm',
                leadTime: '4–6 Atelier Days',
                description: 'Slimline executive cabin trolley engineered for rapid business transit with dual TSA latches.'
            },
            'amalfi': {
                id: 'amalfi',
                name: 'The Amalfi (Italian Voyager Trunk)',
                basePrice: 1250,
                weight: '3.5 kg / 7.7 lbs',
                capacity: '48 Liters',
                dimensions: '58 x 42 x 25 cm',
                leadTime: '5–7 Atelier Days',
                description: 'Sculpted vegetable-tanned Tuscan leather upright voyager with reinforced curved corners.'
            }
        },

        colors: {
            'titanium': {
                id: 'titanium',
                name: 'Titanium Silver',
                hex: '#c0c0c4',
                gradStart: '#f0f0f4',
                gradMid: '#c0c0c8',
                gradEnd: '#84848c',
                priceAdd: 0,
                ribColor: 'rgba(0, 0, 0, 0.18)'
            },
            'obsidian': {
                id: 'obsidian',
                name: 'Obsidian Noir',
                hex: '#1e2229',
                gradStart: '#363d48',
                gradMid: '#1e2229',
                gradEnd: '#0f1217',
                priceAdd: 60,
                ribColor: 'rgba(255, 255, 255, 0.12)'
            },
            'champagne': {
                id: 'champagne',
                name: 'Champagne Gold',
                hex: '#d4af37',
                gradStart: '#fde9af',
                gradMid: '#d4af37',
                gradEnd: '#96741b',
                priceAdd: 120,
                ribColor: 'rgba(90, 60, 10, 0.22)'
            },
            'racing-green': {
                id: 'racing-green',
                name: 'British Racing Green',
                hex: '#1c3d2e',
                gradStart: '#2d6149',
                gradMid: '#1c3d2e',
                gradEnd: '#0d1e16',
                priceAdd: 90,
                ribColor: 'rgba(0, 0, 0, 0.28)'
            },
            'cognac-sienna': {
                id: 'cognac-sienna',
                name: 'Cognac Sienna',
                hex: '#8e4a25',
                gradStart: '#b56436',
                gradMid: '#8e4a25',
                gradEnd: '#552811',
                priceAdd: 85,
                ribColor: 'rgba(0, 0, 0, 0.25)'
            },
            'royal-navy': {
                id: 'royal-navy',
                name: 'Royal Monaco Navy',
                hex: '#1b2a42',
                gradStart: '#2d466d',
                gradMid: '#1b2a42',
                gradEnd: '#0d1624',
                priceAdd: 75,
                ribColor: 'rgba(255, 255, 255, 0.1)'
            }
        },

        leathers: {
            'tuscan-tan': {
                id: 'tuscan-tan',
                name: 'Tuscan Tan Leather',
                hex: '#9e6334',
                gradStart: '#b67644',
                gradEnd: '#7a461e',
                priceAdd: 0
            },
            'saddle-cognac': {
                id: 'saddle-cognac',
                name: 'Saddle Cognac Leather',
                hex: '#693717',
                gradStart: '#824621',
                gradEnd: '#4c250e',
                priceAdd: 45
            },
            'midnight-nero': {
                id: 'midnight-nero',
                name: 'Midnight Nero Leather',
                hex: '#1f1f23',
                gradStart: '#333338',
                gradEnd: '#121215',
                priceAdd: 35
            },
            'raw-vachetta': {
                id: 'raw-vachetta',
                name: 'Raw Vachetta Cream',
                hex: '#d6be9f',
                gradStart: '#e5d3bc',
                gradEnd: '#be9f7b',
                priceAdd: 70
            },
            'oxblood': {
                id: 'oxblood',
                name: 'Oxblood Bordeaux',
                hex: '#5c1b26',
                gradStart: '#792534',
                gradEnd: '#3e1018',
                priceAdd: 80
            }
        },

        hardware: {
            'gold': {
                id: 'gold',
                name: '24K Polished Gold',
                hex: '#e2b755',
                gradStart: '#fff2b3',
                gradEnd: '#a07823',
                foilColor: '#e5b842',
                foilShadow: 'rgba(229, 184, 66, 0.6)',
                priceAdd: 140
            },
            'gunmetal': {
                id: 'gunmetal',
                name: 'Matte Obsidian Gunmetal',
                hex: '#475569',
                gradStart: '#64748b',
                gradEnd: '#293341',
                foilColor: '#94a3b8',
                foilShadow: 'rgba(148, 163, 184, 0.4)',
                priceAdd: 60
            },
            'palladium': {
                id: 'palladium',
                name: 'Brushed Palladium Silver',
                hex: '#d1d5db',
                gradStart: '#f3f4f6',
                gradEnd: '#9ca3af',
                foilColor: '#f1f5f9',
                foilShadow: 'rgba(255, 255, 255, 0.6)',
                priceAdd: 80
            },
            'antique-brass': {
                id: 'antique-brass',
                name: 'Vintage Heritage Brass',
                hex: '#9c7b41',
                gradStart: '#bd9a5a',
                gradEnd: '#6b5125',
                foilColor: '#b8944d',
                foilShadow: 'rgba(184, 148, 77, 0.4)',
                priceAdd: 95
            }
        },

        wheels: {
            'whisper-360': {
                id: 'whisper-360',
                name: '360° Whisper-Glide Wheels',
                desc: 'Hinomoto Japanese ball-bearing casters',
                priceAdd: 0
            },
            'all-terrain': {
                id: 'all-terrain',
                name: 'All-Terrain Cobblestone Wheels',
                desc: 'Reinforced dual-urethane suspension',
                priceAdd: 85
            }
        },

        monogramFoils: {
            'gold-foil': { id: 'gold-foil', name: '24K Gold Foil Leaf', color: '#ffd269', shadow: 'rgba(255, 210, 105, 0.65)' },
            'silver-foil': { id: 'silver-foil', name: 'Silver Palladium Foil', color: '#f8fafc', shadow: 'rgba(255, 255, 255, 0.7)' },
            'blind-deboss': { id: 'blind-deboss', name: 'Blind Heat Deboss (No Foil)', color: '#3b2110', shadow: 'rgba(0, 0, 0, 0.5)' }
        }
    };

    // Current State
    const state = {
        silhouette: 'continental',
        color: 'champagne',
        leather: 'tuscan-tan',
        hardware: 'gold',
        wheel: 'whisper-360',
        monogramText: 'AV',
        monogramFoil: 'gold-foil',
        viewAngle: 'front' // 'front', 'perspective', 'detail'
    };

    const AetherCustomizer = {
        init() {
            this.bindControls();
            this.bindMonogramInputs();
            this.bindPresets();
            this.bindActions();
            this.render();

            // Listen for theme / currency updates
            window.addEventListener('currencyChanged', () => {
                this.updatePricingUI();
            });
        },

        bindControls() {
            // Silhouette buttons
            document.querySelectorAll('[data-custom-silhouette]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.dataset.customSilhouette;
                    if (ATELIER_CONFIG.silhouettes[val]) {
                        state.silhouette = val;
                        document.querySelectorAll('[data-custom-silhouette]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.render();
                    }
                });
            });

            // Color swatches
            document.querySelectorAll('[data-custom-color]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.dataset.customColor;
                    if (ATELIER_CONFIG.colors[val]) {
                        state.color = val;
                        document.querySelectorAll('[data-custom-color]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.render();
                    }
                });
            });

            // Leather swatches
            document.querySelectorAll('[data-custom-leather]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.dataset.customLeather;
                    if (ATELIER_CONFIG.leathers[val]) {
                        state.leather = val;
                        document.querySelectorAll('[data-custom-leather]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.render();
                    }
                });
            });

            // Hardware swatches
            document.querySelectorAll('[data-custom-hardware]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.dataset.customHardware;
                    if (ATELIER_CONFIG.hardware[val]) {
                        state.hardware = val;
                        document.querySelectorAll('[data-custom-hardware]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.render();
                    }
                });
            });

            // Wheels radio/cards
            document.querySelectorAll('[data-custom-wheel]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.dataset.customWheel;
                    if (ATELIER_CONFIG.wheels[val]) {
                        state.wheel = val;
                        document.querySelectorAll('[data-custom-wheel]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.render();
                    }
                });
            });

            // Angle Switcher
            document.querySelectorAll('[data-view-angle]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const angle = btn.dataset.viewAngle;
                    state.viewAngle = angle;
                    document.querySelectorAll('[data-view-angle]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.updateViewAngle();
                });
            });
        },

        bindMonogramInputs() {
            const monoInput = document.getElementById('monogramInput');
            if (monoInput) {
                monoInput.addEventListener('input', (e) => {
                    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    if (val.length > 3) val = val.substring(0, 3);
                    monoInput.value = val;
                    state.monogramText = val || 'Æ';
                    this.updateMonogramRendering();
                });
            }

            // Monogram foil radio buttons
            document.querySelectorAll('[data-custom-foil]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const foil = btn.dataset.customFoil;
                    if (ATELIER_CONFIG.monogramFoils[foil]) {
                        state.monogramFoil = foil;
                        document.querySelectorAll('[data-custom-foil]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.updateMonogramRendering();
                    }
                });
            });
        },

        bindPresets() {
            document.querySelectorAll('[data-preset-config]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const presetName = btn.dataset.presetConfig;
                    this.applyPreset(presetName);
                });
            });
        },

        applyPreset(presetKey) {
            const presets = {
                'monaco-gold': {
                    silhouette: 'continental',
                    color: 'champagne',
                    leather: 'tuscan-tan',
                    hardware: 'gold',
                    wheel: 'whisper-360',
                    monogramText: 'MGC',
                    monogramFoil: 'gold-foil'
                },
                'wall-street': {
                    silhouette: 'diplomat',
                    color: 'obsidian',
                    leather: 'midnight-nero',
                    hardware: 'gunmetal',
                    wheel: 'whisper-360',
                    monogramText: 'WSS',
                    monogramFoil: 'silver-foil'
                },
                'alpine-silver': {
                    silhouette: 'grand-tourer',
                    color: 'titanium',
                    leather: 'raw-vachetta',
                    hardware: 'palladium',
                    wheel: 'all-terrain',
                    monogramText: 'SMA',
                    monogramFoil: 'silver-foil'
                },
                'goodwood-green': {
                    silhouette: 'amalfi',
                    color: 'racing-green',
                    leather: 'saddle-cognac',
                    hardware: 'antique-brass',
                    wheel: 'whisper-360',
                    monogramText: 'GWC',
                    monogramFoil: 'gold-foil'
                }
            };

            const preset = presets[presetKey];
            if (!preset) return;

            Object.assign(state, preset);

            // Sync UI active states
            this.syncActiveButtons();
            const monoInput = document.getElementById('monogramInput');
            if (monoInput) monoInput.value = state.monogramText;

            this.render();

            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast(`Applied curated preset configuration`, 'info');
            }
        },

        syncActiveButtons() {
            document.querySelectorAll('[data-custom-silhouette]').forEach(b => {
                b.classList.toggle('active', b.dataset.customSilhouette === state.silhouette);
            });
            document.querySelectorAll('[data-custom-color]').forEach(b => {
                b.classList.toggle('active', b.dataset.customColor === state.color);
            });
            document.querySelectorAll('[data-custom-leather]').forEach(b => {
                b.classList.toggle('active', b.dataset.customLeather === state.leather);
            });
            document.querySelectorAll('[data-custom-hardware]').forEach(b => {
                b.classList.toggle('active', b.dataset.customHardware === state.hardware);
            });
            document.querySelectorAll('[data-custom-wheel]').forEach(b => {
                b.classList.toggle('active', b.dataset.customWheel === state.wheel);
            });
            document.querySelectorAll('[data-custom-foil]').forEach(b => {
                b.classList.toggle('active', b.dataset.customFoil === state.monogramFoil);
            });
        },

        bindActions() {
            // Add to Cart
            const addToCartBtn = document.getElementById('addBespokeToCartBtn');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    this.addBespokeToCart();
                });
            }

            // Save Bespoke Spec
            const saveSpecBtn = document.getElementById('saveBespokeSpecBtn');
            if (saveSpecBtn) {
                saveSpecBtn.addEventListener('click', () => {
                    this.saveDesignSpec();
                });
            }
        },

        calculatePrice() {
            const sil = ATELIER_CONFIG.silhouettes[state.silhouette];
            const col = ATELIER_CONFIG.colors[state.color];
            const ltr = ATELIER_CONFIG.leathers[state.leather];
            const hdw = ATELIER_CONFIG.hardware[state.hardware];
            const whl = ATELIER_CONFIG.wheels[state.wheel];

            const total = (sil ? sil.basePrice : 1350) +
                          (col ? col.priceAdd : 0) +
                          (ltr ? ltr.priceAdd : 0) +
                          (hdw ? hdw.priceAdd : 0) +
                          (whl ? whl.priceAdd : 0);

            return total;
        },

        updatePricingUI() {
            const price = this.calculatePrice();
            const formatted = window.AetherTheme ? window.AetherTheme.formatPrice(price) : `$${price.toLocaleString()}`;
            
            const priceDisplay = document.getElementById('bespokeTotalPrice');
            if (priceDisplay) priceDisplay.textContent = formatted;

            const sil = ATELIER_CONFIG.silhouettes[state.silhouette];
            const baseFormatted = window.AetherTheme ? window.AetherTheme.formatPrice(sil.basePrice) : `$${sil.basePrice}`;
            const baseDisplay = document.getElementById('bespokeBasePrice');
            if (baseDisplay) baseDisplay.textContent = baseFormatted;

            // Spec displays
            const silNameDisplay = document.getElementById('specSilhouetteName');
            if (silNameDisplay) silNameDisplay.textContent = sil.name;

            const weightDisplay = document.getElementById('specWeight');
            if (weightDisplay) weightDisplay.textContent = sil.weight;

            const capDisplay = document.getElementById('specCapacity');
            if (capDisplay) capDisplay.textContent = sil.capacity;

            const dimDisplay = document.getElementById('specDimensions');
            if (dimDisplay) dimDisplay.textContent = sil.dimensions;

            const leadDisplay = document.getElementById('specLeadTime');
            if (leadDisplay) leadDisplay.textContent = sil.leadTime;

            // Labels under swatches
            const col = ATELIER_CONFIG.colors[state.color];
            const activeColorName = document.getElementById('activeColorName');
            if (activeColorName && col) activeColorName.textContent = col.name;

            const ltr = ATELIER_CONFIG.leathers[state.leather];
            const activeLeatherName = document.getElementById('activeLeatherName');
            if (activeLeatherName && ltr) activeLeatherName.textContent = ltr.name;

            const hdw = ATELIER_CONFIG.hardware[state.hardware];
            const activeHardwareName = document.getElementById('activeHardwareName');
            if (activeHardwareName && hdw) activeHardwareName.textContent = hdw.name;

            const whl = ATELIER_CONFIG.wheels[state.wheel];
            const activeWheelName = document.getElementById('activeWheelName');
            if (activeWheelName && whl) activeWheelName.textContent = whl.name;
        },

        render() {
            this.updateSvgLuggage();
            this.updateMonogramRendering();
            this.updatePricingUI();
        },

        updateSvgLuggage() {
            const col = ATELIER_CONFIG.colors[state.color];
            const ltr = ATELIER_CONFIG.leathers[state.leather];
            const hdw = ATELIER_CONFIG.hardware[state.hardware];

            // Update Gradients in SVG
            const shellStop1 = document.getElementById('shellGradStop1');
            const shellStop2 = document.getElementById('shellGradStop2');
            const shellStop3 = document.getElementById('shellGradStop3');

            if (shellStop1 && shellStop2 && shellStop3 && col) {
                shellStop1.setAttribute('stop-color', col.gradStart);
                shellStop2.setAttribute('stop-color', col.gradMid);
                shellStop3.setAttribute('stop-color', col.gradEnd);
            }

            // Leather Gradients & Fills
            const leatherStop1 = document.getElementById('leatherGradStop1');
            const leatherStop2 = document.getElementById('leatherGradStop2');
            if (leatherStop1 && leatherStop2 && ltr) {
                leatherStop1.setAttribute('stop-color', ltr.gradStart);
                leatherStop2.setAttribute('stop-color', ltr.gradEnd);
            }

            // Hardware Gradients & Fills
            const hardwareStop1 = document.getElementById('hwGradStop1');
            const hardwareStop2 = document.getElementById('hwGradStop2');
            if (hardwareStop1 && hardwareStop2 && hdw) {
                hardwareStop1.setAttribute('stop-color', hdw.gradStart);
                hardwareStop2.setAttribute('stop-color', hdw.gradEnd);
            }

            // Silhouette body shaping - All 4 are vertical, upright luxury silhouettes perfectly fit for the live vector studio
            const mainBody = document.getElementById('svgMainBody');
            const sheenOverlay = document.getElementById('svgSheenOverlay');
            const silhouetteRatios = {
                'grand-tourer': { width: 330, height: 440, x: 85,  y: 95,  rx: 26 },
                'continental':  { width: 300, height: 420, x: 100, y: 110, rx: 24 },
                'diplomat':     { width: 275, height: 410, x: 112, y: 115, rx: 16 },
                'amalfi':       { width: 310, height: 425, x: 95,  y: 105, rx: 40 }
            };

            const shape = silhouetteRatios[state.silhouette] || silhouetteRatios['continental'];
            if (mainBody) {
                mainBody.setAttribute('x', shape.x);
                mainBody.setAttribute('y', shape.y);
                mainBody.setAttribute('width', shape.width);
                mainBody.setAttribute('height', shape.height);
                mainBody.setAttribute('rx', shape.rx);
            }

            if (sheenOverlay) {
                sheenOverlay.setAttribute('x', shape.x);
                sheenOverlay.setAttribute('y', shape.y);
                sheenOverlay.setAttribute('width', shape.width);
                sheenOverlay.setAttribute('height', shape.height);
                sheenOverlay.setAttribute('rx', shape.rx);
            }

            // Dynamically synchronize leather corners
            const dxLeft = shape.x - 100;
            const dxRight = (shape.x + shape.width) - 400;
            const dyTop = shape.y - 110;
            const dyBottom = (shape.y + shape.height) - 530;

            const cTL = document.getElementById('cornerTopLeft');
            const cTR = document.getElementById('cornerTopRight');
            const cBL = document.getElementById('cornerBottomLeft');
            const cBR = document.getElementById('cornerBottomRight');
            if (cTL) cTL.setAttribute('transform', `translate(${dxLeft}, ${dyTop})`);
            if (cTR) cTR.setAttribute('transform', `translate(${dxRight}, ${dyTop})`);
            if (cBL) cBL.setAttribute('transform', `translate(${dxLeft}, ${dyBottom})`);
            if (cBR) cBR.setAttribute('transform', `translate(${dxRight}, ${dyBottom})`);

            // Dynamically synchronize handles, locks, wheels, and monogram tag
            const topHandle = document.getElementById('svgTopHandle');
            const teleHandle = document.getElementById('svgTelescopicHandle');
            if (topHandle) topHandle.setAttribute('transform', `translate(0, ${dyTop})`);
            if (teleHandle) teleHandle.setAttribute('transform', `translate(0, ${dyTop})`);

            const sideHandle = document.getElementById('svgSideHandle');
            const tsaLocks = document.getElementById('svgTsaLocks');
            const dyCenter = dyTop + ((shape.height - 420) / 2);
            if (sideHandle) sideHandle.setAttribute('transform', `translate(${dxLeft}, ${dyCenter})`);
            if (tsaLocks) tsaLocks.setAttribute('transform', `translate(${dxRight}, ${dyCenter})`);

            const wheels = document.getElementById('svgSpinnerWheels');
            if (wheels) wheels.setAttribute('transform', `translate(0, ${dyBottom})`);

            const tagGroup = document.getElementById('svgLuggageTagGroup');
            if (tagGroup) tagGroup.setAttribute('transform', `translate(${145 + dxLeft}, ${160 + dyTop})`);

            // Update rib lines color and adaptive vertical spacing
            const ribs = document.querySelectorAll('.svg-rib-line');
            const ribBaseOffsets = [-110, -75, -40, 0, 40, 75, 110];
            ribs.forEach((rib, idx) => {
                if (col) rib.setAttribute('stroke', col.ribColor);
                if (ribBaseOffsets[idx] !== undefined) {
                    const scaledOffset = ribBaseOffsets[idx] * (shape.width / 300);
                    const newX = 250 + scaledOffset;
                    rib.setAttribute('x1', newX);
                    rib.setAttribute('x2', newX);
                    const isCenter = idx === 3;
                    rib.setAttribute('y1', isCenter ? shape.y + 15 : shape.y + 20);
                    rib.setAttribute('y2', isCenter ? shape.y + shape.height - 15 : shape.y + shape.height - 20);
                }
            });

            // Update hardware elements (latches, rivets, wheel caps)
            document.querySelectorAll('.svg-hardware-fill').forEach(el => {
                el.setAttribute('fill', 'url(#hardwareGradient)');
            });

            // Update leather corner guards
            document.querySelectorAll('.svg-leather-fill').forEach(el => {
                el.setAttribute('fill', 'url(#leatherGradient)');
            });
        },

        updateMonogramRendering() {
            const foil = ATELIER_CONFIG.monogramFoils[state.monogramFoil];
            const textEl = document.getElementById('svgLuggageTagMonogram');
            const tagBadgeText = document.getElementById('floatingTagMonogramText');

            const text = state.monogramText || 'Æ';

            if (textEl && foil) {
                textEl.textContent = text;
                textEl.setAttribute('fill', foil.color);
                textEl.style.textShadow = `0 0 6px ${foil.shadow}`;
            }

            if (tagBadgeText && foil) {
                tagBadgeText.textContent = text;
                tagBadgeText.style.color = foil.color;
                tagBadgeText.style.textShadow = `0 0 8px ${foil.shadow}`;
            }

            // Update foil badge indicator
            const foilName = document.getElementById('activeFoilName');
            if (foilName && foil) foilName.textContent = foil.name;
        },

        updateViewAngle() {
            const visualizer = document.getElementById('luggageSvgVisualizer');
            const floatingTag = document.querySelector('.stage-floating-tag');
            if (!visualizer) return;

            visualizer.classList.remove('angle-front', 'angle-perspective', 'angle-detail');

            if (state.viewAngle === 'perspective') {
                visualizer.classList.add('angle-perspective');
                if (floatingTag) floatingTag.classList.remove('tag-zoom-active');
                visualizer.style.transformOrigin = 'center center';
            } else if (state.viewAngle === 'detail') {
                visualizer.classList.add('angle-detail');
                if (floatingTag) floatingTag.classList.add('tag-zoom-active');

                // Dynamic origin centering directly on current silhouette's luggage tag
                const silhouetteRatios = {
                    'grand-tourer': { x: 85,  y: 95 },
                    'continental':  { x: 100, y: 110 },
                    'diplomat':     { x: 112, y: 115 },
                    'amalfi':       { x: 95,  y: 105 }
                };
                const cur = silhouetteRatios[state.silhouette] || silhouetteRatios['continental'];
                const tagCenterX = 145 + (cur.x - 100) + 27;
                const tagCenterY = 160 + (cur.y - 110) + 45;
                const originX = ((tagCenterX / 500) * 100).toFixed(1);
                const originY = ((tagCenterY / 620) * 100).toFixed(1);
                visualizer.style.transformOrigin = `${originX}% ${originY}%`;
            } else {
                visualizer.classList.add('angle-front');
                if (floatingTag) floatingTag.classList.remove('tag-zoom-active');
                visualizer.style.transformOrigin = 'center center';
            }
        },

        addBespokeToCart() {
            if (!window.AetherCart) {
                alert('Luggage Cart engine unavailable. Please reload the page.');
                return;
            }

            const sil = ATELIER_CONFIG.silhouettes[state.silhouette];
            const col = ATELIER_CONFIG.colors[state.color];
            const ltr = ATELIER_CONFIG.leathers[state.leather];
            const hdw = ATELIER_CONFIG.hardware[state.hardware];
            const whl = ATELIER_CONFIG.wheels[state.wheel];
            const foil = ATELIER_CONFIG.monogramFoils[state.monogramFoil];

            const price = this.calculatePrice();

            const bespokeItem = {
                id: `bespoke-${state.silhouette}-${Date.now()}`,
                name: `Bespoke ${sil.name.split('(')[0].trim()} [${state.monogramText}]`,
                brand: 'Aether Atelier Bespoke',
                price: price,
                color: col.name,
                colorHex: col.hex,
                leather: ltr.name,
                hardware: hdw.name,
                monogram: state.monogramText,
                foil: foil.name,
                image: col.previewImg || 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80',
                category: 'Bespoke Atelier Creation',
                details: `Silhouette: ${sil.name} | Leather: ${ltr.name} | Hardware: ${hdw.name} | Wheels: ${whl.name} | Monogram: ${state.monogramText} (${foil.name})`
            };

            window.AetherCart.addCustomItem(bespokeItem);
        },

        saveDesignSpec() {
            const specId = 'BESPOKE-' + Math.floor(100000 + Math.random() * 900000);
            const savedSpec = {
                specId: specId,
                date: new Date().toISOString(),
                state: Object.assign({}, state),
                price: this.calculatePrice(),
                silhouetteName: ATELIER_CONFIG.silhouettes[state.silhouette].name,
                colorName: ATELIER_CONFIG.colors[state.color].name,
                leatherName: ATELIER_CONFIG.leathers[state.leather].name,
                hardwareName: ATELIER_CONFIG.hardware[state.hardware].name,
                monogram: state.monogramText
            };

            try {
                const existing = JSON.parse(localStorage.getItem('aether_saved_bespoke_specs')) || [];
                existing.unshift(savedSpec);
                localStorage.setItem('aether_saved_bespoke_specs', JSON.stringify(existing.slice(0, 10)));

                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast(`Bespoke commission #${specId} saved to your VIP dossier!`, 'success');
                } else {
                    alert(`Bespoke commission #${specId} saved successfully!`);
                }
            } catch (e) {
                console.error('Failed to save bespoke spec:', e);
            }
        }
    };

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AetherCustomizer.init());
    } else {
        AetherCustomizer.init();
    }

    window.AetherCustomizer = AetherCustomizer;
})();
