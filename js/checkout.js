/**
 * Aether Voyage - Multi-Step Luxury Checkout & Payment Engine
 * Features Country-Adaptive Payment Methods:
 * - Common Method 1: Cash on Delivery (COD) [All Countries]
 * - Common Method 3: Credit / Debit Card [All Countries]
 * - Dynamic Method 2: Country-Specific Channel (India: UPI, USA: PayPal & Venmo,
 *   Germany: Klarna/Sofort, UAE: Tabby BNPL, Singapore: PayNow, Switzerland: TWINT,
 *   Japan: PayPay, Australia: Afterpay, Canada: Interac e-Transfer, UK: PayPal/Apple Pay, etc.)
 */

(function () {
    'use strict';

    const COUNTRY_PAYMENT_CONFIGS = {
        'India': {
            id: 'upi',
            title: 'UPI / Instant VPA Transfer',
            subtitle: 'GPay, PhonePe, Paytm, BHIM & CRED',
            icon: 'fa-solid fa-mobile-screen-button',
            badge: 'INDIA #1 PREFERRED',
            currency: 'INR'
        },
        'United States': {
            id: 'paypal',
            title: 'PayPal & Venmo',
            subtitle: 'One-Touch PayPal, Venmo & Pay in 4',
            icon: 'fa-brands fa-paypal',
            badge: 'USA FAVORITE',
            currency: 'USD'
        },
        'United Kingdom': {
            id: 'paypal',
            title: 'PayPal & Apple Pay',
            subtitle: 'UK Instant Express & Faster Payments',
            icon: 'fa-brands fa-paypal',
            badge: 'UK PREFERRED',
            currency: 'GBP'
        },
        'Germany': {
            id: 'klarna',
            title: 'Klarna & Sofort Banking',
            subtitle: 'Pay in 30 Days, 3x Split & Sofort IBAN',
            icon: 'fa-solid fa-receipt',
            badge: 'DEUTSCHLAND FAVORIT',
            currency: 'EUR'
        },
        'France': {
            id: 'paypal',
            title: 'PayPal & Carte Bancaire',
            subtitle: 'Paiement sécurisé en 4x sans frais',
            icon: 'fa-brands fa-paypal',
            badge: 'FRANCE RECOMMANDÉ',
            currency: 'EUR'
        },
        'Switzerland': {
            id: 'twint',
            title: 'TWINT & PostFinance',
            subtitle: 'Swiss Instant Mobile & Account Transfer',
            icon: 'fa-solid fa-mobile-screen-button',
            badge: 'SWISS EXCLUSIVE',
            currency: 'CHF'
        },
        'United Arab Emirates': {
            id: 'tabby',
            title: 'Tabby / Tamara (BNPL)',
            subtitle: 'Split in 4 Interest-Free Monthly Payments',
            icon: 'fa-solid fa-wallet',
            badge: 'UAE POPULAR',
            currency: 'AED'
        },
        'Singapore': {
            id: 'paynow',
            title: 'PayNow & GrabPay',
            subtitle: 'Instant UEN Transfer, DBS PayLah! & GrabPay',
            icon: 'fa-solid fa-mobile-screen-button',
            badge: 'SINGAPORE INSTANT',
            currency: 'SGD'
        },
        'Japan': {
            id: 'paypay',
            title: 'PayPay & LINE Pay',
            subtitle: 'Japan Smartphone Pay & Direct Mobile Settle',
            icon: 'fa-solid fa-wallet',
            badge: 'JAPAN DIRECT',
            currency: 'JPY'
        },
        'Australia': {
            id: 'afterpay',
            title: 'Afterpay & PayPal',
            subtitle: 'Pay in 4 Fortnightly Interest-Free Splits',
            icon: 'fa-solid fa-layer-group',
            badge: 'AUSSIE FAVORITE',
            currency: 'AUD'
        },
        'Canada': {
            id: 'interac',
            title: 'Interac e-Transfer & PayPal',
            subtitle: 'Direct Canadian Bank e-Transfer & One-Touch',
            icon: 'fa-solid fa-building-columns',
            badge: 'CANADA DIRECT',
            currency: 'CAD'
        },
        'Italy': {
            id: 'paypal',
            title: 'PayPal & Satispay',
            subtitle: 'Pagamento rapido e protetto in 3 rate',
            icon: 'fa-brands fa-paypal',
            badge: 'ITALIA PROTETTO',
            currency: 'EUR'
        },
        'Monaco': {
            id: 'paypal',
            title: 'PayPal Express',
            subtitle: 'Fast, secure checkout & instant wire',
            icon: 'fa-brands fa-paypal',
            badge: 'MONACO',
            currency: 'EUR'
        }
    };

    const AetherCheckout = {
        currentStep: 1, // 1: Address, 2: Payment, 3: Review, 4: Success
        shippingAddress: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: 'India',
            shippingMethod: 'white-glove'
        },
        paymentMethod: 'upi', // Default to country method for India ('upi'), or 'cod', 'card', etc.
        paymentDetails: {
            vpa: '',
            cardNumber: '',
            cardName: '',
            cardExpiry: '',
            cardCvv: '',
            paypalEmail: '',
            klarnaIban: '',
            tabbyPhone: '',
            paynowMobile: '',
            twintPhone: '',
            paypayId: '',
            afterpayEmail: '',
            interacEmail: ''
        },
        currentOrder: null,

        init() {
            this.bindEvents();
        },

        getAvailableCountries() {
            return Object.keys(COUNTRY_PAYMENT_CONFIGS);
        },

        getCountryConfig(country) {
            const key = country || this.shippingAddress.country || 'India';
            return COUNTRY_PAYMENT_CONFIGS[key] || {
                id: 'paypal',
                title: 'PayPal International',
                subtitle: 'Global One-Touch & Buyer Protection',
                icon: 'fa-brands fa-paypal',
                badge: 'GLOBAL PREFERRED',
                currency: 'USD',
                flag: '🌐'
            };
        },

        changeCountry(newCountry) {
            this.shippingAddress.country = newCountry;
            const config = this.getCountryConfig(newCountry);
            // If the user had the 2nd (country-specific) method selected, automatically update paymentMethod
            if (this.paymentMethod !== 'cod' && this.paymentMethod !== 'card') {
                this.paymentMethod = config.id;
            }
            this.render();
            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast(`Updated destination: ${newCountry} (${config.title})`, 'info', 2500);
            }
        },

        open() {
            const cart = window.AetherCart ? window.AetherCart.cart : [];
            if (cart.length === 0) {
                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast('Your Luggage Cart is empty. Please select a product first.', 'warning');
                }
                return;
            }

            // Close cart drawer if open
            if (window.AetherCart) window.AetherCart.closeCartDrawer();

            // Close cart drawer if open
            if (window.AetherCart) window.AetherCart.closeCartDrawer();

            // Default country if not selected
            if (!this.shippingAddress.country) {
                this.shippingAddress.country = 'United States';
            }

            // Pre-fill user details from authenticated profile
            if (currentUser) {
                if (!this.shippingAddress.fullName && currentUser.name) {
                    this.shippingAddress.fullName = currentUser.name;
                }
                if (!this.shippingAddress.email && currentUser.email) {
                    this.shippingAddress.email = currentUser.email;
                }
            }

            this.currentStep = 1;
            const modal = document.getElementById('checkoutModal');
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
            this.render();
        },

        close() {
            const modal = document.getElementById('checkoutModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        },

        goToStep(step) {
            // If navigating backward (e.g., Step 3 to Step 2 "Back to Payment", or Step 2 to Step 1 "Back to Address"), allow immediately
            if (step < this.currentStep) {
                this.currentStep = step;
                this.render();
                return;
            }

            // Moving forward from Step 1 to Step 2
            if (this.currentStep === 1 && step >= 2) {
                if (!this.validateAddressForm()) return;
                const config = this.getCountryConfig(this.shippingAddress.country);
                if (this.paymentMethod !== 'cod' && this.paymentMethod !== 'card') {
                    this.paymentMethod = config.id;
                }
            }

            // Moving forward from Step 2 to Step 3
            if (this.currentStep === 2 && step >= 3) {
                if (!this.validatePaymentForm()) return;
            }

            this.currentStep = step;
            this.render();
        },

        validateAddressForm() {
            const name = document.getElementById('shipFullName')?.value.trim();
            const email = document.getElementById('shipEmailAddress')?.value.trim();
            const phone = document.getElementById('shipPhoneNumber')?.value.trim();
            const address = document.getElementById('shipStreetAddress')?.value.trim();
            const city = document.getElementById('shipCityName')?.value.trim();
            const zip = document.getElementById('shipPostalCode')?.value.trim();
            const country = document.getElementById('shipCountrySelect')?.value;

            if (!name || !email || !address || !city) {
                if (window.AetherApp && window.AetherApp.showToast) {
                    window.AetherApp.showToast('Please complete all required address fields', 'warning');
                }
                return false;
            }

            this.shippingAddress.fullName = name;
            this.shippingAddress.email = email;
            this.shippingAddress.phone = phone || '+91 98765 43210';
            this.shippingAddress.address = address;
            this.shippingAddress.city = city;
            this.shippingAddress.zip = zip || '400001';
            this.shippingAddress.country = country || 'India';

            return true;
        },

        validatePaymentForm() {
            this.clearAllPaymentErrors();
            let hasError = false;
            let firstErrorMsg = '';
            let firstErrorField = null;

            if (this.paymentMethod === 'card') {
                const numInput = document.getElementById('cardNumberInput');
                const nameInput = document.getElementById('cardNameInput');
                const expInput = document.getElementById('cardExpInput');
                const cvvInput = document.getElementById('cardCvvInput');

                const numVal = numInput ? numInput.value.trim() : (this.paymentDetails.cardNumber || '');
                const nameVal = nameInput ? nameInput.value.trim() : (this.paymentDetails.cardName || '');
                const expVal = expInput ? expInput.value.trim() : (this.paymentDetails.cardExpiry || '');
                const cvvVal = cvvInput ? cvvInput.value.trim() : (this.paymentDetails.cardCvv || '');

                // 1. Validate Card Number (digits only, Luhn algorithm check, standard 16 digits or 15 for Amex)
                const cleanDigits = numVal.replace(/\D/g, '');
                const isAmex = /^3[47]/.test(cleanDigits);
                const expectedDigits = isAmex ? 15 : 16;
                if (!numVal || !cleanDigits) {
                    this.setFieldError('cardNumber', 'Please enter your card number.');
                    if (!firstErrorField) { firstErrorField = numInput; firstErrorMsg = 'Please enter your card number.'; }
                    hasError = true;
                } else if (cleanDigits.length < (isAmex ? 15 : 13)) {
                    this.setFieldError('cardNumber', `Card number must be ${expectedDigits} digits (currently ${cleanDigits.length} digits).`);
                    if (!firstErrorField) { firstErrorField = numInput; firstErrorMsg = `Card number must be ${expectedDigits} digits.`; }
                    hasError = true;
                } else if (!this.validateLuhn(numVal)) {
                    if (cleanDigits.length < expectedDigits) {
                        this.setFieldError('cardNumber', `Card number appears incomplete (${cleanDigits.length} of ${expectedDigits} digits). Please enter all ${expectedDigits} digits.`);
                        if (!firstErrorField) { firstErrorField = numInput; firstErrorMsg = `Card number incomplete (${cleanDigits.length}/${expectedDigits} digits).`; }
                    } else {
                        this.setFieldError('cardNumber', 'Invalid card number. Please check the digits and try again.');
                        if (!firstErrorField) { firstErrorField = numInput; firstErrorMsg = 'Invalid card number. Please check digits.'; }
                    }
                    hasError = true;
                }

                // 2. Validate Cardholder Name
                if (!nameVal) {
                    this.setFieldError('cardName', 'Please enter cardholder full name.');
                    if (!firstErrorField) { firstErrorField = nameInput; firstErrorMsg = 'Please enter cardholder name.'; }
                    hasError = true;
                }

                // 3. Validate Expiry Date (MM/YY format, digits only, month 01-12, future date)
                const expResult = this.validateExpiryDate(expVal);
                if (!expResult.valid) {
                    this.setFieldError('cardExp', expResult.error);
                    if (!firstErrorField) { firstErrorField = expInput; firstErrorMsg = expResult.error; }
                    hasError = true;
                }

                // 4. Validate Security CVV (digits only, 3 or 4 digits)
                const cvvResult = this.validateCvvCode(cvvVal, numVal);
                if (!cvvResult.valid) {
                    this.setFieldError('cardCvv', cvvResult.error);
                    if (!firstErrorField) { firstErrorField = cvvInput; firstErrorMsg = cvvResult.error; }
                    hasError = true;
                }

                if (hasError) {
                    if (firstErrorField && typeof firstErrorField.focus === 'function') {
                        firstErrorField.focus();
                    }
                    if (window.AetherApp && window.AetherApp.showToast) {
                        window.AetherApp.showToast(firstErrorMsg || 'Please correct the highlighted card details.', 'warning');
                    }
                    return false;
                }

                // Details are strictly validated
                this.paymentDetails.cardNumber = numVal;
                this.paymentDetails.cardName = nameVal;
                this.paymentDetails.cardExpiry = expVal;
                this.paymentDetails.cardCvv = cvvVal;
                return true;
            } else if (this.paymentMethod === 'upi') {
                const vpa = document.getElementById('upiVpaInput')?.value.trim();
                this.paymentDetails.vpa = vpa || 'voyager@okhdfcbank';
            } else if (this.paymentMethod === 'paypal') {
                const paypalEmail = document.getElementById('paypalEmailInput')?.value.trim();
                this.paymentDetails.paypalEmail = paypalEmail || this.shippingAddress.email || 'voyager@paypal.com';
            } else if (this.paymentMethod === 'klarna') {
                const iban = document.getElementById('klarnaIbanInput')?.value.trim();
                this.paymentDetails.klarnaIban = iban || 'DE89 3704 0044 0532 0130 00';
            } else if (this.paymentMethod === 'tabby') {
                const phone = document.getElementById('tabbyPhoneInput')?.value.trim();
                this.paymentDetails.tabbyPhone = phone || '+971 50 123 4567';
            } else if (this.paymentMethod === 'paynow') {
                const mobile = document.getElementById('paynowMobileInput')?.value.trim();
                this.paymentDetails.paynowMobile = mobile || '+65 9123 4567';
            } else if (this.paymentMethod === 'twint') {
                const phone = document.getElementById('twintPhoneInput')?.value.trim();
                this.paymentDetails.twintPhone = phone || '+41 79 123 45 67';
            } else if (this.paymentMethod === 'paypay') {
                const paypayId = document.getElementById('paypayIdInput')?.value.trim();
                this.paymentDetails.paypayId = paypayId || '090-1234-5678';
            } else if (this.paymentMethod === 'afterpay') {
                const afterpayEmail = document.getElementById('afterpayEmailInput')?.value.trim();
                this.paymentDetails.afterpayEmail = afterpayEmail || this.shippingAddress.email || 'voyager@afterpay.au';
            } else if (this.paymentMethod === 'interac') {
                const interacEmail = document.getElementById('interacEmailInput')?.value.trim();
                this.paymentDetails.interacEmail = interacEmail || this.shippingAddress.email || 'voyager@interac.ca';
            }
            return true;
        },


        selectPaymentMethod(method) {
            this.paymentMethod = method;
            this.render();
        },

        getPaymentLabel() {
            const config = this.getCountryConfig(this.shippingAddress.country);
            switch (this.paymentMethod) {
                case 'cod':
                    return '<i class="fa-solid fa-hand-holding-dollar"></i> Cash on Delivery (Pay at doorstep after unboxing)';
                case 'card':
                    return `<i class="fa-solid fa-credit-card"></i> Credit / Debit Card (${this.paymentDetails.cardNumber || '•••• 8820'})`;
                case 'upi':
                    return `<i class="fa-solid fa-mobile-screen-button"></i> UPI Transfer (${this.paymentDetails.vpa || 'VPA Verified'})`;
                case 'paypal':
                    return `<i class="fa-brands fa-paypal"></i> PayPal / Venmo Express (${this.paymentDetails.paypalEmail || 'One-Touch Authorized'})`;
                case 'klarna':
                    return `<i class="fa-solid fa-receipt"></i> Klarna & Sofort (${this.paymentDetails.klarnaIban ? 'IBAN: ' + this.paymentDetails.klarnaIban.substring(0, 8) + '...' : 'Pay in 30 Days'})`;
                case 'tabby':
                    return `<i class="fa-solid fa-wallet"></i> Tabby / Tamara (4 Monthly Splits &bull; ${this.paymentDetails.tabbyPhone || 'UAE Mobile'})`;
                case 'paynow':
                    return `<i class="fa-solid fa-mobile-screen-button"></i> PayNow Singapore (UEN: 202410888K &bull; ${this.paymentDetails.paynowMobile || 'Fast Transfer'})`;
                case 'twint':
                    return `<i class="fa-solid fa-mobile-screen-button"></i> TWINT Switzerland (${this.paymentDetails.twintPhone || 'Instant Mobile'})`;
                case 'paypay':
                    return `<i class="fa-solid fa-wallet"></i> PayPay & LINE Pay Japan (${this.paymentDetails.paypayId || 'Mobile App'})`;
                case 'afterpay':
                    return `<i class="fa-solid fa-layer-group"></i> Afterpay Australia (4 Fortnightly Splits)`;
                case 'interac':
                    return `<i class="fa-solid fa-building-columns"></i> Interac e-Transfer Canada (${this.paymentDetails.interacEmail || 'Direct Bank Autodeposit'})`;
                default:
                    return `<i class="${config.icon}"></i> ${config.title}`;
            }
        },

        getReceiptPaymentLabel(order) {
            switch (order.paymentMethod) {
                case 'cod':
                    return 'Cash on Delivery (Doorstep inspection & settlement)';
                case 'card':
                    return `Credit Card (${this.paymentDetails.cardNumber || '•••• 8820'} &bull; 256-Bit Authorized)`;
                case 'upi':
                    return `UPI Instant (${this.paymentDetails.vpa || 'voyager@okhdfcbank'} &bull; Verified VPA)`;
                case 'paypal':
                    return `PayPal Express (${this.paymentDetails.paypalEmail || 'voyager@paypal.com'} &bull; Buyer Protection)`;
                case 'klarna':
                    return `Klarna Rechnung / Sofort (30 Days Zero-Interest Invoice)`;
                case 'tabby':
                    return `Tabby UAE (4x Monthly Installments &bull; 0% Interest)`;
                case 'paynow':
                    return `PayNow Singapore (UEN: 202410888K &bull; Fast Clearing)`;
                case 'twint':
                    return `TWINT Switzerland (CHF Instant Mobile Settlement)`;
                case 'paypay':
                    return `PayPay Japan (Smartphone App Authorization)`;
                case 'afterpay':
                    return `Afterpay Australia (4 Fortnightly Payments)`;
                case 'interac':
                    return `Interac e-Transfer (Direct Canadian Bank Autodeposit)`;
                default:
                    return `${order.paymentMethod.toUpperCase()} Authorized`;
            }
        },

        placeOrder() {
            const currentUser = window.AetherAuth ? window.AetherAuth.currentUser : null;

            const cart = window.AetherCart ? window.AetherCart.cart : [];
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = (window.AetherCart && window.AetherCart.appliedPromo) ? subtotal * 0.1 : 0;
            const shipping = 0; // Complimentary White-Glove
            const finalTotal = subtotal - discount + shipping;

            const orderId = `AV-${Math.floor(100000 + Math.random() * 900000)}`;
            const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            const newOrder = {
                id: orderId,
                date: dateStr,
                items: [...cart],
                subtotal: subtotal,
                discount: discount,
                total: window.AetherTheme ? window.AetherTheme.formatPrice(finalTotal) : `$${finalTotal}`,
                rawTotal: finalTotal,
                address: { ...this.shippingAddress },
                paymentMethod: this.paymentMethod,
                status: 'Confirmed — Express Delivery',
                warrantyCertificateId: `CERT-100YR-${Math.floor(1000000 + Math.random() * 9000000)}`
            };

            this.currentOrder = newOrder;

            // Save to user history if logged in
            if (window.AetherAuth && window.AetherAuth.currentUser) {
                if (!Array.isArray(window.AetherAuth.currentUser.orders)) {
                    window.AetherAuth.currentUser.orders = [];
                }
                window.AetherAuth.currentUser.orders.unshift({
                    id: orderId,
                    date: dateStr,
                    total: newOrder.total,
                    status: 'Dispatched'
                });

                if (!Array.isArray(window.AetherAuth.currentUser.purchasedItems)) {
                    window.AetherAuth.currentUser.purchasedItems = [];
                }
                cart.forEach(item => {
                    window.AetherAuth.currentUser.purchasedItems.unshift({
                        id: `PI-${Math.floor(1000 + Math.random() * 9000)}`,
                        orderId: orderId,
                        model: item.name,
                        brand: item.brand || 'Aether Voyage',
                        category: item.category || 'Travel Luggage',
                        image: item.image || item.baseImage || 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=400&q=80',
                        purchaseDate: new Date().toISOString().split('T')[0],
                        price: item.price,
                        materials: item.material || 'Aeronautical Aluminum & Tuscan Leather Trims',
                        specs: (Array.isArray(item.specs) ? item.specs.slice(0, 2).join(' • ') : 'Laser-Calibrated Shell • Hinomoto 360° Whisper Wheels'),
                        serial: `AETH-${Math.floor(10000 + Math.random() * 90000)}`,
                        nfc: `NFC-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
                        color: 'Anodized Platinum'
                    });
                });

                window.AetherAuth.saveUser(window.AetherAuth.currentUser);
            }

            // Clear Cart
            if (window.AetherCart) {
                window.AetherCart.clearCart();
            }

            this.currentStep = 4;
            this.render();

            if (window.AetherApp && window.AetherApp.showToast) {
                window.AetherApp.showToast(`Order ${orderId} authorized & confirmed!`, 'success', 5000);
            }
        },

        render() {
            const container = document.getElementById('checkoutDialogContent');
            if (!container) return;

            const cart = window.AetherCart ? window.AetherCart.cart : [];
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = (window.AetherCart && window.AetherCart.appliedPromo) ? subtotal * 0.1 : 0;
            const finalTotal = Math.max(0, subtotal - discount);
            const formatPrice = (amt) => window.AetherTheme ? window.AetherTheme.formatPrice(amt) : `$${amt}`;

            // Stepper Header
            let stepperHTML = `
                <div class="checkout-stepper-row">
                    <div class="checkout-step-item ${this.currentStep >= 1 ? 'active' : ''} ${this.currentStep > 1 ? 'completed' : ''}" style="${this.currentStep > 1 ? 'cursor: pointer;' : ''}" onclick="${this.currentStep > 1 ? 'window.AetherCheckout.goToStep(1);' : ''}">
                        <span class="step-num"><i class="${this.currentStep > 1 ? 'fa-solid fa-check' : 'fa-solid fa-location-dot'}"></i></span>
                        <span class="step-text">1. Address</span>
                    </div>
                    <div class="step-connector ${this.currentStep >= 2 ? 'active' : ''}"></div>
                    <div class="checkout-step-item ${this.currentStep >= 2 ? 'active' : ''} ${this.currentStep > 2 ? 'completed' : ''}" style="${this.currentStep > 2 ? 'cursor: pointer;' : ''}" onclick="${this.currentStep > 2 ? 'window.AetherCheckout.goToStep(2);' : ''}">
                        <span class="step-num"><i class="${this.currentStep > 2 ? 'fa-solid fa-check' : 'fa-solid fa-credit-card'}"></i></span>
                        <span class="step-text">2. Payment</span>
                    </div>
                    <div class="step-connector ${this.currentStep >= 3 ? 'active' : ''}"></div>
                    <div class="checkout-step-item ${this.currentStep >= 3 ? 'active' : ''} ${this.currentStep === 4 ? 'completed' : ''}">
                        <span class="step-num"><i class="${this.currentStep === 4 ? 'fa-solid fa-check' : 'fa-solid fa-file-invoice-dollar'}"></i></span>
                        <span class="step-text">3. Review</span>
                    </div>
                </div>
            `;

            if (this.currentStep === 4) {
                stepperHTML = '';
            }

            let bodyHTML = '';

            // STEP 1: Address Form
            if (this.currentStep === 1) {
                bodyHTML = `
                    <div class="checkout-step-body">
                        <div class="checkout-header-group">
                            <span class="checkout-badge-gold"><i class="fa-solid fa-shield-halved"></i> Free Express Delivery</span>
                            <h2 class="checkout-main-title">Destination & Delivery Address</h2>
                            <p class="checkout-subtitle">Enter your delivery address to calculate shipping and view local payment options.</p>
                        </div>

                        <form id="stepAddressForm" onsubmit="event.preventDefault(); window.AetherCheckout.goToStep(2);" class="checkout-grid-form">
                            <div class="form-row-2">
                                <div class="auth-form-group">
                                    <label for="shipFullName">Recipient Full Name *</label>
                                    <input type="text" id="shipFullName" value="${this.shippingAddress.fullName}" placeholder="Alex Morgan" required>
                                </div>
                                <div class="auth-form-group">
                                    <label for="shipEmailAddress">Contact Email *</label>
                                    <input type="email" id="shipEmailAddress" value="${this.shippingAddress.email}" placeholder="alex@example.com" required>
                                </div>
                            </div>

                            <div class="form-row-2">
                                <div class="auth-form-group">
                                    <label for="shipPhoneNumber">Mobile Phone (For Courier Call) *</label>
                                    <input type="tel" id="shipPhoneNumber" value="${this.shippingAddress.phone || '+91 98765 43210'}" placeholder="+91 98765 43210" required>
                                </div>
                                <div class="auth-form-group">
                                    <label for="shipCountrySelect">Country / Destination *</label>
                                    <select id="shipCountrySelect" class="checkout-select" required>
                                        <option value="India" ${this.shippingAddress.country === 'India' ? 'selected' : ''}>India (UPI, GPay, PhonePe)</option>
                                        <option value="United States" ${this.shippingAddress.country === 'United States' ? 'selected' : ''}>United States (PayPal, Venmo)</option>
                                        <option value="United Kingdom" ${this.shippingAddress.country === 'United Kingdom' ? 'selected' : ''}>United Kingdom (PayPal, Apple Pay)</option>
                                        <option value="Germany" ${this.shippingAddress.country === 'Germany' ? 'selected' : ''}>Germany (Klarna, Sofort)</option>
                                        <option value="France" ${this.shippingAddress.country === 'France' ? 'selected' : ''}>France (PayPal, CB)</option>
                                        <option value="Switzerland" ${this.shippingAddress.country === 'Switzerland' ? 'selected' : ''}>Switzerland (TWINT, PostFinance)</option>
                                        <option value="United Arab Emirates" ${this.shippingAddress.country === 'United Arab Emirates' ? 'selected' : ''}>United Arab Emirates (Tabby, Tamara)</option>
                                        <option value="Singapore" ${this.shippingAddress.country === 'Singapore' ? 'selected' : ''}>Singapore (PayNow, GrabPay)</option>
                                        <option value="Japan" ${this.shippingAddress.country === 'Japan' ? 'selected' : ''}>Japan (PayPay, LINE Pay)</option>
                                        <option value="Australia" ${this.shippingAddress.country === 'Australia' ? 'selected' : ''}>Australia (Afterpay, PayPal)</option>
                                        <option value="Canada" ${this.shippingAddress.country === 'Canada' ? 'selected' : ''}>Canada (Interac e-Transfer)</option>
                                        <option value="Italy" ${this.shippingAddress.country === 'Italy' ? 'selected' : ''}>Italy (PayPal, Satispay)</option>
                                        <option value="Monaco" ${this.shippingAddress.country === 'Monaco' ? 'selected' : ''}>Monaco (PayPal VIP)</option>
                                    </select>
                                </div>
                            </div>

                            <div class="auth-form-group">
                                <label for="shipStreetAddress">Street Address / Suite / Residence *</label>
                                <input type="text" id="shipStreetAddress" value="${this.shippingAddress.address || '18 Kensington Palace Gardens, Suite 4A'}" placeholder="18 Kensington Palace Gardens" required>
                            </div>

                            <div class="form-row-2">
                                <div class="auth-form-group">
                                    <label for="shipCityName">City / Metropolitan Hub *</label>
                                    <input type="text" id="shipCityName" value="${this.shippingAddress.city || 'Mumbai'}" placeholder="Mumbai" required>
                                </div>
                                <div class="auth-form-group">
                                    <label for="shipPostalCode">Postal / ZIP Code *</label>
                                    <input type="text" id="shipPostalCode" value="${this.shippingAddress.zip || '400001'}" placeholder="400001" required>
                                </div>
                            </div>

                            <!-- Delivery Tier Card -->
                            <div class="shipping-tier-card selected">
                                <div class="tier-radio-group">
                                    <i class="fa-solid fa-circle-check" style="color: var(--color-gold); font-size: 1.1rem;"></i>
                                    <div>
                                        <h4 class="tier-title">Free Express Courier Delivery</h4>
                                        <p class="tier-desc">Fast, secure air courier shipping directly to your door.</p>
                                    </div>
                                </div>
                                <span class="tier-price-tag">INCLUDED</span>
                            </div>

                            <div class="checkout-footer-row">
                                <button type="button" class="btn btn-outline" onclick="window.AetherCheckout.close();">Cancel</button>
                                <button type="submit" class="btn btn-primary btn-checkout-action">
                                    <span>Continue to Payment Method</span> <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                `;
            }

            // STEP 2: Payment Methods
            else if (this.currentStep === 2) {
                const countryConfig = this.getCountryConfig(this.shippingAddress.country);
                const isCountryMethodActive = (this.paymentMethod !== 'cod' && this.paymentMethod !== 'card');

                bodyHTML = `
                    <div class="checkout-step-body">
                        <div class="checkout-header-group">
                            <span class="checkout-badge-gold"><i class="fa-solid fa-lock"></i> 256-Bit Encrypted Checkout</span>
                            <h2 class="checkout-main-title">Select Payment Method</h2>
                            <p class="checkout-subtitle">COD and Card are universal worldwide. The middle method adapts dynamically to your destination.</p>
                        </div>

                        <!-- Destination Country Indicator with Quick-Switch Dropdown -->
                        <div class="checkout-country-indicator">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--color-gold-glow); border: 1px solid var(--border-gold-subtle); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i class="fa-solid fa-earth-americas" style="color: var(--color-gold); font-size: 1.15rem;"></i>
                                </div>
                                <div>
                                    <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-gold); font-weight: 700;">Destination Country</div>
                                    <div style="font-size: 0.98rem; font-weight: 800; color: var(--text-primary);">${this.shippingAddress.country}</div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.6rem;">
                                <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">Change Country:</span>
                                <select class="checkout-country-mini-select" id="checkoutMiniCountrySelect" onchange="window.AetherCheckout.changeCountry(this.value)">
                                    ${this.getAvailableCountries().map(c => `
                                        <option value="${c}" ${this.shippingAddress.country === c ? 'selected' : ''}>${c}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>

                        <!-- 3 Payment Method Tabs -->
                        <div class="payment-options-grid">
                            <!-- Option 1: Cash on Delivery (Universal) -->
                            <div class="payment-card-tile ${this.paymentMethod === 'cod' ? 'active' : ''}" onclick="window.AetherCheckout.selectPaymentMethod('cod');">
                                <div class="payment-card-header">
                                    <div class="payment-icon-box"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                                            <h4 class="payment-option-name">Cash on Delivery (COD)</h4>
                                            <span class="badge-cod-active" style="margin: 0; padding: 0.15rem 0.45rem; font-size: 0.65rem;">UNIVERSAL</span>
                                        </div>
                                        <span class="payment-option-sub">Pay at doorstep after unboxing inspection</span>
                                    </div>
                                </div>
                                <div class="custom-radio ${this.paymentMethod === 'cod' ? 'checked' : ''}"></div>
                            </div>

                            <!-- Option 2: Dynamic Country-Specific Method -->
                            <div class="payment-card-tile ${isCountryMethodActive ? 'active' : ''}" onclick="window.AetherCheckout.selectPaymentMethod('${countryConfig.id}');">
                                <div class="payment-card-header">
                                    <div class="payment-icon-box"><i class="${countryConfig.icon}"></i></div>
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                                            <h4 class="payment-option-name">${countryConfig.title}</h4>
                                            <span class="payment-country-badge">${countryConfig.badge}</span>
                                        </div>
                                        <span class="payment-option-sub">${countryConfig.subtitle}</span>
                                    </div>
                                </div>
                                <div class="custom-radio ${isCountryMethodActive ? 'checked' : ''}"></div>
                            </div>

                            <!-- Option 3: Credit / Debit Card (Universal) -->
                            <div class="payment-card-tile ${this.paymentMethod === 'card' ? 'active' : ''}" onclick="window.AetherCheckout.selectPaymentMethod('card');">
                                <div class="payment-card-header">
                                    <div class="payment-icon-box"><i class="fa-solid fa-credit-card"></i></div>
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                                            <h4 class="payment-option-name">Credit / Debit Card</h4>
                                            <span class="payment-country-badge" style="background: rgba(255,255,255,0.06); color: var(--text-secondary); border-color: var(--border-color);">GLOBAL</span>
                                        </div>
                                        <span class="payment-option-sub">Visa, Mastercard & Amex Centurion</span>
                                    </div>
                                </div>
                                <div class="custom-radio ${this.paymentMethod === 'card' ? 'checked' : ''}"></div>
                            </div>
                        </div>

                        <!-- Dynamic Payment Sub-Panel -->
                        <div class="payment-details-panel">
                            ${this.renderPaymentMethodDetails(finalTotal, formatPrice)}
                        </div>

                        <div class="checkout-footer-row">
                            <button type="button" class="btn btn-outline" onclick="window.AetherCheckout.goToStep(1);">
                                <i class="fa-solid fa-arrow-left"></i> <span>Back to Address</span>
                            </button>
                            <button type="button" class="btn btn-primary btn-checkout-action" onclick="window.AetherCheckout.goToStep(3);">
                                <span>Continue to Order Review</span> <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                `;
            }

            // STEP 3: Order Review & Confirmation
            else if (this.currentStep === 3) {
                const itemsListHTML = cart.map(item => `
                    <div class="review-item-row">
                        <img src="${item.image}" alt="${item.name}" class="review-item-thumb">
                        <div class="review-item-info">
                            <span class="review-item-brand">${item.brand}</span>
                            <h5 class="review-item-title">${item.name}</h5>
                            <span class="review-item-qty">Qty: ${item.quantity}</span>
                        </div>
                        <span class="review-item-price">${formatPrice(item.price * item.quantity)}</span>
                    </div>
                `).join('');

                bodyHTML = `
                    <div class="checkout-step-body">
                        <div class="checkout-header-group">
                            <span class="checkout-badge-gold"><i class="fa-solid fa-check"></i> Order Summary</span>
                            <h2 class="checkout-main-title">Review & Confirm Your Order</h2>
                            <p class="checkout-subtitle">Verify your order details, destination country, and payment method.</p>
                        </div>

                        <div class="order-review-grid">
                            <!-- Left: Cart Items -->
                            <div class="review-items-container">
                                <h4 class="review-section-heading">Order Items (${cart.length})</h4>
                                <div class="review-items-list">
                                    ${itemsListHTML}
                                </div>

                                <!-- 100-Year Warranty Certificate Banner -->
                                <div class="warranty-cert-banner">
                                    <div class="cert-icon-col"><i class="fa-solid fa-certificate"></i></div>
                                    <div>
                                        <h5>100-Year Digital Warranty Certificate</h5>
                                        <p>Each case will be registered to your VIP account with permanent tamper-proof provenance.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Summary Box -->
                            <div class="review-summary-card">
                                <h4 class="review-section-heading">Dispatch Summary</h4>
                                
                                <div class="summary-line-item">
                                    <span>Subtotal</span>
                                    <span>${formatPrice(subtotal)}</span>
                                </div>
                                ${discount > 0 ? `
                                <div class="summary-line-item" style="color: #10b981;">
                                    <span>VIP Member Discount</span>
                                    <span>-${formatPrice(discount)}</span>
                                </div>
                                ` : ''}
                                <div class="summary-line-item">
                                    <span>Express Courier Delivery</span>
                                    <span style="color: var(--color-gold); font-weight: 700;">FREE</span>
                                </div>

                                <div class="summary-total-divider"></div>
                                
                                <div class="summary-final-total-row">
                                    <span>Grand Total</span>
                                    <span class="final-price">${formatPrice(finalTotal)}</span>
                                </div>

                                <div class="review-meta-box">
                                    <div class="meta-line">
                                        <i class="fa-solid fa-location-dot"></i>
                                        <div>
                                            <strong>Deliver to:</strong> ${this.shippingAddress.fullName}<br>
                                            ${this.shippingAddress.address}, ${this.shippingAddress.city}, ${this.shippingAddress.country}
                                        </div>
                                    </div>
                                    <div class="meta-line">
                                        <i class="fa-solid fa-wallet"></i>
                                        <div>
                                            <strong>Payment Method:</strong><br>
                                            ${this.getPaymentLabel()}
                                        </div>
                                    </div>
                                </div>

                                <button type="button" class="btn btn-primary btn-checkout-action btn-block" onclick="window.AetherCheckout.placeOrder();" style="margin-top: 1rem; width: 100%; justify-content: center;">
                                    <i class="fa-solid fa-lock"></i> <span>Authorize & Place Order</span>
                                </button>
                            </div>
                        </div>

                        <div class="checkout-footer-row" style="margin-top: 1rem;">
                            <button type="button" class="btn btn-outline" onclick="window.AetherCheckout.goToStep(2);">
                                <i class="fa-solid fa-arrow-left"></i> <span>Back to Payment</span>
                            </button>
                        </div>
                    </div>
                `;
            }

            // STEP 4: Success Receipt
            else if (this.currentStep === 4 && this.currentOrder) {
                const order = this.currentOrder;
                bodyHTML = `
                    <div class="checkout-success-view">
                        <div class="success-ring-icon"><i class="fa-solid fa-check"></i></div>
                        <span class="success-order-tag">${order.id}</span>
                        <h2 class="success-title">Order Confirmed & Authorized</h2>
                        <p class="success-subtitle">Your luggage order has been confirmed and is being prepared for express delivery.</p>

                        <div class="order-receipt-card">
                            <div class="receipt-header-row">
                                <div>
                                    <span class="receipt-subtext">Estimated Delivery Time</span>
                                    <h4 class="receipt-date">3–5 Business Days via Express Courier</h4>
                                </div>
                                <div style="text-align: right;">
                                    <span class="receipt-subtext">Total Authorized</span>
                                    <h3 class="receipt-total-val">${order.total}</h3>
                                </div>
                            </div>

                            <!-- 5-Stage Live Dispatch Pipeline -->
                            <div class="dispatch-pipeline-box">
                                <div class="pipeline-step active">
                                    <div class="pip-dot"></div>
                                    <span>Confirmed</span>
                                </div>
                                <div class="pip-line active"></div>
                                <div class="pipeline-step active">
                                    <div class="pip-dot"></div>
                                    <span>Laser Monogram</span>
                                </div>
                                <div class="pip-line"></div>
                                <div class="pipeline-step">
                                    <div class="pip-dot"></div>
                                    <span>Inspection</span>
                                </div>
                                <div class="pip-line"></div>
                                <div class="pipeline-step">
                                    <div class="pip-dot"></div>
                                    <span>Air Freight</span>
                                </div>
                                <div class="pip-line"></div>
                                <div class="pipeline-step">
                                    <div class="pip-dot"></div>
                                    <span>Doorstep Delivery</span>
                                </div>
                            </div>

                            <div class="receipt-details-grid">
                                <div class="receipt-col">
                                    <span class="receipt-label">Destination Address</span>
                                    <p class="receipt-val">
                                        ${order.address.fullName}<br>
                                        ${order.address.address}<br>
                                        ${order.address.city}, ${order.address.country}
                                    </p>
                                </div>
                                <div class="receipt-col">
                                    <span class="receipt-label">Payment Settled Via</span>
                                    <p class="receipt-val">
                                        ${this.getReceiptPaymentLabel(order)}
                                    </p>
                                </div>
                                <div class="receipt-col">
                                    <span class="receipt-label">Warranty Certificate</span>
                                    <p class="receipt-val" style="color: var(--color-gold); font-family: monospace;">
                                        ${order.warrantyCertificateId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="success-actions-row">
                            <button class="btn btn-outline" onclick="window.AetherCheckout.close();">
                                Close Window
                            </button>
                            <button class="btn btn-primary" onclick="window.AetherCheckout.close(); window.location.href = 'collections.html';">
                                <i class="fa-solid fa-suitcase-rolling"></i> Continue Shopping
                            </button>
                        </div>
                    </div>
                `;
            }

            container.innerHTML = `
                ${stepperHTML}
                ${bodyHTML}
            `;
        },

        renderPaymentMethodDetails(finalTotal, formatPrice) {
            const country = this.shippingAddress.country;

            // COMMON METHOD 1: Cash on Delivery
            if (this.paymentMethod === 'cod') {
                return `
                    <div class="payment-method-box cod-box">
                        <div class="payment-notice-icon"><i class="fa-solid fa-handshake"></i></div>
                        <div>
                            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">Doorstep Verification & Payment</h4>
                            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                                Our delivery courier will bring your luggage directly to your door. You can inspect your item before completing payment via Cash or Card.
                            </p>
                            <span class="badge-cod-active"><i class="fa-solid fa-check"></i> Zero Advance Deposit Required &bull; Available across all countries</span>
                        </div>
                    </div>
                `;
            }

            // COMMON METHOD 3: Credit / Debit Card
            if (this.paymentMethod === 'card') {
                const cleanCard = (this.paymentDetails.cardNumber || '').replace(/\D/g, '');
                const isAmex = /^3[47]/.test(cleanCard);
                const brand = this.detectCardBrand(this.paymentDetails.cardNumber);
                const cvvMax = isAmex ? 4 : 3;
                const cvvPlaceholder = isAmex ? '1234' : '123';
                const cvvLabel = isAmex ? 'Security CID / CVV (4 Digits for Amex) *' : 'Security CVV (3 Digits) *';
                return `
                    <div class="payment-method-box card-box">
                        <!-- Luxury Credit Card Graphic -->
                        <div class="luxury-card-preview">
                            <div class="card-chip-row">
                                <div class="gold-chip"></div>
                                <span class="card-brand-logo" id="cardBrandLogo"><i class="${brand.icon}"></i></span>
                            </div>
                            <div class="card-number-preview" id="cardNumberPreview">${this.paymentDetails.cardNumber || '••••  ••••  ••••  ••••'}</div>
                            <div class="card-footer-preview">
                                <div>
                                    <span class="card-sub-label">CARDHOLDER</span>
                                    <span class="card-name-preview" id="cardNamePreview">${this.paymentDetails.cardName || this.shippingAddress.fullName || 'CARDHOLDER'}</span>
                                </div>
                                <div>
                                    <span class="card-sub-label">EXPIRES</span>
                                    <span class="card-exp-preview" id="cardExpPreview">${this.paymentDetails.cardExpiry || 'MM/YY'}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Card Inputs -->
                        <div class="card-inputs-grid">
                            <div class="auth-form-group">
                                <label for="cardNumberInput">Card Number *</label>
                                <div style="position: relative;">
                                    <input type="text" id="cardNumberInput" placeholder="4242 4242 4242 4242" value="${this.paymentDetails.cardNumber || ''}" maxlength="23" autocomplete="cc-number" inputmode="numeric" oninput="window.AetherCheckout.formatCardNumber(this);" onkeydown="window.AetherCheckout.filterDigitsOnly(event);">
                                    <span id="cardTypeIndicator" style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 1.25rem; color: var(--color-gold); pointer-events: none;">
                                        <i class="${brand.icon}"></i>
                                    </span>
                                </div>
                                <span class="checkout-field-error" id="cardNumberError" style="display: none;"></span>
                            </div>
                            <div class="auth-form-group">
                                <label for="cardNameInput">Cardholder Name *</label>
                                <input type="text" id="cardNameInput" placeholder="${this.shippingAddress.fullName || 'Alex Morgan'}" value="${this.paymentDetails.cardName || ''}" autocomplete="cc-name" oninput="window.AetherCheckout.updateCardName(this.value);">
                                <span class="checkout-field-error" id="cardNameError" style="display: none;"></span>
                            </div>
                            <div class="form-row-2">
                                <div class="auth-form-group">
                                    <label for="cardExpInput">Expiry Date *</label>
                                    <input type="text" id="cardExpInput" placeholder="MM/YY" maxlength="5" inputmode="numeric" autocomplete="cc-exp" value="${this.paymentDetails.cardExpiry || ''}" oninput="window.AetherCheckout.formatCardExpiry(this);" onkeydown="window.AetherCheckout.filterDigitsOnly(event);">
                                    <span class="checkout-field-error" id="cardExpError" style="display: none;"></span>
                                </div>
                                <div class="auth-form-group">
                                    <label for="cardCvvInput">${cvvLabel}</label>
                                    <input type="password" id="cardCvvInput" placeholder="${cvvPlaceholder}" maxlength="${cvvMax}" inputmode="numeric" autocomplete="cc-csc" value="${this.paymentDetails.cardCvv || ''}" oninput="window.AetherCheckout.formatCardCvv(this);" onkeydown="window.AetherCheckout.filterDigitsOnly(event);">
                                    <span class="checkout-field-error" id="cardCvvError" style="display: none;"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }


            // DYNAMIC METHOD 2A: India UPI
            if (this.paymentMethod === 'upi') {
                return `
                    <div class="payment-method-box upi-box">
                        <div class="upi-form-col" style="width: 100%;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0;">Pay via UPI ID / Virtual Payment Address (VPA)</h4>
                                <span class="payment-country-badge">INDIA EXCLUSIVE</span>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Instant direct bank authorization via any UPI payment application.</p>
                            <div class="auth-form-group">
                                <label for="upiVpaInput">Enter UPI ID (VPA) *</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="text" id="upiVpaInput" placeholder="voyager@okhdfcbank" value="${this.paymentDetails.vpa || ''}" style="flex: 1;">
                                </div>
                            </div>
                            <div class="upi-apps-row">
                                <span class="upi-app-badge"><i class="fa-brands fa-google-pay"></i> GPay</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-bolt"></i> PhonePe</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-wallet"></i> Paytm</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-building-columns"></i> BHIM</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-shield-halved"></i> CRED</span>
                            </div>
                            <div class="country-subtext-notice" style="margin-top: 0.85rem;">
                                <i class="fa-solid fa-shield-check"></i>
                                <span>Secured by NPCI & 256-bit bank encryption. Enter your VPA above to authorize.</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // DYNAMIC METHOD 2B: PayPal & Venmo (USA, UK, France, Italy, Monaco, etc.)
            if (this.paymentMethod === 'paypal') {
                return `
                    <div class="payment-method-box paypal-box">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">
                                    ${country === 'United States' ? 'PayPal & Venmo Express Checkout' : country === 'United Kingdom' ? 'PayPal & Apple Pay UK Express' : 'PayPal Global Buyer Protection'}
                                </h4>
                                <p style="font-size: 0.82rem; color: var(--text-secondary);">
                                    Fast, secure checkout without sharing financial info. Includes full Buyer Protection.
                                </p>
                            </div>
                            <span class="payment-country-badge"><i class="fa-brands fa-paypal"></i> 1-CLICK PAY</span>
                        </div>

                        <!-- Quick Action Buttons -->
                        <div class="paypal-actions-grid">
                            <button type="button" class="btn-paypal-checkout" onclick="window.AetherApp && window.AetherApp.showToast ? window.AetherApp.showToast('PayPal One-Touch Session Initiated', 'success') : null;">
                                <i class="fa-brands fa-paypal" style="font-size: 1.2rem;"></i> <span>PayPal Checkout</span>
                            </button>
                            ${country === 'United States' ? `
                            <button type="button" class="btn-venmo-checkout" onclick="window.AetherApp && window.AetherApp.showToast ? window.AetherApp.showToast('Venmo Instant Checkout Initiated', 'info') : null;">
                                <i class="fa-solid fa-v" style="font-size: 1rem; font-weight: 900;"></i> <span>Venmo</span>
                            </button>
                            ` : `
                            <button type="button" class="btn-applepay-checkout" onclick="window.AetherApp && window.AetherApp.showToast ? window.AetherApp.showToast('Apple Pay Authorization Ready', 'info') : null;">
                                <i class="fa-brands fa-apple" style="font-size: 1.2rem;"></i> <span>Apple Pay</span>
                            </button>
                            `}
                        </div>

                        <!-- PayPal Account Email -->
                        <div class="auth-form-group" style="margin-top: 0.5rem;">
                            <label for="paypalEmailInput">Or Link PayPal Account Email</label>
                            <input type="email" id="paypalEmailInput" placeholder="voyager@paypal.com" value="${this.paymentDetails.paypalEmail || this.shippingAddress.email || ''}">
                        </div>

                        <!-- Pay in 4 info -->
                        <div class="country-subtext-notice">
                            <i class="fa-solid fa-shield-halved"></i>
                            <span>Eligible for <strong>PayPal Pay in 4</strong>: Split your order into 4 interest-free payments with 0% APR.</span>
                        </div>
                    </div>
                `;
            }

            // DYNAMIC METHOD 2C: Germany Klarna & Sofort
            if (this.paymentMethod === 'klarna') {
                return `
                    <div class="payment-method-box bnpl-box">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">
                                    Klarna & Sofort Überweisung (Deutschland)
                                </h4>
                                <p style="font-size: 0.82rem; color: var(--text-secondary);">
                                    Pay after delivery inspection, slice in 3, or direct instant IBAN transfer. Klarna Käuferschutz inclusive.
                                </p>
                            </div>
                            <span class="payment-country-badge" style="background: rgba(255, 179, 198, 0.15); color: #ffb3c6; border-color: rgba(255, 179, 198, 0.3);">KLARNA VERIFIED</span>
                        </div>

                        <div class="klarna-options-grid">
                            <div class="bnpl-tile active">
                                <div class="bnpl-tile-amount">Rechnung 30d</div>
                                <div class="bnpl-tile-desc">Pay in 30 Days (0% Zinsen)</div>
                            </div>
                            <div class="bnpl-tile">
                                <div class="bnpl-tile-amount">3x Raten</div>
                                <div class="bnpl-tile-desc">3 monthly split payments</div>
                            </div>
                            <div class="bnpl-tile">
                                <div class="bnpl-tile-amount">Sofort IBAN</div>
                                <div class="bnpl-tile-desc">Direct bank PIN/TAN transfer</div>
                            </div>
                        </div>

                        <div class="auth-form-group">
                            <label for="klarnaIbanInput">German IBAN for Instant Sofort Clearing</label>
                            <input type="text" id="klarnaIbanInput" placeholder="DE89 3704 0044 0532 0130 00" value="${this.paymentDetails.klarnaIban || ''}">
                        </div>

                        <div class="country-subtext-notice">
                            <i class="fa-solid fa-lock"></i>
                            <span>TÜV-certified bank security. Klarna Käuferschutz guarantees full refund on returns.</span>
                        </div>
                    </div>
                `;
            }

            // DYNAMIC METHOD 2D: UAE Tabby BNPL
            if (this.paymentMethod === 'tabby') {
                return `
                    <div class="payment-method-box bnpl-box">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">
                                    Tabby & Tamara UAE &bull; 4 Interest-Free Installments
                                </h4>
                                <p style="font-size: 0.82rem; color: var(--text-secondary);">
                                    Split your luggage order into 4 equal monthly installments. No interest. No hidden fees. Sharia-compliant.
                                </p>
                            </div>
                            <span class="payment-country-badge" style="background: rgba(46, 230, 166, 0.15); color: #2ee6a6; border-color: rgba(46, 230, 166, 0.3);">0% INTEREST</span>
                        </div>

                        <div class="tabby-split-grid">
                            <div class="bnpl-tile active">
                                <div class="bnpl-tile-amount">25%</div>
                                <div class="bnpl-tile-desc">Due Today<br><strong>${formatPrice(finalTotal / 4)}</strong></div>
                            </div>
                            <div class="bnpl-tile">
                                <div class="bnpl-tile-amount">25%</div>
                                <div class="bnpl-tile-desc">1 Month<br><strong>${formatPrice(finalTotal / 4)}</strong></div>
                            </div>
                            <div class="bnpl-tile">
                                <div class="bnpl-tile-amount">25%</div>
                                <div class="bnpl-tile-desc">2 Months<br><strong>${formatPrice(finalTotal / 4)}</strong></div>
                            </div>
                            <div class="bnpl-tile">
                                <div class="bnpl-tile-amount">25%</div>
                                <div class="bnpl-tile-desc">3 Months<br><strong>${formatPrice(finalTotal / 4)}</strong></div>
                            </div>
                        </div>

                        <div class="auth-form-group">
                            <label for="tabbyPhoneInput">UAE Mobile Number for Instant SMS OTP</label>
                            <input type="tel" id="tabbyPhoneInput" placeholder="+971 50 123 4567" value="${this.paymentDetails.tabbyPhone || this.shippingAddress.phone || '+971 50 123 4567'}">
                        </div>

                        <div class="country-subtext-notice">
                            <i class="fa-solid fa-circle-check"></i>
                            <span>Instant credit approval within 30 seconds via Emirates ID & UAE Mobile.</span>
                        </div>
                    </div>
                `;
            }

            // DYNAMIC METHOD 2E: Singapore PayNow
            if (this.paymentMethod === 'paynow') {
                return `
                    <div class="payment-method-box paynow-box">
                        <div class="upi-form-col" style="width: 100%;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0;">PayNow Singapore &bull; UEN 202410888K</h4>
                                <span class="payment-country-badge">SG FAST CLEAR</span>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Instant real-time SGD settlement supported by MAS Fast & Secure Transfers.</p>
                            <div class="auth-form-group">
                                <label for="paynowMobileInput">Singapore Mobile Number or NRIC / FIN *</label>
                                <input type="text" id="paynowMobileInput" placeholder="+65 9123 4567" value="${this.paymentDetails.paynowMobile || '+65 9123 4567'}">
                            </div>
                            <div class="upi-apps-row">
                                <span class="upi-app-badge"><i class="fa-solid fa-building-columns"></i> DBS PayLah!</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-mobile"></i> OCBC Pay Anyone</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-wallet"></i> GrabPay</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-building"></i> UOB TMRW</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // DYNAMIC METHOD 2F: Switzerland TWINT
            if (this.paymentMethod === 'twint') {
                return `
                    <div class="payment-method-box twint-box">
                        <div class="upi-form-col" style="width: 100%;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0;">TWINT & PostFinance Swiss Direct</h4>
                                <span class="payment-country-badge">SWITZERLAND #1</span>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Switzerland's leading mobile payment method. Pay directly in CHF with zero currency fees.</p>
                            <div class="auth-form-group">
                                <label for="twintPhoneInput">Swiss Mobile Number (+41) *</label>
                                <input type="tel" id="twintPhoneInput" placeholder="+41 79 123 45 67" value="${this.paymentDetails.twintPhone || '+41 79 123 45 67'}">
                            </div>
                            <div class="upi-apps-row">
                                <span class="upi-app-badge"><i class="fa-solid fa-mobile-screen"></i> TWINT App</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-building-columns"></i> PostFinance</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-vault"></i> UBS TWINT</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // DYNAMIC METHOD 2G: Japan PayPay
            if (this.paymentMethod === 'paypay') {
                return `
                    <div class="payment-method-box paypay-box">
                        <div class="upi-form-col" style="width: 100%;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0;">PayPay & LINE Pay &bull; Japan Mobile</h4>
                                <span class="payment-country-badge">JAPAN DIRECT</span>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Instant smartphone account settlement or Konbini Convenience Store clearing.</p>
                            <div class="auth-form-group">
                                <label for="paypayIdInput">PayPay ID or Japanese Mobile (090/080) *</label>
                                <input type="text" id="paypayIdInput" placeholder="090-1234-5678" value="${this.paymentDetails.paypayId || '090-1234-5678'}">
                            </div>
                            <div class="upi-apps-row">
                                <span class="upi-app-badge"><i class="fa-solid fa-wallet"></i> PayPay</span>
                                <span class="upi-app-badge"><i class="fa-brands fa-line"></i> LINE Pay</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-store"></i> 7-Eleven</span>
                                <span class="upi-app-badge"><i class="fa-solid fa-store"></i> Lawson</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            // DYNAMIC METHOD 2H: Australia Afterpay
            if (this.paymentMethod === 'afterpay') {
                return `
                    <div class="payment-method-box bnpl-box">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">
                                    Afterpay & PayPal &bull; 4 Fortnightly Splits
                                </h4>
                                <p style="font-size: 0.82rem; color: var(--text-secondary);">
                                    Pay in 4 equal interest-free payments every 2 weeks. Instant approval with zero paperwork.
                                </p>
                            </div>
                            <span class="payment-country-badge">AUSTRALIA FAVORITE</span>
                        </div>

                        <div class="tabby-split-grid">
                            <div class="bnpl-tile active">
                                <div class="bnpl-tile-amount">Today</div>
                                <div class="bnpl-tile-desc">${formatPrice(finalTotal / 4)} AUD</div>
                            </div>
                            <div class="bnpl-tile">
                                <div class="bnpl-tile-amount">2 Weeks</div>
                                <div class="bnpl-tile-desc">${formatPrice(finalTotal / 4)} AUD</div>
                            </div>
                            <div class="bnpl-tile">
                                <div class="bnpl-tile-amount">4 Weeks</div>
                                <div class="bnpl-tile-desc">${formatPrice(finalTotal / 4)} AUD</div>
                            </div>
                            <div class="bnpl-tile">
                                <div class="bnpl-tile-amount">6 Weeks</div>
                                <div class="bnpl-tile-desc">${formatPrice(finalTotal / 4)} AUD</div>
                            </div>
                        </div>

                        <div class="auth-form-group">
                            <label for="afterpayEmailInput">Afterpay Registered Email or Mobile</label>
                            <input type="email" id="afterpayEmailInput" placeholder="voyager@afterpay.au" value="${this.paymentDetails.afterpayEmail || this.shippingAddress.email || ''}">
                        </div>

                        <div class="country-subtext-notice">
                            <i class="fa-solid fa-shield-halved"></i>
                            <span>No interest, no additional fees when you pay on time. Australian Consumer Law protected.</span>
                        </div>
                    </div>
                `;
            }

            // DYNAMIC METHOD 2I: Canada Interac e-Transfer
            if (this.paymentMethod === 'interac') {
                return `
                    <div class="payment-method-box bnpl-box">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">
                                    Interac e-Transfer &bull; Direct Canadian Bank Clearing
                                </h4>
                                <p style="font-size: 0.82rem; color: var(--text-secondary);">
                                    Send money directly from your Canadian online banking institution with Autodeposit security.
                                </p>
                            </div>
                            <span class="payment-country-badge">CANADA DIRECT</span>
                        </div>

                        <div class="auth-form-group">
                            <label for="interacEmailInput">Your Interac Online Banking Email</label>
                            <input type="email" id="interacEmailInput" placeholder="voyager@royalbank.com" value="${this.paymentDetails.interacEmail || this.shippingAddress.email || ''}">
                        </div>

                        <div class="upi-apps-row" style="margin-top: 0.25rem;">
                            <span class="upi-app-badge"><i class="fa-solid fa-building-columns"></i> RBC Royal Bank</span>
                            <span class="upi-app-badge"><i class="fa-solid fa-building-columns"></i> TD Bank</span>
                            <span class="upi-app-badge"><i class="fa-solid fa-building-columns"></i> Scotiabank</span>
                            <span class="upi-app-badge"><i class="fa-solid fa-building-columns"></i> BMO</span>
                            <span class="upi-app-badge"><i class="fa-solid fa-building-columns"></i> CIBC</span>
                        </div>

                        <div class="country-subtext-notice">
                            <i class="fa-solid fa-bolt"></i>
                            <span>Recipient: <strong>payments@aether-voyage.ca</strong> &bull; Autodeposit active (no security question needed).</span>
                        </div>
                    </div>
                `;
            }

            // Fallback
            return `
                <div class="payment-method-box cod-box">
                    <div class="payment-notice-icon"><i class="fa-solid fa-shield-halved"></i></div>
                    <div>
                        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">Secure Payment Processing</h4>
                        <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                            Your payment method has been verified with 256-bit encryption for safe, instant checkout.
                        </p>
                    </div>
                </div>
            `;
        },

        detectCardBrand(num) {
            const clean = (num || '').replace(/\D/g, '');
            if (/^4/.test(clean)) return { name: 'Visa', icon: 'fa-brands fa-cc-visa' };
            if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: 'Mastercard', icon: 'fa-brands fa-cc-mastercard' };
            if (/^3[47]/.test(clean)) return { name: 'Amex', icon: 'fa-brands fa-cc-amex' };
            if (/^(6011|65|64[4-9]|622)/.test(clean)) return { name: 'Discover', icon: 'fa-brands fa-cc-discover' };
            if (/^(36|38|30[0-5])/.test(clean)) return { name: 'Diners', icon: 'fa-brands fa-cc-diners-club' };
            if (/^(352[8-9]|35[3-8][0-9])/.test(clean)) return { name: 'JCB', icon: 'fa-brands fa-cc-jcb' };
            return { name: 'Card', icon: 'fa-solid fa-credit-card' };
        },

        getCardBrandIcon(num) {
            return this.detectCardBrand(num).icon;
        },

        filterDigitsOnly(e) {
            // Allow control keys and shortcuts
            if (['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'].includes(e.key) ||
                e.ctrlKey || e.metaKey) {
                return;
            }
            // Block all non-digit keys
            if (!/^\d$/.test(e.key)) {
                e.preventDefault();
            }
        },

        formatCardNumber(input) {
            // Strip out non-digits immediately
            let clean = input.value.replace(/\D/g, '');
            const isAmex = /^3[47]/.test(clean);
            const maxLen = isAmex ? 15 : 16;
            clean = clean.substring(0, maxLen);

            let formatted = '';
            if (isAmex) {
                const p1 = clean.substring(0, 4);
                const p2 = clean.substring(4, 10);
                const p3 = clean.substring(10, 15);
                formatted = [p1, p2, p3].filter(Boolean).join(' ');
            } else {
                formatted = clean.match(/.{1,4}/g)?.join(' ') || clean;
            }
            input.value = formatted;

            const preview = document.getElementById('cardNumberPreview');
            if (preview) {
                preview.textContent = formatted || '••••  ••••  ••••  ••••';
            }

            const brand = this.detectCardBrand(clean);
            const brandLogo = document.getElementById('cardBrandLogo');
            if (brandLogo) {
                brandLogo.innerHTML = `<i class="${brand.icon}"></i>`;
            }
            const typeIndicator = document.getElementById('cardTypeIndicator');
            if (typeIndicator) {
                typeIndicator.innerHTML = `<i class="${brand.icon}"></i>`;
            }

            // Dynamically adjust CVV field length and label based on detected card brand
            const cvvInput = document.getElementById('cardCvvInput');
            const cvvLabel = document.querySelector('label[for="cardCvvInput"]');
            if (cvvInput) {
                if (isAmex) {
                    cvvInput.maxLength = 4;
                    cvvInput.placeholder = '1234';
                    if (cvvLabel) cvvLabel.innerHTML = 'Security CID / CVV (4 Digits for Amex) *';
                } else {
                    cvvInput.maxLength = 3;
                    cvvInput.placeholder = '123';
                    if (cvvLabel) cvvLabel.innerHTML = 'Security CVV (3 Digits) *';
                    if (cvvInput.value.length > 3) {
                        cvvInput.value = cvvInput.value.substring(0, 3);
                    }
                }
            }

            this.clearFieldError('cardNumber');
        },

        updateCardName(val) {
            const preview = document.getElementById('cardNamePreview');
            if (preview) {
                preview.textContent = val.trim() || this.shippingAddress.fullName || 'CARDHOLDER';
            }
            this.clearFieldError('cardName');
        },

        formatCardExpiry(input) {
            // Strip out all alphabets and non-digits immediately
            let clean = input.value.replace(/\D/g, '').substring(0, 4);

            let formatted = clean;
            if (clean.length === 1 && parseInt(clean, 10) > 1) {
                // If first digit is 2-9, auto prepend 0 and slash
                formatted = '0' + clean + '/';
            } else if (clean.length >= 2) {
                let month = parseInt(clean.substring(0, 2), 10);
                if (month > 12) month = 12;
                if (month === 0) month = 1;
                const mStr = (month < 10 && !clean.startsWith('0')) ? '0' + month : (month < 10 ? '0' + month : '' + month);
                formatted = mStr + '/' + clean.substring(2, 4);
            }
            input.value = formatted;

            const preview = document.getElementById('cardExpPreview');
            if (preview) {
                preview.textContent = formatted || 'MM/YY';
            }

            this.clearFieldError('cardExp');
        },

        formatCardCvv(input) {
            // Check card number to determine if card is American Express
            const cardNum = document.getElementById('cardNumberInput')?.value || this.paymentDetails.cardNumber || '';
            const isAmex = /^3[47]/.test(cardNum.replace(/\D/g, ''));
            const maxLen = isAmex ? 4 : 3;
            // Strip out all alphabets and non-digits immediately: 4 digits for Amex, exactly 3 for all other cards
            input.value = input.value.replace(/\D/g, '').substring(0, maxLen);
            this.clearFieldError('cardCvv');
        },

        setFieldError(fieldName, msg) {
            const input = document.getElementById(fieldName + 'Input');
            const err = document.getElementById(fieldName + 'Error');
            if (input) input.classList.add('has-error');
            if (err) {
                err.textContent = msg;
                err.style.display = 'block';
            }
        },

        clearFieldError(fieldName) {
            const input = document.getElementById(fieldName + 'Input');
            const err = document.getElementById(fieldName + 'Error');
            if (input) input.classList.remove('has-error');
            if (err) {
                err.textContent = '';
                err.style.display = 'none';
            }
        },

        clearAllPaymentErrors() {
            ['cardNumber', 'cardName', 'cardExp', 'cardCvv', 'upiVpa', 'paypalEmail'].forEach(f => this.clearFieldError(f));
        },

        validateLuhn(numberStr) {
            const cleanNum = (numberStr || '').replace(/\D/g, '');
            if (!cleanNum || cleanNum.length < 13 || cleanNum.length > 19) return false;
            if (/^0+$/.test(cleanNum)) return false;
            let sum = 0;
            let shouldDouble = false;
            for (let i = cleanNum.length - 1; i >= 0; i--) {
                let digit = parseInt(cleanNum.charAt(i), 10);
                if (shouldDouble) {
                    digit *= 2;
                    if (digit > 9) digit -= 9;
                }
                sum += digit;
                shouldDouble = !shouldDouble;
            }
            return (sum % 10) === 0;
        },

        validateExpiryDate(expStr) {
            if (!expStr || !expStr.trim()) {
                return { valid: false, error: 'Please enter card expiry date (MM/YY).' };
            }
            const match = expStr.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
            if (!match) {
                return { valid: false, error: 'Expiry date must be in MM/YY format (e.g. 12/28).' };
            }
            const month = parseInt(match[1], 10);
            const year = 2000 + parseInt(match[2], 10);
            const now = new Date();
            const curYear = now.getFullYear();
            const curMonth = now.getMonth() + 1;
            if (year < curYear || (year === curYear && month < curMonth)) {
                return { valid: false, error: 'Card has expired. Please enter an active card.' };
            }
            if (year > curYear + 25) {
                return { valid: false, error: 'Expiry year is too far in the future.' };
            }
            return { valid: true };
        },

        validateCvvCode(cvvStr, cardNumStr) {
            if (!cvvStr || !cvvStr.trim()) {
                return { valid: false, error: 'Please enter CVV security code.' };
            }
            const clean = cvvStr.trim().replace(/\D/g, '');
            const isAmex = /^3[47]/.test((cardNumStr || '').replace(/\D/g, ''));
            if (isAmex) {
                if (clean.length !== 4) {
                    return { valid: false, error: 'American Express requires a 4-digit CVV (CID).' };
                }
            } else {
                if (clean.length !== 3) {
                    return { valid: false, error: 'CVV must be exactly 3 digits for this card.' };
                }
            }
            return { valid: true };
        },


        bindEvents() {
            // Close button inside checkout modal
            const closeBtn = document.getElementById('checkoutModalClose');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }

            const modal = document.getElementById('checkoutModal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) this.close();
                });
            }
        }
    };

    window.AetherCheckout = AetherCheckout;
})();
