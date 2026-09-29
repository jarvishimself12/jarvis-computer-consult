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

        // Card number formatting
        const cardNumInput = document.getElementById("cardNumber");
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

        // Button loading state
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
    function finalizeOrder() {
        const orderId = generateOrderId();
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
