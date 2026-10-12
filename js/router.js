/**
 * Aether Voyage - Multi-Page Navigation & Active Link Controller
 */

(function () {
    'use strict';

    const AetherRouter = {
        init() {
            this.highlightActiveNavLink();
        },

        highlightActiveNavLink() {
            // Get current file path (e.g., 'index.html', 'collections.html', etc.)
            let currentPath = window.location.pathname.split('/').pop() || 'index.html';
            if (currentPath === '') currentPath = 'index.html';

            // Mark active desktop and mobile nav links
            document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;

                const linkPath = href.split('?')[0].split('#')[0];

                if (linkPath === currentPath || (currentPath === 'index.html' && (linkPath === '' || linkPath === './'))) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        },

        navigateTo(destination) {
            if (destination.endsWith('.html') || destination.startsWith('http')) {
                window.location.href = destination;
            } else {
                window.location.href = `${destination}.html`;
            }
        }
    };

    window.AetherRouter = AetherRouter;
})();
