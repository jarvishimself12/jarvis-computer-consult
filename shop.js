/* =========================================
   JARVIS TECHNOLOGY HUB
   SHOP PAGE JAVASCRIPT
========================================= */


/* =========================================
   PRODUCT DATABASE
========================================= */

const products = [

    {
        id: 1,
        name: "Premium Laptop",
        category: "computers",
        price: 5499,
        rating: 4.8,
        reviews: 24,
        image: "images/laptop.jpg",
        icon: "fa-laptop",
        badge: "Featured"
    },

    {
        id: 2,
        name: "Samsung Smartphone",
        category: "phones",
        price: 2899,
        rating: 4.7,
        reviews: 31,
        image: "images/phone.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Popular"
    },

    {
        id: 3,
        name: "Wireless Headphones",
        category: "accessories",
        price: 499,
        rating: 4.6,
        reviews: 18,
        image: "images/headphones.jpg",
        icon: "fa-headphones",
        badge: "New"
    },

    {
        id: 4,
        name: "Wireless Keyboard",
        category: "accessories",
        price: 299,
        rating: 4.5,
        reviews: 15,
        image: "images/keyboard.jpg",
        icon: "fa-keyboard",
        badge: ""
    },

    {
        id: 5,
        name: "Gaming Mouse",
        category: "accessories",
        price: 249,
        rating: 4.7,
        reviews: 20,
        image: "images/mouse.jpg",
        icon: "fa-computer-mouse",
        badge: "Popular"
    },

    {
        id: 6,
        name: "Laptop Backpack",
        category: "accessories",
        price: 350,
        rating: 4.4,
        reviews: 12,
        image: "images/backpack.jpg",
        icon: "fa-bag-shopping",
        badge: ""
    },

    {
        id: 7,
        name: "Smart Watch",
        category: "accessories",
        price: 699,
        rating: 4.6,
        reviews: 17,
        image: "images/smartwatch.jpg",
        icon: "fa-clock",
        badge: "New"
    },

    {
        id: 8,
        name: "Office Chair",
        category: "office",
        price: 1250,
        rating: 4.5,
        reviews: 9,
        image: "images/chair.jpg",
        icon: "fa-chair",
        badge: ""
    },

    {
        id: 9,
        name: "Wireless Speaker",
        category: "accessories",
        price: 599,
        rating: 4.7,
        reviews: 22,
        image: "images/speaker.jpg",
        icon: "fa-volume-high",
        badge: "Popular"
    },

    {
        id: 10,
        name: "Men's Casual Shirt",
        category: "fashion",
        price: 180,
        rating: 4.3,
        reviews: 11,
        image: "images/shirt.jpg",
        icon: "fa-shirt",
        badge: ""
    },

    {
        id: 11,
        name: "USB-C Fast Charger",
        category: "accessories",
        price: 199,
        rating: 4.8,
        reviews: 28,
        image: "images/charger.jpg",
        icon: "fa-plug",
        badge: "Best Seller"
    },

    {
        id: 12,
        name: "Graphic Design Service",
        category: "services",
        price: 300,
        rating: 5.0,
        reviews: 8,
        image: "images/design.jpg",
        icon: "fa-pen-nib",
        badge: "Service"
    },

    {
        id: 13,
        name: "Apple iPhone 15 Pro",
        category: "phones",
        price: 12500,
        rating: 4.9,
        reviews: 42,
        image: "images/iphone.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Flagship"
    },

    {
        id: 14,
        name: "Pro Wireless Earbuds",
        category: "accessories",
        price: 349,
        rating: 4.8,
        reviews: 35,
        image: "images/earbuds.jpg",
        icon: "fa-headphones",
        badge: "Best Seller"
    },

    {
        id: 15,
        name: "Phone Shop Display Bundle",
        category: "phones",
        price: 3200,
        rating: 4.7,
        reviews: 19,
        image: "images/phoneshop.jpg",
        icon: "fa-shop",
        badge: "Hot Deal"
    },

    {
        id: 16,
        name: "PlayStation 5 Pro Console",
        category: "gaming",
        price: 8999,
        rating: 4.9,
        reviews: 48,
        image: "images/console.jpg",
        icon: "fa-gamepad",
        badge: "Hot Deal"
    },

    {
        id: 17,
        name: "Wi-Fi 6 Gigabit Smart Router",
        category: "networking",
        price: 799,
        rating: 4.8,
        reviews: 32,
        image: "images/router.jpg",
        icon: "fa-wifi",
        badge: "Popular"
    },

    {
        id: 18,
        name: "Smart 4K Security CCTV Camera",
        category: "networking",
        price: 850,
        rating: 4.7,
        reviews: 29,
        image: "images/camera.jpg",
        icon: "fa-shield-halved",
        badge: "Security"
    },

    {
        id: 19,
        name: "1TB Rugged High-Speed Portable SSD",
        category: "storage",
        price: 1250,
        rating: 4.9,
        reviews: 37,
        image: "images/ssd.jpg",
        icon: "fa-hard-drive",
        badge: "Ultra Fast"
    },

    {
        id: 20,
        name: "All-in-One Wireless Color Laser Printer",
        category: "printers",
        price: 3450,
        rating: 4.7,
        reviews: 21,
        image: "images/printer.jpg",
        icon: "fa-print",
        badge: "Office Tech"
    },

    {
        id: 21,
        name: "RGB Esports Gaming Headset",
        category: "gaming",
        price: 650,
        rating: 4.8,
        reviews: 44,
        image: "images/gaming_headset.jpg",
        icon: "fa-headset",
        badge: "RGB"
    },

    {
        id: 22,
        name: "2TB Slim External Backup Hard Drive",
        category: "storage",
        price: 699,
        rating: 4.6,
        reviews: 26,
        image: "images/harddrive.jpg",
        icon: "fa-hard-drive",
        badge: "Backup"
    },

    {
        id: 23,
        name: "Apple iPhone 16 Pro Max",
        category: "phones",
        price: 16999,
        rating: 4.9,
        reviews: 54,
        image: "images/iphone16.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Latest Flagship"
    },

    {
        id: 24,
        name: "Samsung Galaxy S24 Ultra",
        category: "phones",
        price: 14500,
        rating: 4.9,
        reviews: 49,
        image: "images/s24ultra.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Galaxy AI"
    },

    {
        id: 25,
        name: "Google Pixel 9 Pro",
        category: "phones",
        price: 11800,
        rating: 4.8,
        reviews: 33,
        image: "images/pixel9.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Gemini AI"
    },

    {
        id: 26,
        name: "Apple MacBook Pro 16\" M3 Max",
        category: "computers",
        price: 24999,
        rating: 5.0,
        reviews: 38,
        image: "images/macbook.jpg",
        icon: "fa-laptop",
        badge: "Pro Power"
    },

    {
        id: 27,
        name: "Dell XPS 16 OLED Laptop",
        category: "computers",
        price: 19500,
        rating: 4.8,
        reviews: 27,
        image: "images/dellxps.jpg",
        icon: "fa-laptop",
        badge: "OLED Infinity"
    },

    {
        id: 28,
        name: "ASUS ROG Strix SCAR 18 Gaming Laptop",
        category: "computers",
        price: 22800,
        rating: 4.9,
        reviews: 41,
        image: "images/asusrog.jpg",
        icon: "fa-laptop",
        badge: "Gaming Beast"
    },

    {
        id: 29,
        name: "Apple iPhone 18 Pro Max",
        category: "phones",
        price: 19999,
        rating: 5.0,
        reviews: 68,
        image: "images/iphone18.png",
        icon: "fa-mobile-screen-button",
        badge: "Pre-Order"
    },

    {
        id: 30,
        name: "Samsung Galaxy Z Fold 6",
        category: "phones",
        price: 18999,
        rating: 4.9,
        reviews: 52,
        image: "images/zfold6.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Foldable AI"
    },

    {
        id: 31,
        name: "Samsung Galaxy Z Flip 6",
        category: "phones",
        price: 12999,
        rating: 4.8,
        reviews: 41,
        image: "images/zflip6.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Compact AI"
    },

    {
        id: 32,
        name: "Google Pixel 9 Pro Fold",
        category: "phones",
        price: 19500,
        rating: 4.9,
        reviews: 36,
        image: "images/pixel9fold.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Gemini Pro"
    },

    {
        id: 33,
        name: "OnePlus 12",
        category: "phones",
        price: 9999,
        rating: 4.8,
        reviews: 45,
        image: "images/oneplus12.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Flagship"
    },

    {
        id: 34,
        name: "Xiaomi 14 Ultra",
        category: "phones",
        price: 13999,
        rating: 4.9,
        reviews: 38,
        image: "images/xiaomi14ultra.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Leica Optics"
    },

    {
        id: 35,
        name: "Apple MacBook Air 15\" M3",
        category: "computers",
        price: 15499,
        rating: 4.9,
        reviews: 44,
        image: "images/macbookair.jpg",
        icon: "fa-laptop",
        badge: "M3 Silicon"
    },

    {
        id: 36,
        name: "Lenovo ThinkPad X1 Carbon Gen 12",
        category: "computers",
        price: 17800,
        rating: 4.8,
        reviews: 29,
        image: "images/thinkpad.jpg",
        icon: "fa-laptop",
        badge: "Business Pro"
    },

    {
        id: 37,
        name: "HP Spectre x360 16 2-in-1",
        category: "computers",
        price: 16500,
        rating: 4.7,
        reviews: 31,
        image: "images/hpspectre.jpg",
        icon: "fa-laptop",
        badge: "2-in-1 OLED"
    },

    {
        id: 38,
        name: "Razer Blade 16 Gaming Laptop",
        category: "computers",
        price: 26500,
        rating: 4.9,
        reviews: 35,
        image: "images/razerblade.jpg",
        icon: "fa-laptop",
        badge: "RTX 4090"
    },

    {
        id: 39,
        name: "Microsoft Surface Laptop 7 Copilot+ PC",
        category: "computers",
        price: 14200,
        rating: 4.8,
        reviews: 27,
        image: "images/surfacelaptop.jpg",
        icon: "fa-laptop",
        badge: "Copilot+ AI"
    },

    {
        id: 40,
        name: "Sony WH-1000XM5 Wireless Headphones",
        category: "accessories",
        price: 3899,
        rating: 4.9,
        reviews: 68,
        image: "images/sonyheadphones.jpg",
        icon: "fa-headphones",
        badge: "Noise Canceling"
    },

    {
        id: 41,
        name: "Nintendo Switch OLED Model",
        category: "gaming",
        price: 4200,
        rating: 4.8,
        reviews: 59,
        image: "images/nintendoswitch.jpg",
        icon: "fa-gamepad",
        badge: "OLED Gaming"
    },

    {
        id: 42,
        name: "Apple Watch Ultra 2",
        category: "accessories",
        price: 8999,
        rating: 4.9,
        reviews: 42,
        image: "images/applewatchultra.jpg",
        icon: "fa-clock",
        badge: "Titanium GPS"
    }

];


