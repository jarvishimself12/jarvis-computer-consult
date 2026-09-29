/* =========================================
   JARVIS COMPUTER CONSULT
   CHECKOUT & PAYMENT LOGIC
========================================= */

(function () {
    "use strict";

    // Cart state
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
        cart = [];
    }

    // Pricing & Discount State
    let selectedDeliverySpeed = "standard";
    let deliveryCost = 35;
    let appliedDiscount = 0;
    let appliedDiscountCode = "";
    let selectedPaymentMode = "momo";
    let selectedMoMoNetwork = "MTN MoMo";

    // DOM Elements
    const emptyCartView = document.getElementById("emptyCartView");
    const checkoutGrid = document.getElementById("checkoutGrid");
    const summaryItemsList = document.getElementById("summaryItemsList");
    const summaryItemCount = document.getElementById("summaryItemCount");
    const summarySubtotal = document.getElementById("summarySubtotal");
    const summaryDelivery = document.getElementById("summaryDelivery");
    const summaryDiscount = document.getElementById("summaryDiscount");
    const discountRow = document.getElementById("discountRow");
    const summaryTotal = document.getElementById("summaryTotal");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const placeOrderText = document.getElementById("placeOrderText");

    // Modal Elements
    const orderSuccessModal = document.getElementById("orderSuccessModal");
    const receiptOrderId = document.getElementById("receiptOrderId");
    const receiptCustomerName = document.getElementById("receiptCustomerName");
    const receiptPhone = document.getElementById("receiptPhone");
    const receiptAddress = document.getElementById("receiptAddress");
    const receiptPaymentMethod = document.getElementById("receiptPaymentMethod");
    const receiptPaymentStatus = document.getElementById("receiptPaymentStatus");
    const receiptTotal = document.getElementById("receiptTotal");
    const printReceiptBtn = document.getElementById("printReceiptBtn");

    // MoMo Handset Prompt Elements
    const momoPromptModal = document.getElementById("momoPromptModal");
    const closeMomoPromptBtn = document.getElementById("closeMomoPromptBtn");
    const phoneClock = document.getElementById("phoneClock");
    const phoneCarrierName = document.getElementById("phoneCarrierName");
    const ussdHeader = document.getElementById("ussdHeader");
    const ussdCarrierLogo = document.getElementById("ussdCarrierLogo");
    const ussdTitle = document.getElementById("ussdTitle");
    const ussdCode = document.getElementById("ussdCode");
    const ussdAmount = document.getElementById("ussdAmount");
    const ussdOrderRef = document.getElementById("ussdOrderRef");
    const ussdPinError = document.getElementById("ussdPinError");
    const ussdTimerCount = document.getElementById("ussdTimerCount");
    const ussdCancelBtn = document.getElementById("ussdCancelBtn");
    const ussdAuthorizeBtn = document.getElementById("ussdAuthorizeBtn");
    const ussdPromptBody = document.getElementById("ussdPromptBody");
    const ussdProcessingState = document.getElementById("ussdProcessingState");
    const ussdProcessingText = document.getElementById("ussdProcessingText");
    const ussdSuccessState = document.getElementById("ussdSuccessState");
    const ussdSuccessMsg = document.getElementById("ussdSuccessMsg");
    const ussdTransId = document.getElementById("ussdTransId");
    const phoneKeypad = document.getElementById("phoneKeypad");

    // Incoming SMS notification elements
    const incomingSmsBanner = document.getElementById("incomingSmsBanner");
    const smsSenderName = document.getElementById("smsSenderName");
    const smsTargetPhone = document.getElementById("smsTargetPhone");
    const smsGeneratedPin = document.getElementById("smsGeneratedPin");
    const btnAutoFillPin = document.getElementById("btnAutoFillPin");

    let enteredPin = "";
    let activeMomoPin = "1234";
    let promptCountdownInterval = null;
    let pendingOrderId = null;

    // Coupon Elements
    const couponCodeInput = document.getElementById("couponCode");
    const applyCouponBtn = document.getElementById("applyCouponBtn");
    const couponMessage = document.getElementById("couponMessage");

    // Bank reference
    const bankRefCode = document.getElementById("bankRefCode");

    // Format GH₵ Price
    function formatMoney(amount) {
        return `GH₵ ${Number(amount).toLocaleString("en-GH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    // Generate unique order ID
    function generateOrderId() {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        return `JCC-${randomNum}`;
    }

    // Initialize UI
    function initCheckout() {
        if (!cart || cart.length === 0) {
            if (emptyCartView) emptyCartView.style.display = "block";
            if (checkoutGrid) checkoutGrid.style.display = "none";
            return;
        }

        if (emptyCartView) emptyCartView.style.display = "none";
        if (checkoutGrid) checkoutGrid.style.display = "grid";

        // Prefill customer info if user is logged in
        prefillUserDetails();

        // Generate Bank Ref code
        if (bankRefCode) {
            bankRefCode.textContent = `JCC-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        // Render Cart Items & Calculate
        renderOrderItems();
        setupEventListeners();
        calculateTotals();
    }

    // Prefill logged-in user details
    function prefillUserDetails() {
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (currentUser) {
                const nameInput = document.getElementById("fullName");
                const emailInput = document.getElementById("email");
                const momoName = document.getElementById("momoName");
                const cardHolder = document.getElementById("cardHolder");

                if (nameInput && currentUser.name) nameInput.value = currentUser.name;
                if (emailInput && currentUser.email) emailInput.value = currentUser.email;
                if (momoName && currentUser.name) momoName.value = currentUser.name;
                if (cardHolder && currentUser.name) cardHolder.value = currentUser.name;
            }
        } catch (e) {
            console.error("Error reading currentUser:", e);
        }
    }

    // Render Items in Order Summary
    function renderOrderItems() {
        if (!summaryItemsList) return;

        summaryItemsList.innerHTML = cart.map(item => {
            const imageHtml = item.image
                ? `<img src="${item.image}" alt="${item.name}" class="summary-item-img" onerror="this.src='images/logo.png'">`
                : `<div class="summary-item-img" style="display:flex;align-items:center;justify-content:center;color:#6c4df6;"><i class="fa-solid ${item.icon || 'fa-box'}"></i></div>`;

            const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

            return `
                <div class="summary-item">
                    ${imageHtml}
                    <div class="summary-item-info">
                        <div class="summary-item-name" title="${item.name}">${item.name}</div>
                        <div class="summary-item-qty">Qty: ${item.quantity} × ${formatMoney(item.price)}</div>
                    </div>
                    <div class="summary-item-price">${formatMoney(itemTotal)}</div>
                </div>
            `;
        }).join("");

        const totalCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        if (summaryItemCount) {
            summaryItemCount.textContent = `(${totalCount} item${totalCount === 1 ? '' : 's'})`;
        }
    }

    // Calculate totals
    function calculateTotals() {
        const subtotal = cart.reduce((sum, item) => {
            return sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1));
        }, 0);

        // Apply coupon discount if any
        let discount = 0;
        if (appliedDiscountCode === "JARVIS10") {
            discount = subtotal * 0.10; // 10% off
        } else if (appliedDiscountCode === "JARVIS20") {
            discount = subtotal * 0.20; // 20% off
        } else if (appliedDiscountCode === "FREEDEL") {
            deliveryCost = 0;
        }
        appliedDiscount = discount;

        const grandTotal = Math.max(0, (subtotal + deliveryCost) - appliedDiscount);

        if (summarySubtotal) summarySubtotal.textContent = formatMoney(subtotal);
        if (summaryDelivery) summaryDelivery.textContent = deliveryCost === 0 ? "FREE" : formatMoney(deliveryCost);

        if (discountRow) {
            if (appliedDiscount > 0) {
                discountRow.style.display = "flex";
                if (summaryDiscount) summaryDiscount.textContent = `-${formatMoney(appliedDiscount)}`;
            } else {
                discountRow.style.display = "none";
            }
        }

        if (summaryTotal) summaryTotal.textContent = formatMoney(grandTotal);
        if (placeOrderText) {
            placeOrderText.textContent = `Place Order & Pay ${formatMoney(grandTotal)}`;
        }

        return { subtotal, deliveryCost, appliedDiscount, grandTotal };
    }

    // Event listeners
    function setupEventListeners() {
        // Delivery speed radios
        const deliveryRadios = document.querySelectorAll('input[name="deliverySpeed"]');
        deliveryRadios.forEach(radio => {
            radio.addEventListener("change", function () {
                document.querySelectorAll(".delivery-option-card").forEach(c => c.classList.remove("selected"));
                this.closest(".delivery-option-card").classList.add("selected");

                selectedDeliverySpeed = this.value;
                if (selectedDeliverySpeed === "standard") deliveryCost = 35;
                else if (selectedDeliverySpeed === "express") deliveryCost = 60;
                else if (selectedDeliverySpeed === "pickup") deliveryCost = 0;

                calculateTotals();
            });
        });

        // Payment Tabs
        const paymentTabs = document.querySelectorAll(".payment-tab-btn");
        paymentTabs.forEach(tab => {
            tab.addEventListener("click", function () {
                paymentTabs.forEach(t => t.classList.remove("active"));
                this.classList.add("active");

                selectedPaymentMode = this.dataset.mode;
                document.querySelectorAll(".payment-pane").forEach(p => p.classList.remove("active"));

                const targetPane = document.getElementById(`pane-${selectedPaymentMode}`);
                if (targetPane) targetPane.classList.add("active");

                // Update CTA button text based on mode
                if (selectedPaymentMode === "cod") {
                    if (placeOrderText) placeOrderText.textContent = "Confirm Order (Pay on Delivery)";
                } else if (selectedPaymentMode === "bank") {
                    if (placeOrderText) placeOrderText.textContent = "Place Order & View Bank Instructions";
                } else {
                    const totals = calculateTotals();
                    if (placeOrderText) placeOrderText.textContent = `Place Order & Pay ${formatMoney(totals.grandTotal)}`;
                }
            });
        });

        // MoMo Network selector
        const networkBadges = document.querySelectorAll(".network-badge");
        networkBadges.forEach(badge => {
            badge.addEventListener("click", function () {
                networkBadges.forEach(b => b.classList.remove("selected"));
                this.classList.add("selected");
                selectedMoMoNetwork = this.dataset.network;
            });
        });

        // Card number formatting & automatic brand detection
        const cardNumInput = document.getElementById("cardNumber");
        const visaIcons = document.querySelectorAll('img[src*="visa"]');
        const mcIcons = document.querySelectorAll('img[src*="mastercard"]');

        if (cardNumInput) {
            cardNumInput.addEventListener("input", function (e) {
                let val = e.target.value.replace(/\D/g, "");
                val = val.substring(0, 16);
                let formatted = "";
                for (let i = 0; i < val.length; i++) {
                    if (i > 0 && i % 4 === 0) formatted += " ";
                    formatted += val[i];
                }
                e.target.value = formatted;

                // Visual brand detection based on card prefix
                if (val.startsWith("4")) {
                    visaIcons.forEach(img => img.style.opacity = "1");
                    mcIcons.forEach(img => img.style.opacity = "0.35");
                } else if (val.startsWith("5") || val.startsWith("2")) {
                    mcIcons.forEach(img => img.style.opacity = "1");
                    visaIcons.forEach(img => img.style.opacity = "0.35");
                } else {
                    visaIcons.forEach(img => img.style.opacity = "1");
                    mcIcons.forEach(img => img.style.opacity = "1");
                }
            });
        }

        // Card Expiry formatting
        const cardExpiryInput = document.getElementById("cardExpiry");
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener("input", function (e) {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length >= 2) {
                    e.target.value = val.substring(0, 2) + "/" + val.substring(2, 4);
                } else {
                    e.target.value = val;
                }
            });
        }

        // Coupon application
        if (applyCouponBtn && couponCodeInput) {
            applyCouponBtn.addEventListener("click", applyCoupon);
            couponCodeInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    applyCoupon();
                }
            });
        }

        // Place Order Button
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener("click", handlePlaceOrder);
        }

        // Print receipt
        if (printReceiptBtn) {
            printReceiptBtn.addEventListener("click", function () {
                window.print();
            });
        }

        // Initialize MoMo phone prompt event listeners
        setupMomoPromptListeners();
    }

    // MoMo Prompt Handlers
    function setupMomoPromptListeners() {
        if (phoneKeypad) {
            phoneKeypad.addEventListener("click", function (e) {
                const btn = e.target.closest("button");
                if (!btn) return;

                const key = btn.dataset.key;
                const action = btn.dataset.action;

                if (key !== undefined) {
                    handlePinInput(key);
                } else if (action === "clear") {
                    enteredPin = "";
                    updatePinDots();
                } else if (action === "backspace") {
                    enteredPin = enteredPin.slice(0, -1);
                    updatePinDots();
                }
            });
        }

        if (ussdAuthorizeBtn) {
            ussdAuthorizeBtn.addEventListener("click", authorizeMomoTransaction);
        }

        // Auto-fill PIN button on incoming SMS banner
        if (btnAutoFillPin) {
            btnAutoFillPin.addEventListener("click", function () {
                enteredPin = activeMomoPin;
                updatePinDots();
                if (ussdPinError) ussdPinError.style.display = "none";
            });
        }

        if (ussdCancelBtn) {
            ussdCancelBtn.addEventListener("click", function () {
                cancelMomoPrompt("Payment authorization was cancelled. You can try again whenever you are ready.");
            });
        }

        if (closeMomoPromptBtn) {
            closeMomoPromptBtn.addEventListener("click", function () {
                cancelMomoPrompt("Payment prompt dismissed.");
            });
        }

        // Physical keyboard support while prompt is open
        window.addEventListener("keydown", function (e) {
            if (!momoPromptModal || !momoPromptModal.classList.contains("active")) return;

            if (e.key >= "0" && e.key <= "9") {
                handlePinInput(e.key);
            } else if (e.key === "Backspace") {
                enteredPin = enteredPin.slice(0, -1);
                updatePinDots();
            } else if (e.key === "Escape") {
                cancelMomoPrompt("Payment authorization cancelled.");
            } else if (e.key === "Enter") {
                authorizeMomoTransaction();
            }
        });
    }

    function handlePinInput(digit) {
        if (enteredPin.length < 4) {
            enteredPin += digit;
            updatePinDots();
            if (ussdPinError) ussdPinError.style.display = "none";
        }
    }

    function updatePinDots() {
        const dots = document.querySelectorAll(".pin-dot");
        dots.forEach((dot, index) => {
            if (index < enteredPin.length) {
                dot.classList.add("filled");
            } else {
                dot.classList.remove("filled");
            }
        });
    }

    function openMomoPrompt(orderId) {
        pendingOrderId = orderId;
        enteredPin = "";
        updatePinDots();

        const totals = calculateTotals();
        const momoPhoneInput = document.getElementById("momoPhone");
        const momoPhone = (momoPhoneInput && momoPhoneInput.value.trim()) ? momoPhoneInput.value.trim() : "054 613 0491";

        // Generate a 4-digit MoMo security PIN delivered to customer's phone
        activeMomoPin = String(Math.floor(1000 + Math.random() * 9000));
        if (smsGeneratedPin) smsGeneratedPin.textContent = activeMomoPin;
        if (smsTargetPhone) smsTargetPhone.textContent = momoPhone;

        // Update live phone clock
        const now = new Date();
        if (phoneClock) {
            phoneClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        // Update telecom branding based on selected network
        if (selectedMoMoNetwork === "Telecel Cash") {
            if (phoneCarrierName) phoneCarrierName.textContent = "Telecel GH";
            if (ussdHeader) ussdHeader.className = "ussd-header network-telecel";
            if (ussdCarrierLogo) ussdCarrierLogo.src = "images/telecel_cash.svg";
            if (ussdTitle) ussdTitle.textContent = "Telecel Cash";
            if (ussdCode) ussdCode.textContent = "*110# USSD Push Prompt";
            if (ussdProcessingText) ussdProcessingText.textContent = "Connecting to Telecel Cash Gateway to verify PIN and authorize payment...";
            if (smsSenderName) smsSenderName.textContent = "Telecel Cash Alert";
        } else if (selectedMoMoNetwork === "AT Money") {
            if (phoneCarrierName) phoneCarrierName.textContent = "AT GH";
            if (ussdHeader) ussdHeader.className = "ussd-header network-at";
            if (ussdCarrierLogo) ussdCarrierLogo.src = "images/at_money.svg";
            if (ussdTitle) ussdTitle.textContent = "AT Money";
            if (ussdCode) ussdCode.textContent = "*110# USSD Push Prompt";
            if (ussdProcessingText) ussdProcessingText.textContent = "Connecting to AT Money Gateway to verify PIN and authorize payment...";
            if (smsSenderName) smsSenderName.textContent = "AT Money Alert";
        } else {
            // Default: MTN MoMo
            if (phoneCarrierName) phoneCarrierName.textContent = "MTN GH";
            if (ussdHeader) ussdHeader.className = "ussd-header";
            if (ussdCarrierLogo) ussdCarrierLogo.src = "images/mtn_momo.svg";
            if (ussdTitle) ussdTitle.textContent = "MTN MobileMoney";
            if (ussdCode) ussdCode.textContent = "*170# USSD Push Prompt";
            if (ussdProcessingText) ussdProcessingText.textContent = "Connecting to MTN MoMo Gateway to verify PIN and authorize payment...";
            if (smsSenderName) smsSenderName.textContent = "MTN MoMo Notification";
        }

        // Set amount and reference in USSD card
        if (ussdAmount) ussdAmount.textContent = formatMoney(totals.grandTotal);
        if (ussdOrderRef) ussdOrderRef.textContent = orderId;

        // Reset views inside USSD modal
        if (ussdPromptBody) ussdPromptBody.style.display = "block";
        if (ussdProcessingState) ussdProcessingState.style.display = "none";
        if (ussdSuccessState) ussdSuccessState.style.display = "none";
        if (ussdPinError) ussdPinError.style.display = "none";

        // Show modal backdrop
        if (momoPromptModal) {
            momoPromptModal.classList.add("active");
        }

        // Trigger phone vibration on customer's device if supported
        if (navigator.vibrate) {
            try {
                navigator.vibrate([120, 60, 120]);
            } catch (e) {}
        }
        playNotificationPing();

        // Start 60-second countdown timer
        let timeLeft = 60;
        if (ussdTimerCount) ussdTimerCount.textContent = `${timeLeft}s`;
        if (promptCountdownInterval) clearInterval(promptCountdownInterval);

        promptCountdownInterval = setInterval(() => {
            timeLeft--;
            if (ussdTimerCount) ussdTimerCount.textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(promptCountdownInterval);
                cancelMomoPrompt("Mobile Money authorization session timed out. Please try again.");
            }
        }, 1000);
    }

    function authorizeMomoTransaction() {
        if (enteredPin.length < 4) {
            if (ussdPinError) {
                ussdPinError.style.display = "block";
                ussdPinError.textContent = "Please enter your 4-digit PIN";
            }
            const pinDisplay = document.getElementById("ussdPinDisplay");
            if (pinDisplay) {
                pinDisplay.style.animation = "none";
                setTimeout(() => { pinDisplay.style.animation = "shakeError 0.3s ease"; }, 10);
            }
            return;
        }

        if (promptCountdownInterval) {
            clearInterval(promptCountdownInterval);
        }

        // Show Processing Screen inside phone
        if (ussdPromptBody) ussdPromptBody.style.display = "none";
        if (ussdProcessingState) ussdProcessingState.style.display = "block";

        const totals = calculateTotals();

        // Simulate secure telecom verification
        setTimeout(() => {
            playPaymentChime();

            if (ussdProcessingState) ussdProcessingState.style.display = "none";
            if (ussdSuccessState) ussdSuccessState.style.display = "block";
            if (ussdSuccessMsg) {
                ussdSuccessMsg.textContent = `You have successfully authorized payment of ${formatMoney(totals.grandTotal)} to JARVIS COMPUTER CONSULT.`;
            }
            if (ussdTransId) {
                const randomTransId = Math.floor(1000000000 + Math.random() * 9000000000);
                ussdTransId.textContent = `Trans ID: MM${randomTransId}`;
            }

            // Close prompt & finalize order after brief celebratory view
            setTimeout(() => {
                if (momoPromptModal) momoPromptModal.classList.remove("active");
                if (placeOrderBtn) {
                    placeOrderBtn.disabled = false;
                    placeOrderBtn.innerHTML = `
                        <i class="fa-solid fa-lock"></i>
                        <span id="placeOrderText">Place Order & Pay ${formatMoney(totals.grandTotal)}</span>
                    `;
                }
                finalizeOrder(pendingOrderId);
            }, 1400);

        }, 1500);
    }

    function cancelMomoPrompt(message) {
        if (promptCountdownInterval) {
            clearInterval(promptCountdownInterval);
        }
        if (momoPromptModal) {
            momoPromptModal.classList.remove("active");
        }
        if (placeOrderBtn) {
            placeOrderBtn.disabled = false;
            const totals = calculateTotals();
            placeOrderBtn.innerHTML = `
                <i class="fa-solid fa-lock"></i>
                <span id="placeOrderText">Place Order & Pay ${formatMoney(totals.grandTotal)}</span>
            `;
        }
        if (message) {
            alert(message);
        }
    }

    function playPaymentChime() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880, now + 0.12); // A5
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.start(now);
            osc.stop(now + 0.45);
        } catch (e) {
            // Audio context safely ignored if blocked by browser policy
        }
    }

    function playNotificationPing() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(784, now); // G5
            osc.frequency.setValueAtTime(1046.50, now + 0.08); // C6
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } catch (e) {
            // Audio context safely ignored if blocked
        }
    }

    // Apply Coupon Code
    function applyCoupon() {
        const code = couponCodeInput.value.trim().toUpperCase();
        if (!code) return;

        if (code === "JARVIS10" || code === "JARVIS20" || code === "FREEDEL") {
            appliedDiscountCode = code;
            couponMessage.style.display = "block";
            couponMessage.style.color = "var(--success)";
            couponMessage.textContent = code === "FREEDEL" 
                ? "Coupon applied! Free shipping granted." 
                : `Coupon ${code} applied successfully!`;
            calculateTotals();
        } else {
            couponMessage.style.display = "block";
            couponMessage.style.color = "var(--danger)";
            couponMessage.textContent = "Invalid coupon code. Try JARVIS10 or FREEDEL.";
        }
    }

    // Validate inputs
    function validateForm() {
        const nameInput = document.getElementById("fullName");
        const phoneInput = document.getElementById("phone");
        const emailInput = document.getElementById("email");
        const cityInput = document.getElementById("city");
        const regionInput = document.getElementById("region");

        let isValid = true;
        const requiredFields = [nameInput, phoneInput, emailInput, cityInput, regionInput];

        requiredFields.forEach(field => {
            if (!field || !field.value.trim()) {
                if (field) field.classList.add("error");
                isValid = false;
            } else {
                if (field) field.classList.remove("error");
            }
        });

        if (!isValid) {
            alert("Please fill in all required shipping fields marked with an asterisk (*).");
            return false;
        }

        // Validate selected payment method
        if (selectedPaymentMode === "momo") {
            const momoPhone = document.getElementById("momoPhone");
            const momoName = document.getElementById("momoName");
            if (!momoPhone || !momoPhone.value.trim() || !momoName || !momoName.value.trim()) {
                alert("Please provide your Mobile Money number and registered account name.");
                if (momoPhone) momoPhone.focus();
                return false;
            }
        } else if (selectedPaymentMode === "card") {
            const cardHolder = document.getElementById("cardHolder");
            const cardNumber = document.getElementById("cardNumber");
            const cardExpiry = document.getElementById("cardExpiry");
            const cardCvv = document.getElementById("cardCvv");

            if (!cardHolder.value.trim() || !cardNumber.value.trim() || !cardExpiry.value.trim() || !cardCvv.value.trim()) {
                alert("Please fill in complete and valid card payment details.");
                return false;
            }
        }

        return true;
    }

    // Process Place Order
    function handlePlaceOrder() {
        if (!validateForm()) return;

        // If Mobile Money is chosen, trigger the simulated phone prompt
        if (selectedPaymentMode === "momo") {
            const orderId = generateOrderId();
            openMomoPrompt(orderId);
            return;
        }

        // For other methods (Card, Bank, COD)
        placeOrderBtn.disabled = true;
        const originalText = placeOrderBtn.innerHTML;
        placeOrderBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Authorizing Payment & Processing...</span>
        `;

        // Simulate secure network transaction
        setTimeout(() => {
            finalizeOrder();
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = originalText;
        }, 1200);
    }

    // Finalize order record and store
    function finalizeOrder(customOrderId) {
        const orderId = customOrderId || generateOrderId();
        const totals = calculateTotals();

        const customer = {
            name: document.getElementById("fullName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            region: document.getElementById("region").value,
            city: document.getElementById("city").value.trim(),
            gpsAddress: document.getElementById("gpsAddress").value.trim() || "N/A",
            notes: document.getElementById("orderNotes").value.trim() || "None"
        };

        let paymentLabel = "";
        let paymentStatus = "Paid";

        if (selectedPaymentMode === "momo") {
            const momoPhone = document.getElementById("momoPhone").value.trim();
            paymentLabel = `Mobile Money (${selectedMoMoNetwork} - ${momoPhone})`;
            paymentStatus = "Paid";
        } else if (selectedPaymentMode === "card") {
            const last4 = document.getElementById("cardNumber").value.replace(/\s/g, "").slice(-4) || "8842";
            paymentLabel = `Debit/Credit Card (ending in •••• ${last4})`;
            paymentStatus = "Paid";
        } else if (selectedPaymentMode === "bank") {
            paymentLabel = `Bank Wire (GCB Bank Ref: ${bankRefCode ? bankRefCode.textContent : 'JCC-WIRE'})`;
            paymentStatus = "Pending Transfer";
        } else if (selectedPaymentMode === "cod") {
            paymentLabel = "Cash / MoMo on Delivery";
            paymentStatus = "Pending (Pay on Delivery)";
        }

        const newOrder = {
            id: orderId,
            createdAt: new Date().toISOString(),
            dateFormatted: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }),
            customer: customer,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity) || 1,
                image: item.image || ""
            })),
            deliverySpeed: selectedDeliverySpeed,
            deliveryCost: deliveryCost,
            subtotal: totals.subtotal,
            discount: totals.appliedDiscount,
            couponCode: appliedDiscountCode || null,
            total: totals.grandTotal,
            paymentMethod: paymentLabel,
            paymentStatus: paymentStatus,
            orderStatus: "Processing"
        };

        // Save order into localStorage 'orders' list
        let orders = [];
        try {
            orders = JSON.parse(localStorage.getItem("orders")) || [];
        } catch (e) {
            orders = [];
        }

        orders.unshift(newOrder); // Add to the top
        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.setItem("latestOrder", JSON.stringify(newOrder));

        // Clear user cart
        try {
            localStorage.removeItem("cart");
        } catch (e) {
            console.error("Cart clear error:", e);
        }

        // Trigger custom event for any live open admin tabs
        window.dispatchEvent(new Event("orderPlaced"));

        // Display Success Modal
        showSuccessModal(newOrder);
    }

    // Display confirmation modal
    function showSuccessModal(order) {
        if (!orderSuccessModal) return;

        if (receiptOrderId) receiptOrderId.textContent = `#${order.id}`;
        if (receiptCustomerName) receiptCustomerName.textContent = order.customer.name;
        if (receiptPhone) receiptPhone.textContent = order.customer.phone;
        if (receiptAddress) receiptAddress.textContent = `${order.customer.city}, ${order.customer.region} (${order.customer.gpsAddress})`;
        if (receiptPaymentMethod) receiptPaymentMethod.textContent = order.paymentMethod;
        if (receiptPaymentStatus) {
            receiptPaymentStatus.textContent = order.paymentStatus.toUpperCase();
            if (order.paymentStatus === "Paid") {
                receiptPaymentStatus.style.color = "var(--success)";
            } else {
                receiptPaymentStatus.style.color = "var(--warning)";
            }
        }
        if (receiptTotal) receiptTotal.textContent = formatMoney(order.total);

        orderSuccessModal.classList.add("active");
    }

    // Kick off checkout
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCheckout);
    } else {
        initCheckout();
    }

})();
