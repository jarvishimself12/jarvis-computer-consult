/* ==============================================================
   JARVIS COMPUTER CONSULT
   STANDALONE ADMIN PORTAL LOGIC & ORDER SYNCHRONIZATION
============================================================== */

(function () {
    "use strict";

    // Admin Credentials
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "jarvis2026"; // Also supports "admin123"

    // State
    let orders = [];
    let currentFilterStatus = "all";
    let currentFilterPayment = "all";
    let currentSearchTerm = "";
    let selectedOrderForModal = null;
    let lastKnownOrdersCount = 0;

    // DOM Elements - Auth Lock
    const authLockOverlay = document.getElementById("authLockOverlay");
    const adminUsernameInput = document.getElementById("adminUsername");
    const adminPasswordInput = document.getElementById("adminPassword");
    const btnUnlockAdmin = document.getElementById("btnUnlockAdmin");
    const authErrorMsg = document.getElementById("authErrorMsg");
    const btnLockPortal = document.getElementById("btnLockPortal");

    // DOM Elements - Dashboard
    const kpiRevenue = document.getElementById("kpiRevenue");
    const kpiTotalOrders = document.getElementById("kpiTotalOrders");
    const kpiProcessing = document.getElementById("kpiProcessing");
    const kpiDelivered = document.getElementById("kpiDelivered");
    const ordersTabCount = document.getElementById("ordersTabCount");
    const inventoryTabCount = document.getElementById("inventoryTabCount");
    const ordersTableBody = document.getElementById("ordersTableBody");
    const emptyOrdersNotice = document.getElementById("emptyOrdersNotice");
    const orderSearchInput = document.getElementById("orderSearchInput");
    const statusFilter = document.getElementById("statusFilter");
    const paymentFilter = document.getElementById("paymentFilter");
    const refreshBtn = document.getElementById("refreshBtn");
    const exportCsvBtn = document.getElementById("exportCsvBtn");
    const clearAllOrdersBtn = document.getElementById("clearAllOrdersBtn");
    const createDemoOrderBtn = document.getElementById("createDemoOrderBtn");
    const btnPlaceSampleOrder = document.getElementById("btnPlaceSampleOrder");

    // DOM Elements - Modal
    const adminOrderModal = document.getElementById("adminOrderModal");
    const closeOrderModalBtn = document.getElementById("closeOrderModalBtn");
    const modalOrderDate = document.getElementById("modalOrderDate");
    const modalCustomerName = document.getElementById("modalCustomerName");
    const modalCustomerPhone = document.getElementById("modalCustomerPhone");
    const modalCustomerEmail = document.getElementById("modalCustomerEmail");
    const modalCustomerAddress = document.getElementById("modalCustomerAddress");
    const modalCustomerGPS = document.getElementById("modalCustomerGPS");
    const modalCustomerNotes = document.getElementById("modalCustomerNotes");
    const modalPaymentMethod = document.getElementById("modalPaymentMethod");
    const modalPaymentStatus = document.getElementById("modalPaymentStatus");
    const modalDeliverySpeed = document.getElementById("modalDeliverySpeed");
    const modalOrderStatusText = document.getElementById("modalOrderStatusText");
    const modalItemsBody = document.getElementById("modalItemsBody");
    const modalSubtotal = document.getElementById("modalSubtotal");
    const modalDeliveryFee = document.getElementById("modalDeliveryFee");
    const modalDiscountRow = document.getElementById("modalDiscountRow");
    const modalDiscount = document.getElementById("modalDiscount");
    const modalGrandTotal = document.getElementById("modalGrandTotal");
    const modalStatusSelect = document.getElementById("modalStatusSelect");
    const modalWhatsAppBtn = document.getElementById("modalWhatsAppBtn");
    const modalPrintBtn = document.getElementById("modalPrintBtn");

    // Toast
    const realtimeToast = document.getElementById("realtimeToast");
    const toastTitle = document.getElementById("toastTitle");
    const toastDesc = document.getElementById("toastDesc");

    // Format Money (GH₵)
    function formatMoney(amount) {
        return `GH₵ ${Number(amount).toLocaleString("en-GH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    // Audio chime for new orders
    function playOrderChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch (e) {}
    }

    function showToast(title, desc) {
        if (!realtimeToast) return;
        if (toastTitle) toastTitle.textContent = title;
        if (toastDesc) toastDesc.textContent = desc;
        realtimeToast.classList.add("active");
        playOrderChime();
        setTimeout(() => {
            realtimeToast.classList.remove("active");
        }, 5000);
    }

    // ==============================================================
    // AUTHENTICATION CHECK
    // ==============================================================
    function checkAuth() {
        const isAuth = sessionStorage.getItem("adminAuth") === "true";
        if (isAuth) {
            if (authLockOverlay) authLockOverlay.style.display = "none";
            loadOrders(true);
        } else {
            if (authLockOverlay) authLockOverlay.style.display = "flex";
            if (adminUsernameInput) adminUsernameInput.focus();
        }
    }

    function attemptLogin() {
        const u = (adminUsernameInput.value || "").trim();
        const p = (adminPasswordInput.value || "").trim();

        if ((u.toLowerCase() === ADMIN_USER) && (p === ADMIN_PASS || p === "admin123" || p === "admin")) {
            sessionStorage.setItem("adminAuth", "true");
            if (authErrorMsg) authErrorMsg.style.display = "none";
            if (authLockOverlay) authLockOverlay.style.display = "none";
            loadOrders(true);
            showToast("Welcome Administrator", "Connected to live store orders stream.");
        } else {
            if (authErrorMsg) {
                authErrorMsg.style.display = "block";
                authErrorMsg.textContent = "Invalid credentials. Use admin / jarvis2026";
            }
        }
    }

    function handleLogout() {
        sessionStorage.removeItem("adminAuth");
        checkAuth();
    }

    // ==============================================================
    // ORDERS SYNCHRONIZATION
    // ==============================================================
    function loadOrders(suppressToast = false) {
        let stored = null;
        try {
            stored = JSON.parse(localStorage.getItem("orders"));
        } catch (e) {
            stored = null;
        }

        if (stored && Array.isArray(stored)) {
            orders = stored;
        } else {
            orders = [];
        }

        // Detect newly arrived order
        if (!suppressToast && lastKnownOrdersCount > 0 && orders.length > lastKnownOrdersCount) {
            const newest = orders[0];
            showToast(
                `New Customer Order Placed!`,
                `Order #${newest.id} from ${newest.customer.name} - ${formatMoney(newest.total)} (${newest.paymentMethod})`
            );
        }

        lastKnownOrdersCount = orders.length;
        updateKPIs();
        renderOrdersTable();
    }

    function updateKPIs() {
        const totalCount = orders.length;
        const totalRevenue = orders.reduce((sum, ord) => {
            if (ord.paymentStatus === "Paid" || ord.orderStatus === "Delivered") {
                return sum + (Number(ord.total) || 0);
            }
            return sum;
        }, 0);

        const processingCount = orders.filter(ord => ord.orderStatus === "Processing").length;
        const deliveredCount = orders.filter(ord => ord.orderStatus === "Delivered").length;

        if (kpiRevenue) kpiRevenue.textContent = formatMoney(totalRevenue);
        if (kpiTotalOrders) kpiTotalOrders.textContent = totalCount;
        if (kpiProcessing) kpiProcessing.textContent = processingCount;
        if (kpiDelivered) kpiDelivered.textContent = deliveredCount;
        if (ordersTabCount) ordersTabCount.textContent = totalCount;
    }

    function renderOrdersTable() {
        if (!ordersTableBody) return;

        let filtered = orders.filter(order => {
            if (currentFilterStatus !== "all" && order.orderStatus !== currentFilterStatus) {
                return false;
            }
            if (currentFilterPayment === "Paid" && order.paymentStatus !== "Paid") {
                return false;
            }
            if (currentFilterPayment === "Pending" && order.paymentStatus === "Paid") {
                return false;
            }

            if (currentSearchTerm.trim() !== "") {
                const term = currentSearchTerm.toLowerCase();
                const matchesId = (order.id || "").toLowerCase().includes(term);
                const matchesName = (order.customer.name || "").toLowerCase().includes(term);
                const matchesPhone = (order.customer.phone || "").toLowerCase().includes(term);
                const matchesCity = (order.customer.city || "").toLowerCase().includes(term);
                const matchesItem = (order.items || []).some(item => (item.name || "").toLowerCase().includes(term));

                if (!matchesId && !matchesName && !matchesPhone && !matchesCity && !matchesItem) {
                    return false;
                }
            }

            return true;
        });

        if (filtered.length === 0) {
            ordersTableBody.innerHTML = "";
            if (emptyOrdersNotice) emptyOrdersNotice.style.display = "block";
            return;
        }

        if (emptyOrdersNotice) emptyOrdersNotice.style.display = "none";

        ordersTableBody.innerHTML = filtered.map(order => {
            const itemCount = order.items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
            const firstItemName = order.items[0]?.name || "Product";
            const itemsSummary = order.items.length > 1 
                ? `${firstItemName} +${order.items.length - 1} more` 
                : firstItemName;

            const isPaid = order.paymentStatus === "Paid";
            const paymentPillClass = isPaid ? "pill-status paid" : "pill-status pending";
            const paymentIcon = isPaid ? "fa-circle-check" : "fa-clock";

            let rawPhone = (order.customer.phone || "").replace(/\D/g, "");
            if (rawPhone.startsWith("0")) rawPhone = "233" + rawPhone.slice(1);
            if (!rawPhone.startsWith("233")) rawPhone = "233" + rawPhone;
            const waUrl = `https://wa.me/${rawPhone}?text=Hello%20${encodeURIComponent(order.customer.name)},%20this%20is%20Jarvis%20Computer%20Consult%20regarding%20your%20Order%20%23${order.id}`;

            return `
                <tr>
                    <td>
                        <span class="order-code-badge" onclick="window.viewAdminOrder('${order.id}')" title="Click to view full invoice">
                            #${order.id}
                        </span>
                    </td>
                    <td>
                        <div style="font-weight: 600; color: #fff; font-size: 13px;">${order.dateFormatted || 'Recently'}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                        <span class="cust-name">${order.customer.name}</span>
                        <span class="cust-sub">
                            <i class="fa-solid fa-phone" style="font-size: 10px;"></i> ${order.customer.phone}
                            <a href="${waUrl}" target="_blank" title="WhatsApp Customer"><i class="fa-brands fa-whatsapp"></i></a>
                        </span>
                        <span class="cust-sub" style="margin-top: 2px;">
                            <i class="fa-solid fa-location-dot" style="font-size: 10px; color: var(--primary);"></i> ${order.customer.city}
                        </span>
                    </td>
                    <td>
                        <span style="font-weight: 600; color: #fff;">${itemCount} item${itemCount === 1 ? '' : 's'}</span>
                        <div style="font-size: 11px; color: var(--text-muted); max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">
                            ${itemsSummary}
                        </div>
                    </td>
                    <td>
                        <div class="amount-text">${formatMoney(order.total)}</div>
                        <div style="font-size: 10.5px; color: var(--text-muted); text-transform: uppercase;">${order.deliverySpeed}</div>
                    </td>
                    <td>
                        <div class="${paymentPillClass}">
                            <i class="fa-solid ${paymentIcon}"></i>
                            <span>${order.paymentStatus}</span>
                        </div>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${order.paymentMethod}
                        </div>
                    </td>
                    <td>
                        <select class="status-dropdown" onchange="window.updateOrderStatus('${order.id}', this.value)">
                            <option value="Processing" ${order.orderStatus === 'Processing' ? 'selected' : ''}>⏳ Processing</option>
                            <option value="Shipped" ${order.orderStatus === 'Shipped' ? 'selected' : ''}>🚚 Shipped</option>
                            <option value="Delivered" ${order.orderStatus === 'Delivered' ? 'selected' : ''}>✅ Delivered</option>
                            <option value="Cancelled" ${order.orderStatus === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
                        </select>
                    </td>
                    <td>
                        <div class="table-action-btns">
                            <button class="btn-table-icon" onclick="window.viewAdminOrder('${order.id}')" title="View details and printable invoice">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                            <button class="btn-table-icon danger" onclick="window.deleteAdminOrder('${order.id}')" title="Delete order record">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    window.updateOrderStatus = function (orderId, newStatus) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.orderStatus = newStatus;
            saveOrders();
            updateKPIs();
            renderOrdersTable();
            showToast("Status Updated", `Order #${orderId} marked as ${newStatus}`);
        }
    };

    window.deleteAdminOrder = function (orderId) {
        if (!confirm(`Delete order #${orderId}? This cannot be undone.`)) return;
        orders = orders.filter(o => o.id !== orderId);
        saveOrders();
        updateKPIs();
        renderOrdersTable();
        showToast("Order Deleted", `Order #${orderId} removed from database.`);
    };

    window.viewAdminOrder = function (orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order || !adminOrderModal) return;

        selectedOrderForModal = order;

        if (modalOrderDate) {
            modalOrderDate.textContent = `Order Placed: ${order.dateFormatted || new Date(order.createdAt).toLocaleString()}`;
        }
        if (modalCustomerName) modalCustomerName.textContent = order.customer.name;
        if (modalCustomerPhone) modalCustomerPhone.textContent = order.customer.phone;
        if (modalCustomerEmail) modalCustomerEmail.textContent = order.customer.email;
        if (modalCustomerAddress) {
            modalCustomerAddress.textContent = `${order.customer.city}, ${order.customer.region}`;
        }
        if (modalCustomerGPS) {
            modalCustomerGPS.textContent = `Digital Address: ${order.customer.gpsAddress || 'N/A'}`;
        }
        if (modalCustomerNotes) {
            modalCustomerNotes.textContent = `Delivery Notes: ${order.customer.notes || 'None'}`;
        }
        if (modalPaymentMethod) {
            modalPaymentMethod.textContent = `Payment: ${order.paymentMethod}`;
        }
        if (modalPaymentStatus) {
            modalPaymentStatus.textContent = order.paymentStatus.toUpperCase();
            modalPaymentStatus.className = order.paymentStatus === "Paid" ? "pill-status paid" : "pill-status pending";
        }
        if (modalDeliverySpeed) {
            modalDeliverySpeed.textContent = `Shipping Package: ${order.deliverySpeed.toUpperCase()} (GH₵ ${order.deliveryCost || 35}.00)`;
        }
        if (modalOrderStatusText) {
            modalOrderStatusText.textContent = order.orderStatus;
            modalOrderStatusText.className = `pill-status ${order.orderStatus.toLowerCase()}`;
        }
        if (modalStatusSelect) {
            modalStatusSelect.value = order.orderStatus;
        }

        if (modalItemsBody) {
            modalItemsBody.innerHTML = order.items.map(item => {
                const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                const imgSrc = item.image ? (item.image.startsWith("../") ? item.image : `../${item.image}`) : "../images/logo.png";
                return `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <img src="${imgSrc}" alt="${item.name}" class="modal-thumb" onerror="this.src='../images/logo.png'">
                                <div>
                                    <strong style="display: block; color: #fff;">${item.name}</strong>
                                    <span style="font-size: 11.5px; color: var(--text-muted);">Unit: ${formatMoney(item.price)}</span>
                                </div>
                            </div>
                        </td>
                        <td>${formatMoney(item.price)}</td>
                        <td><strong>${item.quantity}</strong></td>
                        <td style="text-align: right; font-weight: 700; color: #fff;">${formatMoney(itemTotal)}</td>
                    </tr>
                `;
            }).join("");
        }

        if (modalSubtotal) modalSubtotal.textContent = formatMoney(order.subtotal);
        if (modalDeliveryFee) modalDeliveryFee.textContent = formatMoney(order.deliveryCost || 35);
        if (modalDiscountRow) {
            if (order.discount && order.discount > 0) {
                modalDiscountRow.style.display = "flex";
                if (modalDiscount) modalDiscount.textContent = `-${formatMoney(order.discount)}`;
            } else {
                modalDiscountRow.style.display = "none";
            }
        }
        if (modalGrandTotal) modalGrandTotal.textContent = formatMoney(order.total);

        if (modalWhatsAppBtn) {
            let rawPhone = (order.customer.phone || "").replace(/\D/g, "");
            if (rawPhone.startsWith("0")) rawPhone = "233" + rawPhone.slice(1);
            if (!rawPhone.startsWith("233")) rawPhone = "233" + rawPhone;
            modalWhatsAppBtn.href = `https://wa.me/${rawPhone}?text=Hello%20${encodeURIComponent(order.customer.name)},%20this%20is%20Jarvis%20Computer%20Consult%20regarding%20your%20Order%20%23${order.id}.%20Total:%20GH₵%20${order.total}`;
        }

        adminOrderModal.classList.add("active");
    };

    function saveOrders() {
        try {
            localStorage.setItem("orders", JSON.stringify(orders));
        } catch (e) {
            console.error("Save error:", e);
        }
    }

    function renderInventoryGrid() {
        const inventoryGrid = document.getElementById("inventoryGrid");
        if (!inventoryGrid) return;

        const productList = window.products || [];
        if (inventoryTabCount) inventoryTabCount.textContent = productList.length;

        inventoryGrid.innerHTML = productList.map(prod => {
            const imgSrc = prod.image ? (prod.image.startsWith("../") ? prod.image : `../${prod.image}`) : "../images/logo.png";
            return `
                <div class="inv-card">
                    <img src="${imgSrc}" alt="${prod.name}" class="inv-card-img" onerror="this.src='../images/logo.png'">
                    <div class="inv-card-info">
                        <div class="inv-card-title" title="${prod.name}">${prod.name}</div>
                        <div class="inv-card-meta">Cat: ${(prod.category || 'general').toUpperCase()} • ★ ${prod.rating}</div>
                        <div class="inv-card-price">${formatMoney(prod.price)}</div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function exportCsv() {
        if (!orders || orders.length === 0) {
            alert("No orders available to export.");
            return;
        }

        const headers = ["Order ID", "Date", "Customer Name", "Phone", "Email", "City", "Region", "Items Count", "Subtotal", "Delivery Fee", "Discount", "Total (GHS)", "Payment Method", "Payment Status", "Order Status"];
        const rows = orders.map(o => [
            `"${o.id}"`,
            `"${o.createdAt}"`,
            `"${o.customer.name.replace(/"/g, '""')}"`,
            `"${o.customer.phone}"`,
            `"${o.customer.email}"`,
            `"${o.customer.city.replace(/"/g, '""')}"`,
            `"${o.customer.region}"`,
            o.items.length,
            o.subtotal,
            o.deliveryCost || 35,
            o.discount || 0,
            o.total,
            `"${o.paymentMethod.replace(/"/g, '""')}"`,
            `"${o.paymentStatus}"`,
            `"${o.orderStatus}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `jarvis_orders_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function simulateOrder() {
        const demoCustomers = [
            { name: "Kofi Owusu-Ansah", phone: "+233 24 551 9022", email: "kofi.ansah@gmail.com", region: "Greater Accra", city: "Airport Residential, Accra", gpsAddress: "GA-102-4410" },
            { name: "Abena Serwaa Prempeh", phone: "+233 50 123 7890", email: "abena.prempeh@yahoo.com", region: "Ashanti", city: "Danyame, Kumasi", gpsAddress: "AK-190-2211" },
            { name: "Selorm Kwadwo Agbenu", phone: "+233 27 662 1098", email: "selorm.agbenu@outlook.com", region: "Volta", city: "Ho Central", gpsAddress: "VH-012-3301" }
        ];

        const randomCustomer = demoCustomers[Math.floor(Math.random() * demoCustomers.length)];
        const randomId = `JCC-${Math.floor(10000 + Math.random() * 90000)}`;

        const productList = window.products || [];
        const randomProduct = productList.length > 0 
            ? productList[Math.floor(Math.random() * productList.length)]
            : { id: 30, name: "Samsung Galaxy Z Fold 6", price: 18999, image: "images/zfold6.jpg" };

        const qty = Math.floor(1 + Math.random() * 2);
        const subtotal = randomProduct.price * qty;
        const deliveryFee = 35;
        const total = subtotal + deliveryFee;

        const newOrder = {
            id: randomId,
            createdAt: new Date().toISOString(),
            dateFormatted: "Just Now",
            customer: {
                ...randomCustomer,
                notes: "Placed via instant store order simulation."
            },
            items: [
                {
                    id: randomProduct.id,
                    name: randomProduct.name,
                    price: randomProduct.price,
                    quantity: qty,
                    image: randomProduct.image || ""
                }
            ],
            deliverySpeed: "standard",
            deliveryCost: deliveryFee,
            subtotal: subtotal,
            discount: 0,
            total: total,
            paymentMethod: "Mobile Money (MTN MoMo - " + randomCustomer.phone.replace(/\D/g, "").slice(-9) + ")",
            paymentStatus: "Paid",
            orderStatus: "Processing"
        };

        orders.unshift(newOrder);
        saveOrders();
        updateKPIs();
        renderOrdersTable();

        showToast(
            `New Customer Order Placed!`,
            `Order #${newOrder.id} from ${newOrder.customer.name} - ${formatMoney(newOrder.total)}`
        );
    }

    function setupEvents() {
        if (btnUnlockAdmin) {
            btnUnlockAdmin.addEventListener("click", attemptLogin);
        }
        if (adminPasswordInput) {
            adminPasswordInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") attemptLogin();
            });
        }
        if (btnLockPortal) {
            btnLockPortal.addEventListener("click", handleLogout);
        }

        const tabBtns = document.querySelectorAll(".dash-tab-btn");
        tabBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                tabBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                const targetTab = this.dataset.tab;
                document.querySelectorAll(".tab-pane").forEach(p => p.style.display = "none");
                const activePane = document.getElementById(`tab-${targetTab}`);
                if (activePane) activePane.style.display = "block";
            });
        });

        if (orderSearchInput) {
            orderSearchInput.addEventListener("input", function (e) {
                currentSearchTerm = e.target.value;
                renderOrdersTable();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener("change", function (e) {
                currentFilterStatus = e.target.value;
                renderOrdersTable();
            });
        }

        if (paymentFilter) {
            paymentFilter.addEventListener("change", function (e) {
                currentFilterPayment = e.target.value;
                renderOrdersTable();
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener("click", function () {
                loadOrders(true);
                showToast("Orders Refreshed", "Loaded latest orders from storage.");
            });
        }

        if (exportCsvBtn) {
            exportCsvBtn.addEventListener("click", exportCsv);
        }
        if (createDemoOrderBtn) {
            createDemoOrderBtn.addEventListener("click", simulateOrder);
        }
        if (btnPlaceSampleOrder) {
            btnPlaceSampleOrder.addEventListener("click", simulateOrder);
        }

        if (clearAllOrdersBtn) {
            clearAllOrdersBtn.addEventListener("click", function () {
                if (confirm("Reset all orders? You can simulate test orders anytime.")) {
                    orders = [];
                    saveOrders();
                    updateKPIs();
                    renderOrdersTable();
                    showToast("Orders Cleared", "Order records reset.");
                }
            });
        }

        if (closeOrderModalBtn && adminOrderModal) {
            closeOrderModalBtn.addEventListener("click", () => {
                adminOrderModal.classList.remove("active");
            });
            adminOrderModal.addEventListener("click", (e) => {
                if (e.target === adminOrderModal) adminOrderModal.classList.remove("active");
            });
        }

        if (modalStatusSelect) {
            modalStatusSelect.addEventListener("change", function () {
                if (selectedOrderForModal) {
                    window.updateOrderStatus(selectedOrderForModal.id, this.value);
                    if (modalOrderStatusText) {
                        modalOrderStatusText.textContent = this.value;
                        modalOrderStatusText.className = `pill-status ${this.value.toLowerCase()}`;
                    }
                }
            });
        }

        if (modalPrintBtn) {
            modalPrintBtn.addEventListener("click", function () {
                window.print();
            });
        }

        // Live Cross-tab listening to customer website!
        window.addEventListener("storage", function (e) {
            if (e.key === "orders") {
                loadOrders(false);
            }
        });

        // Polling fallback every 2 seconds
        setInterval(() => {
            if (sessionStorage.getItem("adminAuth") === "true") {
                try {
                    const currentStored = JSON.parse(localStorage.getItem("orders")) || [];
                    if (currentStored.length !== lastKnownOrdersCount) {
                        loadOrders(false);
                    }
                } catch (err) {}
            }
        }, 2000);
    }

    function initPortal() {
        checkAuth();
        setupEvents();
        renderInventoryGrid();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPortal);
    } else {
        initPortal();
    }

})();