/* =========================================
   CART
========================================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* =========================================
   DOM ELEMENTS
========================================= */

const productGrid = document.getElementById("productGrid");

const productCount = document.getElementById("productCount");

const noProducts = document.getElementById("noProducts");

const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const sortProducts = document.getElementById("sortProducts");

const clearFilters = document.getElementById("clearFilters");

const minPrice = document.getElementById("minPrice");

const maxPrice = document.getElementById("maxPrice");

const applyPrice = document.getElementById("applyPrice");

const cartButton = document.getElementById("cartButton");

const cartSidebar = document.getElementById("cartSidebar");

const cartOverlay = document.getElementById("cartOverlay");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

const accountButton = document.getElementById("accountButton");

const checkoutButton = document.getElementById("checkoutButton");


/* =========================================
   CURRENT FILTERS
========================================= */

const shopUrlParams = new URLSearchParams(window.location.search);
const initialCategory = shopUrlParams.get("category");
const initialSearch = shopUrlParams.get("search");

let currentCategory = initialCategory || "all";

let currentSearch = initialSearch || "";

let currentMinPrice = 0;

let currentMaxPrice = Infinity;


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(price) {

    return `GH₵ ${price.toLocaleString("en-GH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

}


/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createProductCard(product) {

    const stars = "★".repeat(Math.floor(product.rating));

    const emptyStars = "☆".repeat(5 - Math.floor(product.rating));

    return `

        <article class="product-card">

            <div class="product-image">

                ${product.badge
            ? `<span class="product-badge">
                            ${product.badge}
                           </span>`
            : ""
        }

                <button
                    class="wishlist"
                    data-product-id="${product.id}"
                    aria-label="Add ${product.name} to wishlist"
                >

                    <i class="fa-regular fa-heart"></i>

                </button>

                ${product.image
                    ? `<a href="product.html?id=${product.id}" style="display:flex; width:100%; height:100%; align-items:center; justify-content:center;"><img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.style.display='none'; this.parentElement.querySelector('i').style.display='block';"><i class="fa-solid ${product.icon}" style="display:none;"></i></a>`
                    : `<a href="product.html?id=${product.id}" style="display:flex; width:100%; height:100%; align-items:center; justify-content:center; color:inherit; text-decoration:none;"><i class="fa-solid ${product.icon}"></i></a>`
                }

            </div>


            <div class="product-content">

                <span class="product-category">
                    ${getCategoryName(product.category)}
                </span>

                <h3 class="product-title">
                    <a href="product.html?id=${product.id}" style="color: inherit; text-decoration: none;">
                        ${product.name}
                    </a>
                </h3>


                <div class="product-rating">

                    <span class="stars">
                        ${stars}${emptyStars}
                    </span>

                    <span>
                        ${product.rating}
                        (${product.reviews})
                    </span>

                </div>


                <div class="product-bottom">

                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>

                    <button
                        class="add-cart"
                        data-product-id="${product.id}"
                        aria-label="Add ${product.name} to cart"
                    >

                        <i class="fa-solid fa-cart-plus"></i>

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================
   CATEGORY NAME
========================================= */

function getCategoryName(category) {

    const names = {

        phones: "Phones",

        computers: "Computers",

        accessories: "Accessories",

        fashion: "Fashion",

        office: "Home & Office",

        services: "Design Services",

        gaming: "Gaming & Consoles",

        networking: "Networking & CCTV",

        storage: "Storage & Memory",

        printers: "Printers & Scanners"

    };

    return names[category] || "Product";

}


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts() {

    let filteredProducts = [...products];


    /* CATEGORY */

    if (currentCategory !== "all") {

        filteredProducts = filteredProducts.filter(
            product => product.category === currentCategory
        );

    }


    /* SEARCH */

    if (currentSearch.trim() !== "") {

        const searchTerm = currentSearch
            .trim()
            .toLowerCase();

        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            getCategoryName(product.category)
                .toLowerCase()
                .includes(searchTerm)
        );

    }


    /* PRICE */

    filteredProducts = filteredProducts.filter(product =>

        product.price >= currentMinPrice &&
        product.price <= currentMaxPrice

    );


    /* SORT */

    const sortValue = sortProducts.value;


    if (sortValue === "low") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sortValue === "high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    }


    if (sortValue === "name") {

        filteredProducts.sort(
            (a, b) => a.name.localeCompare(b.name)
        );

    }


    /* DISPLAY */

    productGrid.innerHTML = filteredProducts
        .map(createProductCard)
        .join("");


    /* COUNT */

    productCount.textContent =
        `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"
        } found`;


    /* EMPTY STATE */

    if (filteredProducts.length === 0) {

        noProducts.classList.add("show");

        productGrid.style.display = "none";

    } else {

        noProducts.classList.remove("show");

        productGrid.style.display = "grid";

    }


    attachProductEvents();

}


