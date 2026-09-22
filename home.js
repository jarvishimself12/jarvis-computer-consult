// ==========================================
// CART
// ==========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartButton = document.getElementById("cartButton");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");


// ==========================================
// OPEN CART
// ==========================================

cartButton.addEventListener("click", function () {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

    renderCart();

});


// ==========================================
// CLOSE CART
// ==========================================

function hideCart() {

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

}

closeCart.addEventListener("click", hideCart);
cartOverlay.addEventListener("click", hideCart);


// ==========================================
// ADD TO CART
// ==========================================

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const image = button.dataset.image || "";

        const existingProduct = cart.find(
            item => item.name === name
        );

        if (existingProduct) {

            existingProduct.quantity++;
            if (!existingProduct.image && image) {
                existingProduct.image = image;
            }

        } else {

            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });

        }

        saveCart();
        updateCartCount();

        button.innerHTML = '<i class="fa-solid fa-check"></i>';

        setTimeout(function () {

            button.innerHTML = '<i class="fa-solid fa-plus"></i>';

        }, 1000);

    });

});


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;

}


// ==========================================
// DISPLAY CART
// ==========================================

function renderCart() {

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products to your cart to see them here.
                </p>

            </div>
        `;

        cartTotal.textContent = "GH₵ 0.00";

        return;
    }


    cartItems.innerHTML = "";

    let total = 0;


    cart.forEach(function (item, index) {

        total += item.price * item.quantity;


        const cartItem = document.createElement("div");

        cartItem.style.cssText = `
            display: flex;
            gap: 12px;
            padding: 15px 0;
            border-bottom: 1px solid #eeeeee;
        `;


        cartItem.innerHTML = `

            <div style="
                width: 60px;
                height: 60px;
                border-radius: 10px;
                background: #f3f3f5;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #bcb8ca;
                flex-shrink: 0;
                overflow: hidden;
            ">

                ${item.image
                    ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : `<i class="fa-solid fa-box"></i>`
                }

            </div>


            <div style="flex: 1;">

                <strong style="
                    display: block;
                    font-size: 12px;
                    margin-bottom: 5px;
                ">
                    ${item.name}
                </strong>


                <span style="
                    display: block;
                    color: #6c4df6;
                    font-size: 12px;
                    font-weight: 700;
                ">
                    GH₵ ${item.price.toLocaleString()}
                </span>


                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 8px;
                ">

                    <button
                        onclick="changeQuantity(${index}, -1)"
                        style="
                            width: 25px;
                            height: 25px;
                            border: 1px solid #ddd;
                            background: white;
                            border-radius: 5px;
                        "
                    >
                        -
                    </button>


                    <span style="
                        font-size: 12px;
                        font-weight: 600;
                    ">
                        ${item.quantity}
                    </span>


                    <button
                        onclick="changeQuantity(${index}, 1)"
                        style="
                            width: 25px;
                            height: 25px;
                            border: 1px solid #ddd;
                            background: white;
                            border-radius: 5px;
                        "
                    >
                        +
                    </button>


                    <button
                        onclick="removeFromCart(${index})"
                        style="
                            margin-left: auto;
                            border: none;
                            background: transparent;
                            color: #ef4444;
                            font-size: 11px;
                        "
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;


        cartItems.appendChild(cartItem);

    });


    cartTotal.textContent =
        "GH₵ " + total.toLocaleString(
            "en-GH",
            {
                minimumFractionDigits: 2
            }
        );

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();
    updateCartCount();
    renderCart();

}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();
    updateCartCount();
    renderCart();

}


// ==========================================
// SEARCH
// ==========================================

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function performSearch() {

    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {

        alert("Please enter a product to search.");

        searchInput.focus();

        return;
    }

    window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;

}

searchButton.addEventListener(
    "click",
    performSearch
);

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            performSearch();
        }

    }
);


// ==========================================
// ACCOUNT
// ==========================================

const accountButton =
    document.getElementById("accountButton");

if (accountButton) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const navSignInLink = document.getElementById("navSignInLink");

    if (currentUser && currentUser.name) {

        const accountActionText = accountButton.querySelector("strong");

        if (accountActionText) {
            accountActionText.textContent = currentUser.name.split(" ")[0];
        }

        if (navSignInLink) {
            navSignInLink.innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket"></i> Log Out`;
            navSignInLink.href = "javascript:void(0)";
            navSignInLink.style.color = "#dc2626";
            navSignInLink.addEventListener("click", function (e) {
                e.preventDefault();
                const confirmLogout = confirm(`Log out from ${currentUser.name}?`);
                if (confirmLogout) {
                    localStorage.removeItem("currentUser");
                    window.location.reload();
                }
            });
        }

    }

    accountButton.addEventListener(
        "click",
        function (e) {

            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if (currentUser) {
                e.preventDefault();
                const confirmLogout = confirm(
                    `Logged in as ${currentUser.name} (${currentUser.email || "active account"}).\n\nDo you want to log out?`
                );

                if (confirmLogout) {
                    localStorage.removeItem("currentUser");
                    window.location.reload();
                }

            }

        }
    );

}


// ==========================================
// CATEGORIES BUTTON
// ==========================================

const categoriesButton = document.querySelector(".categories-button");

if (categoriesButton) {
    categoriesButton.addEventListener("click", function () {
        const categoriesSection = document.getElementById("categories");
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: "smooth" });
        } else {
            window.location.href = "shop.html";
        }
    });
}


// ==========================================
// INITIALIZE
// ==========================================

updateCartCount();