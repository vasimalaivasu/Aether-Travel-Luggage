/**
 * Aether Voyage - 100-Year Warranty & Repair Service Engine
 */

(function () {
    'use strict';

    const DEMO_CLAIMS = {
        'AV-9842': {
            model: 'Aether Chronos Titan Trunk',
            currentStep: 3, // In repair
            steps: [
                { title: 'Registered & Serial Verified', time: 'Aug 28, 2026 - 10:14 AM', completed: true },
                { title: 'Luggage Inspection & Diagnostics', time: 'Aug 29, 2026 - 02:30 PM', completed: true },
                { title: 'Professional Repair & Restoration', time: 'In Progress - Expected Sep 06', completed: false, active: true },
                { title: 'Pressure, Water & Drop Testing', time: 'Pending', completed: false },
                { title: 'Express Return Delivery', time: 'Pending', completed: false }
            ]
        },
        'AV-1044': {
            model: 'Rimowa Classic Cabin Silver',
            currentStep: 5,
            steps: [
                { title: 'Registered & Serial Verified', time: 'Aug 10, 2026', completed: true },
                { title: 'Luggage Inspection & Diagnostics', time: 'Aug 12, 2026', completed: true },
                { title: 'Professional Repair & Restoration', time: 'Aug 15, 2026', completed: true },
                { title: 'Pressure, Water & Drop Testing', time: 'Aug 17, 2026', completed: true },
                { title: 'Express Return Delivery', time: 'Delivered Aug 20, 2026', completed: true, active: false }
            ]
        }
    };

    const AetherWarranty = {
        init() {
            this.bindEvents();
            this.renderTracker('AV-9842'); // Load default demo
            this.initWorldClocks();
            this.initHubFilters();
            this.initSelectForRepair();
            this.initAnchorScrollHandler();
        },

        initWorldClocks() {
            const clockElements = document.querySelectorAll('.center-live-clock');
            if (!clockElements.length) return;

            const updateClocks = () => {
                const now = new Date();
                clockElements.forEach(el => {
                    const tz = el.getAttribute('data-tz');
                    const displayEl = el.querySelector('.clock-display');
                    if (!tz || !displayEl) return;

                    try {
                        const formatter = new Intl.DateTimeFormat('en-US', {
                            timeZone: tz,
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        });
                        displayEl.textContent = formatter.format(now);
                    } catch (e) {
                        displayEl.textContent = now.toTimeString().substring(0, 8);
                    }
                });
            };

            updateClocks();
            setInterval(updateClocks, 1000);
        },

        initHubFilters() {
            const pills = document.querySelectorAll('.hub-filter-pill');
            const cards = document.querySelectorAll('.center-card');
            if (!pills.length || !cards.length) return;

            pills.forEach(pill => {
                pill.addEventListener('click', () => {
                    pills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');

                    const filter = pill.getAttribute('data-filter') || 'all';

                    cards.forEach(card => {
                        const region = card.getAttribute('data-region') || '';
                        if (filter === 'all' || region === filter) {
                            card.classList.remove('center-filtered-out');
                            card.style.animation = 'fadeInUp 0.4s ease forwards';
                        } else {
                            card.classList.add('center-filtered-out');
                        }
                    });
                });
            });
        },

        initSelectForRepair() {
            const selectBtns = document.querySelectorAll('.center-select-btn');
            const centerSelect = document.getElementById('warrantyServiceCenter');
            const claimForm = document.getElementById('warrantyClaimForm');

            selectBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const centerVal = btn.getAttribute('data-center');
                    if (centerSelect && centerVal) {
                        centerSelect.value = centerVal;
                        centerSelect.style.outline = '2px solid var(--color-gold)';
                        centerSelect.style.borderColor = 'var(--color-gold)';
                        setTimeout(() => {
                            centerSelect.style.outline = '';
                            centerSelect.style.borderColor = '';
                        }, 2500);
                    }

                    if (claimForm) {
                        claimForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    const cityTitle = btn.closest('.center-card')?.querySelector('.center-city')?.textContent?.trim() || 'Selected Hub';
                    if (window.AetherApp && window.AetherApp.showToast) {
                        window.AetherApp.showToast(`${cityTitle} selected for your repair claim.`, 'success');
                    }
                });
            });
        },

        initAnchorScrollHandler() {
            const handleHash = () => {
                const hash = (window.location.hash || '').toLowerCase();
                if (hash === '#service-centers' || hash === '#global-service-centers') {
                    const target = document.getElementById('service-centers');
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        target.classList.add('section-target-highlight');
                        setTimeout(() => {
                            target.classList.remove('section-target-highlight');
                        }, 2800);
                    }
                } else if (hash === '#tracker' || hash === '#repair-tracker') {
                    const trackerEl = document.getElementById('tracker');
                    if (trackerEl) {
                        trackerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            };

            // Trigger on page load with slight delay for layout stabilization
            setTimeout(handleHash, 200);

            // Handle hashchange in browser
            window.addEventListener('hashchange', handleHash);

            // Same-page clicks on any link pointing to service-centers
            document.querySelectorAll('a[href*="#service-centers"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    // Check if on warranty.html
                    const path = window.location.pathname.split('/').pop() || '';
                    if (path === '' || path === 'warranty.html') {
                        e.preventDefault();
                        if (window.location.hash !== '#service-centers') {
                            history.pushState(null, null, '#service-centers');
                        }
                        handleHash();
                    }
                });
            });
        },

        renderTracker(claimId) {
            const container = document.getElementById('trackerTimeline');
            const infoEl = document.getElementById('trackerClaimInfo');
            if (!container) return;

            const cleanId = (claimId || '').trim().toUpperCase();
            const claim = DEMO_CLAIMS[cleanId] || {
                model: 'Aether Luggage Piece',
                currentStep: 1,
                steps: [
                    { title: 'Registered & Serial Verified', time: 'Just Now', completed: true, active: true },
                    { title: 'Luggage Inspection & Diagnostics', time: 'Queued', completed: false },
                    { title: 'Professional Repair & Restoration', time: 'Pending', completed: false },
                    { title: 'Pressure, Water & Drop Testing', time: 'Pending', completed: false },
                    { title: 'Express Return Delivery', time: 'Pending', completed: false }
                ]
            };

            if (infoEl) {
                infoEl.innerHTML = `<strong>Claim ID:</strong> ${cleanId} &bull; <strong>Piece:</strong> ${claim.model}`;
            }

            container.innerHTML = claim.steps.map((step, idx) => {
                let statusClass = '';
                let iconClass = 'fa-clock';

                if (step.completed) {
                    statusClass = 'completed';
                    iconClass = 'fa-check';
                } else if (step.active) {
                    statusClass = 'active';
                    iconClass = 'fa-gear fa-spin';
                }

                return `
                    <div class="timeline-step ${statusClass}">
                        <div class="step-node">
                            <i class="fa-solid ${iconClass}"></i>
                        </div>
                        <div class="step-content">
                            <h4 class="step-title">${step.title}</h4>
                            <span class="step-desc">Step ${idx + 1} of 5</span>
                            <span class="step-time">${step.time}</span>
                        </div>
                    </div>
                `;
            }).join('');
        },

        handleClaimSubmit(formData) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const newClaimId = `AV-${randomNum}`;

            DEMO_CLAIMS[newClaimId] = {
                model: formData.model || 'Aether Luggage Suitcase',
                currentStep: 1,
                steps: [
                    { title: 'Registered & Serial Verified', time: 'Just Now', completed: true, active: true },
                    { title: 'Luggage Inspection & Diagnostics', time: 'Scheduled for Tomorrow', completed: false },
                    { title: 'Professional Repair & Restoration', time: 'Pending', completed: false },
                    { title: 'Pressure, Water & Drop Testing', time: 'Pending', completed: false },
                    { title: 'Express Return Delivery', time: 'Pending', completed: false }
                ]
            };

            const searchInput = document.getElementById('trackerSearchInput');
            if (searchInput) searchInput.value = newClaimId;

            this.renderTracker(newClaimId);

            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast(`Claim ${newClaimId} submitted. Repair request initiated.`, 'success');
            }
        },

        bindEvents() {
            // Claim Form
            const claimForm = document.getElementById('warrantyClaimForm');
            if (claimForm) {
                claimForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = {
                        serial: document.getElementById('warrantySerial')?.value,
                        model: document.getElementById('warrantyModel')?.value,
                        issue: document.getElementById('warrantyIssue')?.value,
                        owner: document.getElementById('warrantyName')?.value
                    };
                    this.handleClaimSubmit(formData);
                    claimForm.reset();
                });
            }

            // Tracker Search
            const trackerBtn = document.getElementById('trackerSearchBtn');
            const trackerInput = document.getElementById('trackerSearchInput');
            if (trackerBtn && trackerInput) {
                trackerBtn.addEventListener('click', () => {
                    this.renderTracker(trackerInput.value);
                });
                trackerInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.renderTracker(trackerInput.value);
                });
            }

            // FAQ Accordion
            document.querySelectorAll('.faq-question').forEach(q => {
                q.addEventListener('click', () => {
                    const item = q.closest('.faq-item');
                    if (item) {
                        const isActive = item.classList.contains('active');
                        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                        if (!isActive) item.classList.add('active');
                    }
                });
            });
        }
    };

    window.AetherWarranty = AetherWarranty;
})();