/* =========================================
   PRODUCT EVENTS
========================================= */

function attachProductEvents() {

    const addButtons =
        document.querySelectorAll(".add-cart");


    addButtons.forEach(button => {

        button.addEventListener("click", () => {

            const productId =
                Number(button.dataset.productId);

            addToCart(productId);

        });

    });


    const wishlistButtons =
        document.querySelectorAll(".wishlist");


    wishlistButtons.forEach(button => {

        button.addEventListener("click", () => {

            button.classList.toggle("active");

            const icon =
                button.querySelector("i");

            if (button.classList.contains("active")) {

                icon.classList.remove(
                    "fa-regular"
                );

                icon.classList.add(
                    "fa-solid"
                );

            } else {

                icon.classList.remove(
                    "fa-solid"
                );

                icon.classList.add(
                    "fa-regular"
                );

            }

        });

    });

}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    const existingItem =
        cart.find(
            item => item.id === productId || item.name === product.name
        );


    if (existingItem) {

        existingItem.quantity += 1;
        if (!existingItem.image && product.image) {
            existingItem.image = product.image;
        }
        if (!existingItem.id) {
            existingItem.id = product.id;
        }

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image || "",

            icon: product.icon,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    openCart();


    /* BUTTON FEEDBACK */

    const button =
        document.querySelector(
            `.add-cart[data-product-id="${productId}"]`
        );


    if (button) {

        const original =
            button.innerHTML;

        button.innerHTML =
            '<i class="fa-solid fa-check"></i>';

        button.style.background =
            "#159957";


        setTimeout(() => {

            button.innerHTML =
                original;

            button.style.background =
                "";

        }, 800);

    }

}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    renderCart();

    updateCartCount();

}


