/* =========================================
   JARVIS COMPUTER CONSULT
   ADMIN DASHBOARD & ORDER MANAGEMENT LOGIC
========================================= */

(function () {
    "use strict";

    // Orders state
    let orders = [];
    let currentFilterStatus = "all";
    let currentFilterPayment = "all";
    let currentSearchTerm = "";
    let selectedOrderForModal = null;
    let lastKnownOrdersCount = 0;

    // DOM Elements
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

    // Modal Elements
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

    // Toast Alert
    const orderToast = document.getElementById("orderToast");
    const toastTitle = document.getElementById("toastTitle");
    const toastDesc = document.getElementById("toastDesc");

    // Format Money in GH₵
    function formatMoney(amount) {
        return `GH₵ ${Number(amount).toLocaleString("en-GH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    // Play subtle audio chime for new orders
    function playOrderChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch (e) {
            // AudioContext not allowed without gesture, safe to ignore
        }
    }

    // Show floating toast alert
    function showToast(title, desc) {
        if (!orderToast) return;
        if (toastTitle) toastTitle.textContent = title;
        if (toastDesc) toastDesc.textContent = desc;
        orderToast.classList.add("visible");
        playOrderChime();
        setTimeout(() => {
            orderToast.classList.remove("visible");
        }, 5000);
    }

    // Sample initial orders if localStorage is empty
    const SAMPLE_ORDERS = [
        {
            id: "JCC-92410",
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            dateFormatted: "Today, 10:15 AM",
            customer: {
                name: "Nana Kwame Boateng",
                phone: "+233 24 492 8110",
                email: "boateng.kwame@gmail.com",
                region: "Greater Accra",
                city: "East Legon, Accra",
                gpsAddress: "GA-182-9014",
                notes: "Please call when you reach the Shell filling station."
            },
            items: [
                {
                    id: 30,
                    name: "Samsung Galaxy Z Fold 6",
                    price: 18999,
                    quantity: 1,
                    image: "images/zfold6.jpg"
                },
                {
                    id: 42,
                    name: "Apple Watch Ultra 2",
                    price: 8999,
                    quantity: 1,
                    image: "images/applewatchultra.jpg"
                }
            ],
            deliverySpeed: "express",
            deliveryCost: 60,
            subtotal: 27998,
            discount: 0,
            total: 28058,
            paymentMethod: "Mobile Money (MTN MoMo - 0244928110)",
            paymentStatus: "Paid",
            orderStatus: "Processing"
        },
        {
            id: "JCC-88125",
            createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
            dateFormatted: "Today, 4:20 AM",
            customer: {
                name: "Akosua Adobea Mensah",
                phone: "+233 20 812 3456",
                email: "adobea.mensah@techhub.gh",
                region: "Ashanti",
                city: "Kumasi, Ahodwo",
                gpsAddress: "AK-045-8891",
                notes: "Office delivery at reception."
            },
            items: [
                {
                    id: 35,
                    name: "Apple MacBook Air 15\" M3",
                    price: 15499,
                    quantity: 1,
                    image: "images/macbookair.jpg"
                },
                {
                    id: 40,
                    name: "Sony WH-1000XM5 Wireless Headphones",
                    price: 3899,
                    quantity: 1,
                    image: "images/sonyheadphones.jpg"
                }
            ],
            deliverySpeed: "standard",
            deliveryCost: 35,
            subtotal: 19398,
            discount: 1939.8,
            couponCode: "JARVIS10",
            total: 17493.2,
            paymentMethod: "Visa Card (ending in •••• 4192)",
            paymentStatus: "Paid",
            orderStatus: "Shipped"
        },
        {
            id: "JCC-74192",
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            dateFormatted: "Yesterday, 2:45 PM",
            customer: {
                name: "Dr. Emmanuel Osei-Tutu",
                phone: "+233 55 901 2234",
                email: "dr.oseitutu@ug.edu.gh",
                region: "Greater Accra",
                city: "Legon Campus, Accra",
                gpsAddress: "GA-002-1400",
                notes: "Deliver to Faculty Office."
            },
            items: [
                {
                    id: 1,
                    name: "Premium Laptop Pro",
                    price: 5499,
                    quantity: 2,
                    image: "images/laptop.jpg"
                }
            ],
            deliverySpeed: "standard",
            deliveryCost: 35,
            subtotal: 10998,
            discount: 0,
            total: 11033,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Paid",
            orderStatus: "Delivered"
        }
    ];

    // Load orders from LocalStorage
    function loadOrders(suppressToast = false) {
        let stored = null;
        try {
            stored = JSON.parse(localStorage.getItem("orders"));
        } catch (e) {
            stored = null;
        }

        if (!stored || !Array.isArray(stored) || stored.length === 0) {
            // First time initialization with realistic demo data
            orders = [...SAMPLE_ORDERS];
            localStorage.setItem("orders", JSON.stringify(orders));
        } else {
            orders = stored;
        }

        // Detect newly placed order in real-time
        if (!suppressToast && lastKnownOrdersCount > 0 && orders.length > lastKnownOrdersCount) {
            const newest = orders[0];
            showToast(
                `New Order Placed: #${newest.id}`,
                `${newest.customer.name} just ordered for ${formatMoney(newest.total)} (${newest.paymentMethod})`
            );
        }

        lastKnownOrdersCount = orders.length;

        updateKPIs();
        renderOrdersTable();
    }

    // Update KPI Metrics Cards
    function updateKPIs() {
        const totalCount = orders.length;

        // Sum of all paid revenue
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

    // Render Orders Table
    function renderOrdersTable() {
        if (!ordersTableBody) return;

        // Apply filters
        let filtered = orders.filter(order => {
            // Status filter
            if (currentFilterStatus !== "all" && order.orderStatus !== currentFilterStatus) {
                return false;
            }

            // Payment filter
            if (currentFilterPayment === "Paid" && order.paymentStatus !== "Paid") {
                return false;
            }
            if (currentFilterPayment === "Pending" && order.paymentStatus === "Paid") {
                return false;
            }

            // Search filter
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
            const firstItemName = order.items[0]?.name || "Item";
            const itemsSummary = order.items.length > 1 
                ? `${firstItemName} +${order.items.length - 1} more` 
                : firstItemName;

            const isPaid = order.paymentStatus === "Paid";
            const paymentPillClass = isPaid ? "status-pill paid" : "status-pill pending";
            const paymentIcon = isPaid ? "fa-circle-check" : "fa-clock";

            // WhatsApp phone link format (cleaning +233 or 0)
            let rawPhone = (order.customer.phone || "").replace(/\D/g, "");
            if (rawPhone.startsWith("0")) rawPhone = "233" + rawPhone.slice(1);
            if (!rawPhone.startsWith("233")) rawPhone = "233" + rawPhone;
            const waUrl = `https://wa.me/${rawPhone}?text=Hello%20${encodeURIComponent(order.customer.name)},%20this%20is%20Jarvis%20Computer%20Consult%20regarding%20your%20Order%20%23${order.id}`;

            return `
                <tr>
                    <td>
                        <span class="order-id-badge" onclick="window.viewAdminOrder('${order.id}')" title="Click to view full invoice">
                            #${order.id}
                        </span>
                    </td>
                    <td>
                        <div style="font-weight: 600; color: var(--dark); font-size: 13px;">${order.dateFormatted || 'Recently'}</div>
                        <div style="font-size: 11px; color: var(--muted);">${new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                        <div class="customer-cell">
                            <span class="customer-name">${order.customer.name}</span>
                            <span class="customer-contact">
                                <i class="fa-solid fa-phone" style="font-size: 10px;"></i> ${order.customer.phone}
                                <a href="${waUrl}" target="_blank" title="WhatsApp Customer"><i class="fa-brands fa-whatsapp"></i></a>
                            </span>
                            <span style="font-size: 11.5px; color: var(--muted); margin-top: 2px;">
                                <i class="fa-solid fa-location-dot" style="font-size: 10px; color: var(--primary);"></i> ${order.customer.city}
                            </span>
                        </div>
                    </td>
                    <td>
                        <div class="items-preview-badge" title="${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}">
                            <i class="fa-solid fa-box-open" style="color: var(--primary);"></i>
                            <span>${itemCount} item${itemCount === 1 ? '' : 's'}</span>
                        </div>
                        <div style="font-size: 11.5px; color: var(--muted); max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 3px;">
                            ${itemsSummary}
                        </div>
                    </td>
                    <td>
                        <div class="amount-cell">${formatMoney(order.total)}</div>
                        <div style="font-size: 11px; color: var(--muted);">${order.deliverySpeed.toUpperCase()}</div>
                    </td>
                    <td>
                        <div class="${paymentPillClass}">
                            <i class="fa-solid ${paymentIcon}"></i>
                            <span>${order.paymentStatus}</span>
                        </div>
                        <div style="font-size: 11px; color: var(--muted); margin-top: 4px; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${order.paymentMethod}
                        </div>
                    </td>
                    <td>
                        <select class="status-selector" onchange="window.updateOrderStatus('${order.id}', this.value)" title="Change fulfillment status">
                            <option value="Processing" ${order.orderStatus === 'Processing' ? 'selected' : ''}>⏳ Processing</option>
                            <option value="Shipped" ${order.orderStatus === 'Shipped' ? 'selected' : ''}>🚚 Shipped</option>
                            <option value="Delivered" ${order.orderStatus === 'Delivered' ? 'selected' : ''}>✅ Delivered</option>
                            <option value="Cancelled" ${order.orderStatus === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
                        </select>
                    </td>
                    <td>
                        <div class="action-btn-group">
                            <button class="btn-action-icon" onclick="window.viewAdminOrder('${order.id}')" title="View details and printable invoice">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                            <button class="btn-action-icon delete" onclick="window.deleteAdminOrder('${order.id}')" title="Delete order record">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    // Update order fulfillment status
    window.updateOrderStatus = function (orderId, newStatus) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.orderStatus = newStatus;
            saveOrdersToStorage();
            updateKPIs();
            renderOrdersTable();
            showToast("Status Updated", `Order #${orderId} marked as ${newStatus}`);
        }
    };

    // Delete single order
    window.deleteAdminOrder = function (orderId) {
        if (!confirm(`Are you sure you want to delete order #${orderId}? This cannot be undone.`)) {
            return;
        }

        orders = orders.filter(o => o.id !== orderId);
        saveOrdersToStorage();
        updateKPIs();
        renderOrdersTable();
        showToast("Order Deleted", `Order #${orderId} removed from records.`);
    };

    // Open detailed order modal & invoice
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
            modalPaymentStatus.className = order.paymentStatus === "Paid" ? "status-pill paid" : "status-pill pending";
        }
        if (modalDeliverySpeed) {
            modalDeliverySpeed.textContent = `Shipping Package: ${order.deliverySpeed.toUpperCase()} (GH₵ ${order.deliveryCost || 35}.00)`;
        }
        if (modalOrderStatusText) {
            modalOrderStatusText.textContent = order.orderStatus;
            modalOrderStatusText.className = `status-pill ${order.orderStatus.toLowerCase()}`;
        }
        if (modalStatusSelect) {
            modalStatusSelect.value = order.orderStatus;
        }

        // Render Ordered Items
        if (modalItemsBody) {
            modalItemsBody.innerHTML = order.items.map(item => {
                const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
                return `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                ${item.image 
                                    ? `<img src="${item.image}" alt="${item.name}" class="modal-item-thumb" onerror="this.src='images/logo.png'">`
                                    : `<div class="modal-item-thumb" style="display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-laptop"></i></div>`
                                }
                                <div>
                                    <strong style="display: block; color: var(--dark);">${item.name}</strong>
                                    <span style="font-size: 11.5px; color: var(--muted);">Unit: ${formatMoney(item.price)}</span>
                                </div>
                            </div>
                        </td>
                        <td>${formatMoney(item.price)}</td>
                        <td><strong>${item.quantity}</strong></td>
                        <td style="text-align: right; font-weight: 700;">${formatMoney(itemTotal)}</td>
                    </tr>
                `;
            }).join("");
        }

        // Totals
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

        // WhatsApp Customer link
        if (modalWhatsAppBtn) {
            let rawPhone = (order.customer.phone || "").replace(/\D/g, "");
            if (rawPhone.startsWith("0")) rawPhone = "233" + rawPhone.slice(1);
            if (!rawPhone.startsWith("233")) rawPhone = "233" + rawPhone;
            modalWhatsAppBtn.href = `https://wa.me/${rawPhone}?text=Hello%20${encodeURIComponent(order.customer.name)},%20this%20is%20Jarvis%20Computer%20Consult%20regarding%20your%20Order%20%23${order.id}.%20Total:%20GH₵%20${order.total}`;
        }

        adminOrderModal.classList.add("active");
    };

    // Save orders into localStorage
    function saveOrdersToStorage() {
        try {
            localStorage.setItem("orders", JSON.stringify(orders));
        } catch (e) {
            console.error("Storage save error:", e);
        }
    }

    // Render Store Products in Inventory Tab
    function renderInventoryGrid() {
        const inventoryGrid = document.getElementById("inventoryGrid");
        if (!inventoryGrid) return;

        // Check if global products array exists from shop.js
        const productList = window.products || [];
        if (inventoryTabCount) inventoryTabCount.textContent = productList.length;

        inventoryGrid.innerHTML = productList.map(prod => `
            <div class="inventory-card">
                ${prod.image 
                    ? `<img src="${prod.image}" alt="${prod.name}" class="inv-img" onerror="this.src='images/logo.png'">`
                    : `<div class="inv-img" style="display:flex;align-items:center;justify-content:center;color:#6c4df6;"><i class="fa-solid ${prod.icon || 'fa-box'}"></i></div>`
                }
                <div class="inv-details">
                    <div class="inv-title" title="${prod.name}">${prod.name}</div>
                    <div class="inv-meta">Category: ${(prod.category || 'general').toUpperCase()} • ★ ${prod.rating}</div>
                    <div class="inv-price">${formatMoney(prod.price)}</div>
                </div>
            </div>
        `).join("");
    }

    // Export orders to CSV file
    function exportOrdersCsv() {
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

    // Simulate customer placing a test order
    function createDemoOrder() {
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
        saveOrdersToStorage();
        updateKPIs();
        renderOrdersTable();

        showToast(
            `New Customer Order Placed!`,
            `Order #${newOrder.id} from ${newOrder.customer.name} - ${formatMoney(newOrder.total)}`
        );
    }

    // Attach DOM event listeners
    function setupAdminEvents() {
        // Tab switching
        const tabBtns = document.querySelectorAll(".view-tab-btn");
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

        // Search input
        if (orderSearchInput) {
            orderSearchInput.addEventListener("input", function (e) {
                currentSearchTerm = e.target.value;
                renderOrdersTable();
            });
        }

        // Status Filter
        if (statusFilter) {
            statusFilter.addEventListener("change", function (e) {
                currentFilterStatus = e.target.value;
                renderOrdersTable();
            });
        }

        // Payment Filter
        if (paymentFilter) {
            paymentFilter.addEventListener("change", function (e) {
                currentFilterPayment = e.target.value;
                renderOrdersTable();
            });
        }

        // Refresh Button
        if (refreshBtn) {
            refreshBtn.addEventListener("click", function () {
                loadOrders(true);
                showToast("Orders Refreshed", "Loaded latest orders from storage.");
            });
        }

        // Export CSV
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener("click", exportOrdersCsv);
        }

        // Create Demo Order
        if (createDemoOrderBtn) {
            createDemoOrderBtn.addEventListener("click", createDemoOrder);
        }
        if (btnPlaceSampleOrder) {
            btnPlaceSampleOrder.addEventListener("click", createDemoOrder);
        }

        // Reset / Clear Orders
        if (clearAllOrdersBtn) {
            clearAllOrdersBtn.addEventListener("click", function () {
                if (confirm("Reset all orders in localStorage? You can generate new test orders anytime.")) {
                    orders = [];
                    saveOrdersToStorage();
                    updateKPIs();
                    renderOrdersTable();
                    showToast("Orders Cleared", "Order records have been reset.");
                }
            });
        }

        // Modal close
        if (closeOrderModalBtn && adminOrderModal) {
            closeOrderModalBtn.addEventListener("click", () => {
                adminOrderModal.classList.remove("active");
            });

            adminOrderModal.addEventListener("click", (e) => {
                if (e.target === adminOrderModal) {
                    adminOrderModal.classList.remove("active");
                }
            });
        }

        // Modal status changer
        if (modalStatusSelect) {
            modalStatusSelect.addEventListener("change", function () {
                if (selectedOrderForModal) {
                    window.updateOrderStatus(selectedOrderForModal.id, this.value);
                    if (modalOrderStatusText) {
                        modalOrderStatusText.textContent = this.value;
                        modalOrderStatusText.className = `status-pill ${this.value.toLowerCase()}`;
                    }
                }
            });
        }

        // Modal print
        if (modalPrintBtn) {
            modalPrintBtn.addEventListener("click", function () {
                window.print();
            });
        }

        // Storage listener for cross-tab real-time updates!
        window.addEventListener("storage", function (e) {
            if (e.key === "orders") {
                loadOrders(false);
            }
        });

        // Polling fallback every 2.5 seconds to guarantee instant responsiveness
        setInterval(() => {
            try {
                const currentStored = JSON.parse(localStorage.getItem("orders")) || [];
                if (currentStored.length !== lastKnownOrdersCount) {
                    loadOrders(false);
                }
            } catch (err) {}
        }, 2500);
    }

    // Initialize Admin
    function initAdmin() {
        loadOrders(true);
        setupAdminEvents();
        renderInventoryGrid();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAdmin);
    } else {
        initAdmin();
    }

})();
