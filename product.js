// ================================
// JARVIS COMPUTER CONSULT
// Product Details JavaScript
// ================================

const products = [
    {
        id: 1,
        name: "Premium Laptop",
        category: "computers",
        categoryName: "Computers",
        price: 5499,
        rating: 4.8,
        reviews: 24,
        image: "images/laptop.jpg",
        icon: "fa-laptop",
        badge: "Featured",
        description:
            "A powerful and reliable laptop designed for work, study, business and everyday productivity.",
        longDescription:
            "The Premium Laptop combines dependable performance, portability and modern features for students, professionals and business users. It is suitable for everyday productivity, browsing, office applications, programming and general computing."
    },
    {
        id: 2,
        name: "Samsung Smartphone",
        category: "phones",
        categoryName: "Phones",
        price: 2899,
        rating: 4.7,
        reviews: 31,
        image: "images/phone.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Popular",
        description:
            "A modern smartphone with a beautiful display, reliable performance and excellent everyday features.",
        longDescription:
            "The Samsung Smartphone is designed for communication, entertainment, photography, social media and everyday productivity. It offers a balanced combination of performance, convenience and modern smartphone features."
    },
    {
        id: 3,
        name: "Wireless Headphones",
        category: "accessories",
        categoryName: "Accessories",
        price: 499,
        rating: 4.6,
        reviews: 18,
        image: "images/headphones.jpg",
        icon: "fa-headphones",
        badge: "New",
        description:
            "Enjoy clear sound and comfortable listening with these modern wireless headphones.",
        longDescription:
            "These Wireless Headphones provide an enjoyable listening experience for music, calls, videos and gaming. Their wireless design makes them convenient for everyday use."
    },
    {
        id: 4,
        name: "Wireless Keyboard",
        category: "accessories",
        categoryName: "Accessories",
        price: 299,
        rating: 4.5,
        reviews: 15,
        image: "images/keyboard.jpg",
        icon: "fa-keyboard",
        badge: "",
        description:
            "A clean and comfortable wireless keyboard for work, study and everyday computer use.",
        longDescription:
            "The Wireless Keyboard gives you a convenient typing experience without unnecessary cables. It is suitable for offices, homes, students and professionals."
    },
    {
        id: 5,
        name: "Gaming Mouse",
        category: "accessories",
        categoryName: "Accessories",
        price: 249,
        rating: 4.7,
        reviews: 20,
        image: "images/mouse.jpg",
        icon: "fa-computer-mouse",
        badge: "Popular",
        description:
            "A responsive mouse designed for gaming, productivity and everyday computer use.",
        longDescription:
            "The Gaming Mouse provides responsive control and comfortable handling. It is suitable for gaming as well as normal computer tasks such as browsing, editing and office work."
    },
    {
        id: 6,
        name: "Laptop Backpack",
        category: "accessories",
        categoryName: "Accessories",
        price: 350,
        rating: 4.4,
        reviews: 12,
        image: "images/backpack.jpg",
        icon: "fa-bag-shopping",
        badge: "",
        description:
            "A practical backpack designed to protect and carry your laptop and everyday essentials.",
        longDescription:
            "The Laptop Backpack provides convenient storage for laptops, accessories, books and personal items. Its practical design makes it suitable for students, workers and travelers."
    },
    {
        id: 7,
        name: "Smart Watch",
        category: "accessories",
        categoryName: "Accessories",
        price: 699,
        rating: 4.6,
        reviews: 17,
        image: "images/smartwatch.jpg",
        icon: "fa-clock",
        badge: "New",
        description:
            "A stylish smart watch designed to keep you connected throughout the day.",
        longDescription:
            "The Smart Watch combines modern style with useful everyday functionality. It is a convenient companion for notifications, timekeeping and general daily use."
    },
    {
        id: 8,
        name: "Office Chair",
        category: "office",
        categoryName: "Home & Office",
        price: 1250,
        rating: 4.5,
        reviews: 9,
        image: "images/chair.jpg",
        icon: "fa-chair",
        badge: "",
        description:
            "A comfortable office chair designed for productive work and study sessions.",
        longDescription:
            "The Office Chair is designed to provide comfortable seating for offices, home workspaces and study areas. Its practical design makes it suitable for extended periods of everyday use."
    },
    {
        id: 9,
        name: "Wireless Speaker",
        category: "accessories",
        categoryName: "Accessories",
        price: 599,
        rating: 4.7,
        reviews: 22,
        image: "images/speaker.jpg",
        icon: "fa-volume-high",
        badge: "Popular",
        description:
            "A portable wireless speaker delivering enjoyable sound for your everyday entertainment.",
        longDescription:
            "The Wireless Speaker is suitable for music, entertainment and social gatherings. Its wireless design makes it convenient to use in different environments."
    },
    {
        id: 10,
        name: "Men's Casual Shirt",
        category: "fashion",
        categoryName: "Fashion",
        price: 180,
        rating: 4.3,
        reviews: 11,
        image: "images/shirt.jpg",
        icon: "fa-shirt",
        badge: "",
        description:
            "A stylish casual shirt suitable for everyday wear and different occasions.",
        longDescription:
            "The Men's Casual Shirt combines a simple, modern appearance with everyday versatility. It can be worn casually or styled for different occasions."
    },
    {
        id: 11,
        name: "USB-C Fast Charger",
        category: "accessories",
        categoryName: "Accessories",
        price: 199,
        rating: 4.8,
        reviews: 28,
        image: "images/charger.jpg",
        icon: "fa-plug",
        badge: "Best Seller",
        description:
            "A convenient USB-C fast charger for compatible phones, tablets and other devices.",
        longDescription:
            "The USB-C Fast Charger provides a convenient charging solution for compatible electronic devices. It is ideal for home, office and travel use."
    },
    {
        id: 12,
        name: "Graphic Design Service",
        category: "services",
        categoryName: "Design Services",
        price: 300,
        rating: 5.0,
        reviews: 8,
        image: "images/design.jpg",
        icon: "fa-pen-nib",
        badge: "Service",
        description:
            "Professional graphic design services for flyers, branding, promotional materials and more.",
        longDescription:
            "Jarvis Computer consult provides creative graphic design and technology solutions for individuals, businesses and organizations. Services can include promotional flyers, branding materials, social media graphics and other creative designs."
    },
    {
        id: 13,
        name: "Apple iPhone 15 Pro",
        category: "phones",
        categoryName: "Phones",
        price: 12500,
        rating: 4.9,
        reviews: 42,
        image: "images/iphone.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Flagship",
        description:
            "The flagship Apple iPhone 15 Pro with aerospace-grade titanium design and A17 Pro chip.",
        longDescription:
            "Featuring an aerospace-grade titanium design, Super Retina XDR display with ProMotion, and the revolutionary A17 Pro chip for next-generation mobile performance and pro camera capabilities."
    },
    {
        id: 14,
        name: "Pro Wireless Earbuds",
        category: "accessories",
        categoryName: "Accessories",
        price: 349,
        rating: 4.8,
        reviews: 35,
        image: "images/earbuds.jpg",
        icon: "fa-headphones",
        badge: "Best Seller",
        description:
            "High fidelity wireless earbuds with active noise isolation and deep bass.",
        longDescription:
            "Compact, crystal-clear audio with extended battery life, seamless Bluetooth pairing, and ergonomic noise-isolating ear tips for travel, workouts, and calls."
    },
    {
        id: 15,
        name: "Phone Shop Display Bundle",
        category: "phones",
        categoryName: "Phones",
        price: 3200,
        rating: 4.7,
        reviews: 19,
        image: "images/phoneshop.jpg",
        icon: "fa-shop",
        badge: "Hot Deal",
        description:
            "All-in-one phone and accessories starter kit from our phone shop collection.",
        longDescription:
            "Complete package featuring an unlocked smartphone bundled with fast charger, protective glass, case, and earphones. Ideal for students and professionals starting fresh."
    },
    {
        id: 16,
        name: "PlayStation 5 Pro Console",
        category: "gaming",
        categoryName: "Gaming & Consoles",
        price: 8999,
        rating: 4.9,
        reviews: 48,
        image: "images/console.jpg",
        icon: "fa-gamepad",
        badge: "Hot Deal",
        description:
            "Next-generation gaming console with 4K 120Hz ray tracing and ultra-fast SSD.",
        longDescription:
            "Experience ultra-smooth gameplay with PlayStation 5 Pro. Features advanced ray-tracing graphics, 2TB high-speed NVMe SSD storage, DualSense wireless controller with haptic feedback, and backward compatibility with PS4 titles."
    },
    {
        id: 17,
        name: "Wi-Fi 6 Gigabit Smart Router",
        category: "networking",
        categoryName: "Networking & Security",
        price: 799,
        rating: 4.8,
        reviews: 32,
        image: "images/router.jpg",
        icon: "fa-wifi",
        badge: "Popular",
        description:
            "Dual-band Wi-Fi 6 gigabit router with 6 high-gain antennas for ultra-fast coverage.",
        longDescription:
            "Eliminate dead zones and buffer-free streaming across your entire home or office. Supports up to 128 devices simultaneously, OFDMA technology, WPA3 encryption, and gigabit ethernet ports for reliable wired connections."
    },
    {
        id: 18,
        name: "Smart 4K Security CCTV Camera",
        category: "networking",
        categoryName: "Networking & Security",
        price: 850,
        rating: 4.7,
        reviews: 29,
        image: "images/camera.jpg",
        icon: "fa-shield-halved",
        badge: "Security",
        description:
            "High definition 4K smart security camera with infrared night vision and smartphone app alerts.",
        longDescription:
            "Keep your premises protected 24/7 with crystal-clear 4K video, AI motion detection, two-way audio, weatherproof IP66 construction, and cloud or microSD storage support."
    },
    {
        id: 19,
        name: "1TB Rugged High-Speed Portable SSD",
        category: "storage",
        categoryName: "Storage & Memory",
        price: 1250,
        rating: 4.9,
        reviews: 37,
        image: "images/ssd.jpg",
        icon: "fa-hard-drive",
        badge: "Ultra Fast",
        description:
            "Shockproof, water-resistant portable NVMe SSD with transfer speeds up to 2000 MB/s.",
        longDescription:
            "Engineered for photographers, videographers, and tech pros. Features drop resistance up to 3 meters, USB 3.2 Gen 2x2 interface, universal compatibility with Windows, Mac, Android, and consoles."
    },
    {
        id: 20,
        name: "All-in-One Wireless Color Laser Printer",
        category: "printers",
        categoryName: "Printers & Scanners",
        price: 3450,
        rating: 4.7,
        reviews: 21,
        image: "images/printer.jpg",
        icon: "fa-print",
        badge: "Office Tech",
        description:
            "Multifunction laser printer, scanner, and copier with auto duplexing and Wi-Fi Direct.",
        longDescription:
            "Boost office productivity with crisp color prints, high-speed 30 ppm output, automatic two-sided printing, digital color touchscreen, and mobile printing via AirPrint and Android."
    },
    {
        id: 21,
        name: "RGB Esports Gaming Headset",
        category: "gaming",
        categoryName: "Gaming & Consoles",
        price: 650,
        rating: 4.8,
        reviews: 44,
        image: "images/gaming_headset.jpg",
        icon: "fa-headset",
        badge: "RGB",
        description:
            "Pro gaming headset with 50mm neodymium drivers, surround sound, and noise-canceling mic.",
        longDescription:
            "Dominate competitive gaming with spatial audio clarity, ultra-soft breathable memory foam ear cushions, detachable microphone with noise filters, and dynamic RGB illumination."
    },
    {
        id: 22,
        name: "2TB Slim External Backup Hard Drive",
        category: "storage",
        categoryName: "Storage & Memory",
        price: 699,
        rating: 4.6,
        reviews: 26,
        image: "images/harddrive.jpg",
        icon: "fa-hard-drive",
        badge: "Backup",
        description:
            "Reliable, portable 2TB external hard drive with fast USB 3.0 drag-and-drop backup.",
        longDescription:
            "Store thousands of photos, videos, system backups, and business documents. Slim brushed metallic finish, bus-powered plug-and-play operation for PC, Mac, and PlayStation."
    },
    {
        id: 23,
        name: "Apple iPhone 16 Pro Max",
        category: "phones",
        categoryName: "Phones & Tablets",
        price: 16999,
        rating: 4.9,
        reviews: 54,
        image: "images/iphone16.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Latest Flagship",
        description:
            "Apple's pinnacle flagship featuring A18 Pro chip, Grade 5 Titanium, 48MP Fusion camera system, and Camera Control.",
        longDescription:
            "The iPhone 16 Pro Max delivers supreme performance with the cutting-edge A18 Pro processor, stunning 6.9-inch Super Retina XDR OLED display with ProMotion 120Hz, advanced 48MP triple camera system with 5x optical telephoto, dedicated tactile Camera Control button, and class-leading all-day battery life."
    },
    {
        id: 24,
        name: "Samsung Galaxy S24 Ultra",
        category: "phones",
        categoryName: "Phones & Tablets",
        price: 14500,
        rating: 4.9,
        reviews: 49,
        image: "images/s24ultra.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Galaxy AI",
        description:
            "Next-generation Galaxy AI phone with Snapdragon 8 Gen 3, titanium frame, built-in S Pen, and 200MP quad camera.",
        longDescription:
            "Unleash revolutionary mobile productivity and photography with the Samsung Galaxy S24 Ultra. Powered by Galaxy AI with Live Translate and Circle to Search, a 6.8-inch Dynamic AMOLED 2X flat display with Corning Gorilla Armor anti-reflective glass, titanium chassis, integrated S-Pen stylus, and a 200MP pro-grade camera sensor."
    },
    {
        id: 25,
        name: "Google Pixel 9 Pro",
        category: "phones",
        categoryName: "Phones & Tablets",
        price: 11800,
        rating: 4.8,
        reviews: 33,
        image: "images/pixel9.jpg",
        icon: "fa-mobile-screen-button",
        badge: "Gemini AI",
        description:
            "Google Tensor G4 powerhouse featuring Gemini AI intelligence, Super Actua display, and industry-leading computational photography.",
        longDescription:
            "Google Pixel 9 Pro delivers the purest Google AI experience, powered by the custom Google Tensor G4 chipset and 16GB RAM for advanced on-device Gemini AI models. Includes a 6.3-inch Super Actua LTPO 120Hz OLED screen, iconic camera visor housing 50MP triple lenses with 30x Super Res Zoom, and 7 years of OS updates."
    },
    {
        id: 26,
        name: "Apple MacBook Pro 16\" M3 Max",
        category: "computers",
        categoryName: "Computers & Laptops",
        price: 24999,
        rating: 5.0,
        reviews: 38,
        image: "images/macbook.jpg",
        icon: "fa-laptop",
        badge: "Pro Power",
        description:
            "Ultimate workstation powerhouse with 16-core CPU M3 Max chip, Liquid Retina XDR display, and 22-hour battery life.",
        longDescription:
            "Engineered for demanding engineering, 3D rendering, video editing, and software compilation. Features Apple's flagship M3 Max silicon with hardware-accelerated ray tracing, 36GB unified memory, 1TB blazing NVMe storage, Liquid Retina XDR screen with 1600 nits peak brightness, six-speaker spatial audio system, and uncompromised battery longevity."
    },
    {
        id: 27,
        name: "Dell XPS 16 OLED Laptop",
        category: "computers",
        categoryName: "Computers & Laptops",
        price: 19500,
        rating: 4.8,
        reviews: 27,
        image: "images/dellxps.jpg",
        icon: "fa-laptop",
        badge: "OLED Infinity",
        description:
            "Futuristic CNC aluminum design with 4K+ OLED InfinityEdge display, Intel Core Ultra 9, and NVIDIA GeForce RTX 4070.",
        longDescription:
            "Dell XPS 16 merges futuristic elegance with raw computational power. Crafted from CNC machined aluminum and Gorilla Glass 3, it houses an Intel Core Ultra 9 processor with AI Boost NPU, NVIDIA GeForce RTX 4070 graphics, 32GB LPDDR5X RAM, capacitive touch function row, seamless glass haptic touchpad, and a breathtaking 4K+ OLED touch panel."
    },
    {
        id: 28,
        name: "ASUS ROG Strix SCAR 18 Gaming Laptop",
        category: "computers",
        categoryName: "Computers & Laptops",
        price: 22800,
        rating: 4.9,
        reviews: 41,
        image: "images/asusrog.jpg",
        icon: "fa-laptop",
        badge: "Gaming Beast",
        description:
            "18-inch 2.5K 240Hz Nebula HDR display, Intel Core i9-14900HX, NVIDIA GeForce RTX 4090, and Conductonaut Extreme liquid metal cooling.",
        longDescription:
            "The absolute zenith of gaming and creative laptops. Equipped with an Intel Core i9-14900HX 24-core CPU, NVIDIA GeForce RTX 4090 GPU (175W max TGP), 18-inch Mini LED 240Hz QHD+ display with over 2000 dimming zones, 32GB DDR5-5600MHz RAM, per-key RGB mechanical feel keyboard, and tri-fan cooling technology."
    },
    {
        id: 29,
        name: "Apple iPhone 18 Pro Max",
        category: "phones",
        categoryName: "Phones & Tablets",
        price: 19999,
        rating: 5.0,
        reviews: 68,
        image: "images/iphone18.png",
        icon: "fa-mobile-screen-button",
        badge: "Pre-Order",
        description:
            "Apple's next-generation flagship with Apple A19 Pro Bionic, holographic Super Retina XDR, and 200MP crystal optics.",
        longDescription:
            "The iPhone 18 Pro Max represents the pinnacle of mobile engineering. Built with aerospace-grade Grade 5 titanium, an edge-to-edge holographic 6.9-inch Super Retina XDR OLED with 120Hz ProMotion, 200MP Quad-Fusion periscope camera system with sapphire crystal optics, on-device Apple Intelligence powered by the 3nm A19 Pro Neural Bionic processor, and an extraordinary 38-hour battery life."
    }
];