/* =========================================
   UPDATE CART COUNT
========================================= */

function updateCartCount() {

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalQuantity;

}


/* =========================================
   RENDER CART
========================================= */

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

        cartTotal.textContent =
            formatPrice(0);

        return;

    }


    cartItems.innerHTML =
        cart.map(item => `

            <div class="cart-item">

                <div class="cart-item-image">

                    ${item.image
                        ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`
                        : `<i class="fa-solid ${item.icon}"></i>`
                    }

                </div>


                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        ${formatPrice(item.price)}
                    </p>


                    <div class="cart-quantity">

                        <button
                            class="quantity-minus"
                            data-id="${item.id}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-plus"
                            data-id="${item.id}"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="remove-item"
                    data-id="${item.id}"
                    aria-label="Remove ${item.name}"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `).join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    cartTotal.textContent =
        formatPrice(total);


    attachCartEvents();

}


/* =========================================
   CART EVENTS
========================================= */

function attachCartEvents() {

    document
        .querySelectorAll(".quantity-minus")
        .forEach(button => {

            button.addEventListener("click", () => {

                changeQuantity(
                    Number(button.dataset.id),
                    -1
                );

            });

        });


    document
        .querySelectorAll(".quantity-plus")
        .forEach(button => {

            button.addEventListener("click", () => {

                changeQuantity(
                    Number(button.dataset.id),
                    1
                );

            });

        });


    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener("click", () => {

                removeFromCart(
                    Number(button.dataset.id)
                );

            });

        });

}


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeQuantity(productId, amount) {

    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) {
        return;
    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== productId
            );

    }


    saveCart();

    updateCart();

}


/* =========================================
   REMOVE FROM CART
========================================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart();

    updateCart();

}


/* =========================================
   OPEN CART
========================================= */

function openCart() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =========================================
   CLOSE CART
========================================= */

function closeCartSidebar() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


/* =========================================
   CATEGORY FILTER
========================================= */

document
    .querySelectorAll(
        'input[name="category"]'
    )
    .forEach(radio => {

        radio.addEventListener(
            "change",
            () => {

                currentCategory =
                    radio.value;

                displayProducts();

            }
        );

    });


/* =========================================
   SEARCH
========================================= */

searchButton.addEventListener(
    "click",
    () => {

        currentSearch =
            searchInput.value;

        displayProducts();

    }
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            currentSearch =
                searchInput.value;

            displayProducts();

        }

    }
);


/* =========================================
   LIVE SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    () => {

        currentSearch =
            searchInput.value;

        displayProducts();

    }
);


/* =========================================
   SORT
========================================= */

sortProducts.addEventListener(
    "change",
    displayProducts
);


/* =========================================
   PRICE FILTER
========================================= */

applyPrice.addEventListener(
    "click",
    () => {

        const minimum =
            Number(minPrice.value) || 0;

        const maximum =
            Number(maxPrice.value) ||
            Infinity;


        if (
            maximum !== Infinity &&
            minimum > maximum
        ) {

            alert(
                "Minimum price cannot be greater than maximum price."
            );

            return;

        }


        currentMinPrice = minimum;

        currentMaxPrice = maximum;

        displayProducts();

    }
);


/* =========================================
   CLEAR FILTERS
========================================= */

clearFilters.addEventListener(
    "click",
    () => {

        currentCategory = "all";

        currentSearch = "";

        currentMinPrice = 0;

        currentMaxPrice = Infinity;


        searchInput.value = "";

        minPrice.value = "";

        maxPrice.value = "";

        sortProducts.value = "default";


        document.querySelector(
            'input[name="category"][value="all"]'
        ).checked = true;


        displayProducts();

    }
);


/* =========================================
   CART BUTTON
========================================= */

cartButton.addEventListener(
    "click",
    () => {

        openCart();

    }
);


/* =========================================
   CLOSE CART
========================================= */

closeCart.addEventListener(
    "click",
    closeCartSidebar
);


cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


/* =========================================
   ACCOUNT
========================================= */

if (accountButton) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const navSignInLink = document.getElementById("navSignInLink");

    if (currentUser && currentUser.name) {

        const accountActionText = accountButton.querySelector("strong") || accountButton.querySelector("span");

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
        (e) => {

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


/* =========================================
   CHECKOUT
========================================= */

checkoutButton.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            alert(
                "Your cart is empty. Please add a product first."
            );

            return;

        }


        window.location.href =
            "checkout.html";

    }
);


/* =========================================
   INITIALIZE
========================================= */

if (initialCategory) {
    const matchingRadio = document.querySelector(
        `input[name="category"][value="${initialCategory}"]`
    );

    if (matchingRadio) {
        matchingRadio.checked = true;
    }
}

if (initialSearch && searchInput) {
    searchInput.value = initialSearch;
}

displayProducts();

updateCart();
