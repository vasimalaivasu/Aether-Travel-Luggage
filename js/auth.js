/**
 * Aether Voyage - Customer Account & Authentication Engine
 * Supports Left-to-Right Sliding Auth Drawer, Full-Page Portal, and Session Persistence.
 */

(function () {
    'use strict';

    const USER_KEY = 'aether_current_user';
    const REGISTERED_USERS_KEY = 'aether_registered_users';

    const SEEDED_VIP_ACCOUNTS = [
        {
            email: 'alex@aethervoyage.com',
            password: 'luxury12345',
            name: 'Alex Morgan',
            orders: [
                { id: 'ORD-88301', date: 'Aug 14, 2026', total: '$1,850', status: 'Delivered' }
            ]
        },
        {
            email: 'elena@aethervoyage.com',
            password: 'aether2026',
            name: 'Elena Rostova',
            orders: []
        }
    ];

    const AetherAuth = {
        currentUser: null,
        pendingAction: null,
        activeTab: 'login',

        init() {
            try {
                const stored = localStorage.getItem(USER_KEY);
                if (stored) {
                    this.currentUser = JSON.parse(stored);
                }
            } catch (e) {
                this.currentUser = null;
            }

            this.updateUI();
            this.bindEvents();
        },

        getRegisteredUsers() {
            try {
                const raw = localStorage.getItem(REGISTERED_USERS_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        },

        saveUser(user) {
            this.currentUser = user;
            try {
                if (user) {
                    localStorage.setItem(USER_KEY, JSON.stringify(user));
                } else {
                    localStorage.removeItem(USER_KEY);
                }
            } catch (e) {}
            this.updateUI();
            if (typeof document !== 'undefined' && typeof document.getElementById === 'function' && document.getElementById('authDrawer')?.classList?.contains('open')) {
                this.renderAuthDrawer();
            }
        },

        login(email, password) {
            const cleanEmail = (email || '').trim().toLowerCase();
            const cleanPass = (password || '').trim();

            if (!cleanEmail || !cleanPass) {
                return { success: false, message: 'Please enter both email and password.' };
            }

            // Check registered accounts
            const registered = this.getRegisteredUsers();
            const foundUser = registered.find(u => (u.email || '').toLowerCase() === cleanEmail);

            if (foundUser) {
                if (foundUser.password === cleanPass) {
                    this.saveUser(foundUser);
                    return { success: true, user: foundUser };
                } else {
                    return { success: false, message: 'Invalid password. Please verify your credentials.' };
                }
            }

            // Check seeded accounts
            const foundSeeded = SEEDED_VIP_ACCOUNTS.find(u => u.email.toLowerCase() === cleanEmail);
            if (foundSeeded) {
                if (foundSeeded.password === cleanPass) {
                    this.saveUser(foundSeeded);
                    return { success: true, user: foundSeeded };
                } else {
                    return { success: false, message: 'Invalid password. Please verify your credentials.' };
                }
            }

            return {
                success: false,
                message: 'No account found with this email. Please check your credentials or create a new account.'
            };
        },

        register(name, email, password) {
            const cleanName = (name || '').trim();
            const cleanEmail = (email || '').trim().toLowerCase();
            const cleanPass = (password || '').trim();

            if (!cleanName) {
                return { success: false, message: 'Please enter your full name.' };
            }
            if (!cleanEmail || !cleanEmail.includes('@')) {
                return { success: false, message: 'Please provide a valid email address.' };
            }
            if (!cleanPass || cleanPass.length < 6) {
                return { success: false, message: 'Password must be at least 6 characters.' };
            }

            const registered = this.getRegisteredUsers();
            const exists = registered.some(u => (u.email || '').toLowerCase() === cleanEmail) ||
                           SEEDED_VIP_ACCOUNTS.some(u => u.email.toLowerCase() === cleanEmail);

            if (exists) {
                return { success: false, message: 'An account with this email address already exists. Please sign in.' };
            }

            const newUser = {
                id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
                name: cleanName,
                email: cleanEmail,
                password: cleanPass,
                createdAt: new Date().toISOString(),
                orders: []
            };

            registered.push(newUser);
            try {
                localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
            } catch (e) {}

            this.saveUser(newUser);
            return { success: true, user: newUser };
        },

        logout() {
            this.saveUser(null);
            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast('You have been signed out successfully.', 'info');
            }
            this.closeAuthDrawer();
            if (window.location.pathname.includes('login.html')) {
                window.location.reload();
            }
        },

        socialLogin(provider) {
            const mockName = provider === 'Google' ? 'Google Customer' : 'Apple Customer';
            const mockEmail = provider === 'Google' ? 'google.client@aethervoyage.com' : 'apple.client@aethervoyage.com';

            const user = {
                id: `SOC-${Math.floor(10000 + Math.random() * 90000)}`,
                name: mockName,
                email: mockEmail,
                provider: provider,
                orders: []
            };

            const isCheckout = this.pendingAction === 'checkout';
            this.saveUser(user);
            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast(isCheckout ? `Signed in with ${provider}! Opening checkout...` : `Signed in with ${provider} successfully!`, 'success');
            }
            if (isCheckout && window.AetherCheckout) {
                setTimeout(() => {
                    window.AetherCheckout.open();
                }, 350);
            }
            return { success: true, user };
        },

        openAuthDrawer(defaultTab = 'login') {
            if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;
            const drawer = document.getElementById('authDrawer');
            if (!drawer) {
                window.location.href = `login.html${this.pendingAction ? '?action=' + this.pendingAction : ''}`;
                return;
            }

            // Close other drawers
            if (window.AetherCart) {
                window.AetherCart.closeCartDrawer();
                window.AetherCart.closeWishlistDrawer();
            }
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) mobileMenu.classList.remove('open');

            this.activeTab = defaultTab;
            this.renderAuthDrawer(defaultTab);

            drawer.classList.add('open');
            const backdrop = document.getElementById('drawerBackdrop');
            if (backdrop) backdrop.classList.add('active');
            if (document.body && document.body.classList) document.body.classList.add('no-scroll');
        },

        closeAuthDrawer() {
            if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;
            const drawer = document.getElementById('authDrawer');
            if (drawer) drawer.classList.remove('open');
            const backdrop = document.getElementById('drawerBackdrop');
            if (backdrop) backdrop.classList.remove('active');
            if (document.body && document.body.classList) document.body.classList.remove('no-scroll');
            this.pendingAction = null;
        },

        renderAuthDrawer(tab = this.activeTab) {
            const body = document.getElementById('authDrawerBody');
            if (!body) return;

            if (this.currentUser) {
                body.innerHTML = `
                    <div style="padding: 1.5rem; text-align: center;">
                        <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--color-gold-glow); border: 2px solid var(--color-gold); color: var(--color-gold); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1rem; font-family: var(--font-serif); font-weight: 700;">
                            ${(this.currentUser.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <h3 style="font-family: var(--font-serif); margin-bottom: 0.25rem;">${this.currentUser.name}</h3>
                        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1.5rem;">${this.currentUser.email}</p>
                        
                        <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 1.5rem; text-align: left;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.4rem;">
                                <span style="color: var(--text-secondary);">Account Status</span>
                                <span style="color: var(--color-gold); font-weight: 700;">Verified Customer</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
                                <span style="color: var(--text-secondary);">Orders Placed</span>
                                <span style="font-weight: 700;">${Array.isArray(this.currentUser.orders) ? this.currentUser.orders.length : 0}</span>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                            <a href="collections.html" class="btn btn-primary" onclick="window.AetherAuth.closeAuthDrawer();">
                                <i class="fa-solid fa-bag-shopping"></i> Browse Collections
                            </a>
                            <button class="btn btn-outline" onclick="window.AetherAuth.logout();">
                                <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
                            </button>
                        </div>
                    </div>
                `;
                return;
            }

            body.innerHTML = `
                <div style="padding: 1.25rem;">
                    ${this.pendingAction === 'checkout' ? `
                        <div style="background: rgba(223, 186, 115, 0.12); border: 1px solid var(--color-gold); border-radius: var(--radius-md); padding: 0.75rem 0.9rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: var(--color-gold); display: flex; align-items: center; gap: 0.65rem; line-height: 1.4;">
                            <i class="fa-solid fa-lock" style="font-size: 1rem; flex-shrink: 0;"></i>
                            <span><strong>Checkout Notice:</strong> Please sign in or register below to proceed to checkout and place your order.</span>
                        </div>
                    ` : ''}

                    <!-- Drawer Tabs -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; background: var(--bg-surface); padding: 0.3rem; border-radius: var(--radius-lg); margin-bottom: 1.25rem; border: 1px solid var(--border-color);">
                        <button type="button" class="btn btn-sm ${tab === 'login' ? 'btn-primary' : 'btn-secondary'}" style="font-size: 0.8rem;" onclick="window.AetherAuth.renderAuthDrawer('login')">
                            <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In
                        </button>
                        <button type="button" class="btn btn-sm ${tab === 'register' ? 'btn-primary' : 'btn-secondary'}" style="font-size: 0.8rem;" onclick="window.AetherAuth.renderAuthDrawer('register')">
                            <i class="fa-solid fa-user-plus"></i> Register
                        </button>
                    </div>

                    <!-- Drawer Error Box -->
                    <div id="drawerAuthNotif" style="display: none; padding: 0.65rem 0.85rem; border-radius: var(--radius-md); font-size: 0.8rem; margin-bottom: 1rem; align-items: center; gap: 0.5rem; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span id="drawerAuthNotifText"></span>
                    </div>

                    ${tab === 'login' ? `
                        <!-- Sign In Form -->
                        <form id="drawerLoginForm" onsubmit="window.AetherAuth.handleDrawerLogin(event)">
                            <div class="drawer-form-group" style="margin-bottom: 1rem;">
                                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.35rem;">Email Address</label>
                                <input type="email" id="drawerLoginEmail" class="auth-form-input" placeholder="alex@aethervoyage.com" required style="width: 100%; padding: 0.65rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary);">
                            </div>
                            <div class="drawer-form-group" style="margin-bottom: 1.25rem;">
                                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.35rem;">Password</label>
                                <input type="password" id="drawerLoginPass" class="auth-form-input" placeholder="••••••••••••" required style="width: 100%; padding: 0.65rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary);">
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem;">
                                <i class="fa-solid fa-right-to-bracket"></i> Sign In to Account
                            </button>
                        </form>
                    ` : `
                        <!-- Register Form -->
                        <form id="drawerRegisterForm" onsubmit="window.AetherAuth.handleDrawerRegister(event)">
                            <div class="drawer-form-group" style="margin-bottom: 0.85rem;">
                                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.35rem;">Full Name</label>
                                <input type="text" id="drawerRegName" class="auth-form-input" placeholder="Alex Morgan" required style="width: 100%; padding: 0.65rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary);">
                            </div>
                            <div class="drawer-form-group" style="margin-bottom: 0.85rem;">
                                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.35rem;">Email Address</label>
                                <input type="email" id="drawerRegEmail" class="auth-form-input" placeholder="alex@aethervoyage.com" required style="width: 100%; padding: 0.65rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary);">
                            </div>
                            <div class="drawer-form-group" style="margin-bottom: 1.25rem;">
                                <label style="display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.35rem;">Password (6+ chars)</label>
                                <input type="password" id="drawerRegPass" class="auth-form-input" placeholder="••••••••••••" required minlength="6" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary);">
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem;">
                                <i class="fa-solid fa-user-check"></i> Complete Registration
                            </button>
                        </form>
                    `}

                    <!-- Social Divider -->
                    <div style="position: relative; text-align: center; margin: 1.25rem 0;">
                        <span style="position: relative; background: var(--bg-card); padding: 0 0.75rem; font-size: 0.72rem; color: var(--text-tertiary); text-transform: uppercase;">or continue with</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.25rem;">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="window.AetherAuth.socialLogin('Google'); window.AetherAuth.closeAuthDrawer();" style="font-size: 0.78rem;">
                            <i class="fa-brands fa-google" style="color: #ea4335;"></i> Google
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="window.AetherAuth.socialLogin('Apple'); window.AetherAuth.closeAuthDrawer();" style="font-size: 0.78rem;">
                            <i class="fa-brands fa-apple"></i> Apple
                        </button>
                    </div>

                    <div style="text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                        <a href="login.html" class="footer-link" style="font-size: 0.78rem; color: var(--color-gold); text-decoration: none;" onclick="window.AetherAuth.closeAuthDrawer();">
                            <i class="fa-solid fa-up-right-from-square"></i> Open Full Page Portal
                        </a>
                    </div>
                </div>
            `;
        },

        handleDrawerLogin(e) {
            e.preventDefault();
            const email = document.getElementById('drawerLoginEmail')?.value;
            const pass = document.getElementById('drawerLoginPass')?.value;
            const res = this.login(email, pass);

            if (res.success) {
                const isCheckout = this.pendingAction === 'checkout';
                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast(isCheckout ? `Welcome back, ${res.user.name}! Opening checkout...` : `Welcome back, ${res.user.name}!`, 'success');
                }
                this.closeAuthDrawer();
                if (isCheckout && window.AetherCheckout) {
                    setTimeout(() => {
                        window.AetherCheckout.open();
                    }, 350);
                }
            } else {
                const notif = document.getElementById('drawerAuthNotif');
                const text = document.getElementById('drawerAuthNotifText');
                if (notif && text) {
                    text.textContent = res.message || 'Invalid credentials.';
                    notif.style.display = 'flex';
                }
            }
        },

        handleDrawerRegister(e) {
            e.preventDefault();
            const name = document.getElementById('drawerRegName')?.value;
            const email = document.getElementById('drawerRegEmail')?.value;
            const pass = document.getElementById('drawerRegPass')?.value;
            const res = this.register(name, email, pass);

            if (res.success) {
                const isCheckout = this.pendingAction === 'checkout';
                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast(isCheckout ? `Account created! Welcome, ${res.user.name}! Opening checkout...` : `Account created! Welcome, ${res.user.name}!`, 'success');
                }
                this.closeAuthDrawer();
                if (isCheckout && window.AetherCheckout) {
                    setTimeout(() => {
                        window.AetherCheckout.open();
                    }, 350);
                }
            } else {
                const notif = document.getElementById('drawerAuthNotif');
                const text = document.getElementById('drawerAuthNotifText');
                if (notif && text) {
                    text.textContent = res.message || 'Registration failed.';
                    notif.style.display = 'flex';
                }
            }
        },

        updateUI() {
            const authBtns = document.querySelectorAll('.header-auth-btn');
            const mobileAuthLinks = document.querySelectorAll('#mobileAuthLink');

            if (this.currentUser) {
                const firstName = (this.currentUser.name || 'Account').split(' ')[0];
                authBtns.forEach(btn => {
                    btn.classList.add('logged-in');
                    btn.setAttribute('title', `Signed in as ${this.currentUser.email} (Click to open account / Sign Out)`);
                    btn.innerHTML = `<i class="fa-solid fa-circle-user"></i> <span>${firstName}</span>`;
                    btn.onclick = (e) => {
                        e.preventDefault();
                        this.openAuthDrawer();
                    };
                });

                mobileAuthLinks.forEach(link => {
                    link.innerHTML = `<i class="fa-solid fa-circle-user"></i> <span>${firstName} (Sign Out)</span>`;
                    link.onclick = (e) => {
                        e.preventDefault();
                        if (confirm(`Signed in as ${this.currentUser.name}. Sign out now?`)) {
                            this.logout();
                        }
                    };
                });
            } else {
                authBtns.forEach(btn => {
                    btn.classList.remove('logged-in');
                    btn.setAttribute('title', 'Customer Account Sign In');
                    btn.innerHTML = `<i class="fa-regular fa-user"></i> <span>Sign In</span>`;
                    btn.onclick = (e) => {
                        e.preventDefault();
                        this.openAuthDrawer('login');
                    };
                });

                mobileAuthLinks.forEach(link => {
                    link.innerHTML = `<i class="fa-regular fa-user"></i> <span>Sign In / Register</span>`;
                    link.onclick = (e) => {
                        e.preventDefault();
                        this.openAuthDrawer('login');
                    };
                });
            }
        },

        bindEvents() {
            const closeBtn = document.getElementById('authDrawerClose');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeAuthDrawer());
            }

            const backdrop = document.getElementById('drawerBackdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    const authDrawer = document.getElementById('authDrawer');
                    if (authDrawer && authDrawer.classList.contains('open')) {
                        this.closeAuthDrawer();
                    }
                });
            }

            // Sync across tabs
            window.addEventListener('storage', (e) => {
                if (e.key === USER_KEY) {
                    try {
                        this.currentUser = e.newValue ? JSON.parse(e.newValue) : null;
                    } catch (err) {
                        this.currentUser = null;
                    }
                    this.updateUI();
                }
            });
        }
    };

    window.AetherAuth = AetherAuth;

    document.addEventListener('DOMContentLoaded', () => {
        AetherAuth.init();

        // If page has ?action=checkout and user is logged in, automatically open checkout
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'checkout') {
            if (AetherAuth.currentUser) {
                if (window.AetherCheckout && window.AetherCart && window.AetherCart.cart.length > 0) {
                    setTimeout(() => {
                        window.AetherCheckout.open();
                    }, 400);
                }
            } else {
                // Not logged in: prompt login
                setTimeout(() => {
                    AetherAuth.pendingAction = 'checkout';
                    AetherAuth.openAuthDrawer('login');
                }, 400);
            }
        }
    });
})();