// ================================
// GET PRODUCT FROM URL
// Example: product.html?id=1
// ================================

const urlParams = new URLSearchParams(window.location.search);
const productId = Number(urlParams.get("id")) || 1;

const product = products.find(item => item.id === productId);


// ================================
// ELEMENTS
// ================================

const breadcrumbProduct = document.getElementById("breadcrumbProduct");
const productBadge = document.getElementById("productBadge");
const productIcon = document.getElementById("productIcon");
const productCategory = document.getElementById("productCategory");
const productName = document.getElementById("productName");
const productRating = document.getElementById("productRating");
const productReviews = document.getElementById("productReviews");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const longDescription = document.getElementById("longDescription");
const specCategory = document.getElementById("specCategory");


// ================================
// FORMAT PRICE
// ================================

function formatPrice(price) {
    return `GH₵ ${price.toLocaleString("en-GH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}


// ================================
// LOAD PRODUCT
// ================================

function loadProduct() {

    if (!product) {
        window.location.href = "shop.html";
        return;
    }

    document.title =
        `${product.name} | Jarvis Computer consult`;

    breadcrumbProduct.textContent = product.name;

    productBadge.textContent = product.badge;

    if (!product.badge) {
        productBadge.style.display = "none";
    } else {
        productBadge.style.display = "inline-flex";
    }

    productIcon.className =
        `fa-solid ${product.icon}`;

    const productImage = document.getElementById("productImage");
    if (productImage && product.image) {
        productImage.src = product.image;
        productImage.alt = product.name;
        productImage.style.display = "block";
        if (productIcon) productIcon.style.display = "none";
    } else if (productIcon) {
        if (productImage) productImage.style.display = "none";
        productIcon.style.display = "block";
    }

    productCategory.textContent =
        product.categoryName.toUpperCase();

    productName.textContent =
        product.name;

    productRating.textContent =
        product.rating.toFixed(1);

    productReviews.textContent =
        product.reviews;

    productPrice.textContent =
        formatPrice(product.price);

    productDescription.textContent =
        product.description;

    longDescription.textContent =
        product.longDescription;

    specCategory.textContent =
        product.categoryName;

    loadRelatedProducts();
}


// ================================
// QUANTITY
// ================================

let quantity = 1;

const quantityDisplay =
    document.getElementById("quantity");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");


decreaseQuantity.addEventListener("click", () => {

    if (quantity > 1) {
        quantity--;

        quantityDisplay.textContent =
            quantity;
    }
});


increaseQuantity.addEventListener("click", () => {

    quantity++;

    quantityDisplay.textContent =
        quantity;
});


// ================================
// CART
// ================================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent =
        totalItems;
}


// ================================
// ADD PRODUCT TO CART
// ================================

function addProductToCart(product, amount) {

    const existingProduct =
        cart.find(item =>
            item.id === product.id
        );

    if (existingProduct) {

        existingProduct.quantity += amount;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || "",
            icon: product.icon,
            quantity: amount
        });
    }

    saveCart();
    updateCartCount();
    renderCart();
}


// ================================
// ADD TO CART BUTTON
// ================================

document
    .getElementById("addToCart")
    .addEventListener("click", () => {

        addProductToCart(
            product,
            quantity
        );

        alert(
            `${product.name} has been added to your cart.`
        );
    });


// ================================
// BUY NOW
// ================================

document
    .getElementById("buyNow")
    .addEventListener("click", () => {

        addProductToCart(
            product,
            quantity
        );

        window.location.href =
            "checkout.html";
    });


// ================================
// CART SIDEBAR
// ================================

const cartButton =
    document.getElementById("cartButton");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");


function openCart() {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

    renderCart();
}


function closeCartSidebar() {

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
}


cartButton.addEventListener(
    "click",
    openCart
);

closeCart.addEventListener(
    "click",
    closeCartSidebar
);

cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


// ================================
// RENDER CART
// ================================

function renderCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <h3>Your cart is empty</h3>
                <p>Add products to your cart to see them here.</p>
            </div>
        `;

        cartTotal.textContent =
            "GH₵ 0.00";

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

                    <h4>${item.name}</h4>

                    <span>
                        ${formatPrice(item.price)}
                    </span>

                    <div class="cart-item-controls">

                        <button
                            class="cart-minus"
                            data-id="${item.id}">
                            −
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            class="cart-plus"
                            data-id="${item.id}">
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-cart-item"
                    data-id="${item.id}"
                    aria-label="Remove product">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `).join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (item.price * item.quantity),
            0
        );


    cartTotal.textContent =
        formatPrice(total);


    addCartControlEvents();
}


// ================================
// CART CONTROLS
// ================================

function addCartControlEvents() {

    document
        .querySelectorAll(".cart-minus")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    const item =
                        cart.find(
                            product =>
                                product.id === id
                        );

                    if (!item) return;

                    if (item.quantity > 1) {

                        item.quantity--;

                    } else {

                        cart =
                            cart.filter(
                                product =>
                                    product.id !== id
                            );
                    }

                    saveCart();
                    updateCartCount();
                    renderCart();
                }
            );
        });


    document
        .querySelectorAll(".cart-plus")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    const item =
                        cart.find(
                            product =>
                                product.id === id
                        );

                    if (!item) return;

                    item.quantity++;

                    saveCart();
                    updateCartCount();
                    renderCart();
                }
            );
        });


    document
        .querySelectorAll(".remove-cart-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    cart =
                        cart.filter(
                            product =>
                                product.id !== id
                        );

                    saveCart();
                    updateCartCount();
                    renderCart();
                }
            );
        });
}


// ================================
// CHECKOUT BUTTON
// ================================

document
    .getElementById("checkoutButton")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            alert(
                "Your cart is empty. Please add a product first."
            );

            return;
        }

        window.location.href =
            "checkout.html";
    });


// ================================
// WISHLIST
// ================================

const wishlistButton =
    document.getElementById("wishlistButton");

wishlistButton.addEventListener(
    "click",
    () => {

        wishlistButton.classList.toggle(
            "active"
        );

        const icon =
            wishlistButton.querySelector("i");

        if (
            wishlistButton.classList.contains(
                "active"
            )
        ) {

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
    }
);


// ================================
// RELATED PRODUCTS
// ================================

function loadRelatedProducts() {

    const relatedProducts =
        document.getElementById(
            "relatedProducts"
        );

    const related =
        products
            .filter(item =>
                item.category === product.category &&
                item.id !== product.id
            )
            .slice(0, 4);


    if (related.length === 0) {

        relatedProducts.innerHTML = `
            <p class="no-related">
                No related products available.
            </p>
        `;

        return;
    }


    relatedProducts.innerHTML =
        related.map(item => `

            <article
                class="related-card"
                data-id="${item.id}">

                <div class="related-image">

                    ${item.badge
                ? `<span class="related-badge">
                            ${item.badge}
                           </span>`
                : ""
            }

                    <i class="fa-solid ${item.icon}"></i>

                </div>

                <div class="related-info">

                    <span class="related-category">
                        ${item.categoryName}
                    </span>

                    <h3>
                        ${item.name}
                    </h3>

                    <div class="related-rating">
                        <span>★★★★★</span>
                        <small>
                            ${item.rating}
                        </small>
                    </div>

                    <strong class="related-price">
                        ${formatPrice(item.price)}
                    </strong>

                    <button
                        class="related-cart"
                        data-id="${item.id}">

                        <i class="fa-solid fa-cart-plus"></i>
                        Add to Cart

                    </button>

                </div>

            </article>

        `).join("");


    document
        .querySelectorAll(".related-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".related-cart"
                        )
                    ) {
                        return;
                    }

                    const id =
                        card.dataset.id;

                    window.location.href =
                        `product.html?id=${id}`;
                }
            );
        });


    document
        .querySelectorAll(".related-cart")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const id =
                        Number(button.dataset.id);

                    const selectedProduct =
                        products.find(
                            item =>
                                item.id === id
                        );

                    addProductToCart(
                        selectedProduct,
                        1
                    );

                    alert(
                        `${selectedProduct.name} has been added to your cart.`
                    );
                }
            );
        });
}


// ================================
// SEARCH
// ================================

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");


function performSearch() {

    const search =
        searchInput.value.trim();

    if (!search) {

        window.location.href =
            "shop.html";

        return;
    }

    window.location.href =
        `shop.html?search=${encodeURIComponent(search)}`;
}


searchButton.addEventListener(
    "click",
    performSearch
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            performSearch();
        }
    }
);


// ================================
// ACCOUNT
// ================================

const productAccountButton = document.getElementById("accountButton");

if (productAccountButton) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const navSignInLink = document.getElementById("navSignInLink");

    if (currentUser && currentUser.name) {

        const accountActionText = productAccountButton.querySelector("strong") || productAccountButton.querySelector("span");

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

    productAccountButton.addEventListener("click", (e) => {

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

    });

}


// ================================
// RELATED PRODUCTS
// ================================

function renderRelatedProducts() {
    const container = document.getElementById("relatedProducts");
    if (!container) return;

    const related = products.filter(item => item.id !== productId).slice(0, 4);

    container.innerHTML = related.map(item => `
        <article class="product-card" style="background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee;">
            <div class="product-image" style="height: 180px; position: relative; overflow: hidden; background: #f2f0fa;">
                ${item.badge ? `<span class="product-badge" style="position: absolute; top: 10px; left: 10px; z-index: 2;">${item.badge}</span>` : ""}
                <a href="product.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="product-img" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
                </a>
            </div>
            <div class="product-content" style="padding: 16px;">
                <span class="product-category" style="font-size: 11px; color: #6c4df6; font-weight: 700; text-transform: uppercase;">
                    ${item.categoryName}
                </span>
                <h3 style="font-size: 14px; margin: 6px 0 10px; font-weight: 700;">
                    <a href="product.html?id=${item.id}" style="color: inherit; text-decoration: none;">
                        ${item.name}
                    </a>
                </h3>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <strong style="font-size: 14px; color: #171717;">
                        ${formatPrice(item.price)}
                    </strong>
                    <a href="product.html?id=${item.id}" style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: #6c4df6; color: white; text-decoration: none;">
                        <i class="fa-solid fa-arrow-right" style="font-size: 12px;"></i>
                    </a>
                </div>
            </div>
        </article>
    `).join("");
}


// ================================
// START PAGE
// ================================

loadProduct();
updateCartCount();
renderCart();
renderRelatedProducts();