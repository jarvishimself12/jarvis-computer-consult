import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES, PRODUCTS, PROMO_DEALS } from "./src/data/products";

const { width } = Dimensions.get("window");

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState("home"); // home, shop, cart, account

  // State
  const [user, setUser] = useState({ name: "Samuel Mensah", email: "samuel@example.com" });
  const [cart, setCart] = useState([
    { product: PRODUCTS[0], quantity: 1 },
    { product: PRODUCTS[3], quantity: 1 }
  ]);
  const [wishlist, setWishlist] = useState([1, 4]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isGoogleModalVisible, setIsGoogleModalVisible] = useState(false);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);

  // Auth Form State
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authAlert, setAuthAlert] = useState(null);

  // Google Modal State
  const [googleEmail, setGoogleEmail] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [googleAlert, setGoogleAlert] = useState(null);

  // Cart & Checkout State
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("Accra, Ghana");
  const [paymentMethod, setPaymentMethod] = useState("Mobile Money (MTN / Telecel)");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to Cart!`);
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("Item removed from cart");
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Calculate Cart Totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Apply Promo
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "JARVIS25") {
      setDiscountPercent(25);
      showToast("Promo Code JARVIS25 Applied (25% OFF)!");
    } else {
      Alert.alert("Invalid Promo Code", "Try using code JARVIS25 for 25% off!");
    }
  };

  // Auth Handler
  const handleAuthSubmit = () => {
    setAuthAlert(null);
    if (authMode === "login") {
      if (!loginEmail.trim() || !loginPassword) {
        setAuthAlert("Please enter your credentials to login or sign up.");
        return;
      }
      if (!loginEmail.includes("@")) {
        setAuthAlert("Please enter a valid email address.");
        return;
      }
      const rawName = loginEmail.split("@")[0].replace(/[._]/g, " ");
      const userName =
        rawName
          .split(" ")
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") || "Customer";
      setUser({ name: userName, email: loginEmail });
      setIsAuthModalVisible(false);
      showToast(`Welcome back, ${userName}!`);
    } else {
      if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
        setAuthAlert("Please enter your credentials to login or sign up.");
        return;
      }
      if (!signupEmail.includes("@")) {
        setAuthAlert("Please enter a valid email address.");
        return;
      }
      if (signupPassword.length < 4) {
        setAuthAlert("Password must be at least 4 characters long.");
        return;
      }
      setUser({ name: signupName, email: signupEmail });
      setIsAuthModalVisible(false);
      showToast(`Account created for ${signupName}!`);
    }
  };

  // Google Modal Submit
  const handleGoogleSubmit = () => {
    setGoogleAlert(null);
    if (!googleEmail.trim()) {
      setGoogleAlert("Please enter your Google email address.");
      return;
    }
    if (!googleEmail.includes("@") || !googleEmail.includes(".")) {
      setGoogleAlert("Please enter a valid email (e.g. name@gmail.com).");
      return;
    }
    if (!googlePassword) {
      setGoogleAlert("Please enter your password.");
      return;
    }
    if (googlePassword.length < 6) {
      setGoogleAlert("Please enter a valid password (at least 6 characters).");
      return;
    }

    const rawName = googleEmail.split("@")[0].replace(/[._]/g, " ");
    const userName =
      rawName
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") || "Google User";

    setUser({ name: userName, email: googleEmail });
    setIsGoogleModalVisible(false);
    setIsAuthModalVisible(false);
    showToast(`Signed in as ${userName}!`);
  };

  // Filtered Products
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* ==========================================
          MAIN APP HEADER
      =========================================== */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("./assets/icon.png")}
            style={styles.headerLogoImg}
            resizeMode="contain"
          />
          <View style={styles.brandLockup}>
            <Text style={styles.brandTitle}>JARVIS</Text>
            <Text style={styles.brandSubtitle}>COMPUTER CONSULT</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {user ? (
            <TouchableOpacity
              style={styles.userBadge}
              onPress={() => setActiveTab("account")}
            >
              <Ionicons name="person-circle-outline" size={24} color="#9e1313" />
              <Text style={styles.userNameText} numberOfLines={1}>
                {user.name.split(" ")[0]}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.signInHeaderBtn}
              onPress={() => setIsAuthModalVisible(true)}
            >
              <Text style={styles.signInHeaderBtnText}>Sign In</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.cartHeaderBtn}
            onPress={() => setActiveTab("cart")}
          >
            <Ionicons name="cart-outline" size={22} color="#161326" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadgeCount}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ==========================================
          BODY CONTENT ACCORDING TO ACTIVE TAB
      =========================================== */}
      {activeTab === "home" && (
        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
          {/* Search Input */}
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={18} color="#888" style={{ marginLeft: 12 }} />
            <TextInput
              style={styles.searchBarInput}
              placeholder="Search computers, phones, repairs..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text) setSelectedCategory("all");
              }}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={{ padding: 8 }}>
                <Ionicons name="close-circle" size={16} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {/* Promo Deals Banner Carousel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScrollView}
          >
            {PROMO_DEALS.map((deal) => (
              <View
                key={deal.id}
                style={[styles.bannerCard, { backgroundColor: deal.bgColor }]}
              >
                <View style={styles.bannerBadge}>
                  <Text style={styles.bannerBadgeText}>{deal.discount}</Text>
                </View>
                <Text style={styles.bannerTitle}>{deal.title}</Text>
                <Text style={styles.bannerSubtitle}>{deal.subtitle}</Text>
                <TouchableOpacity
                  style={styles.bannerBtn}
                  onPress={() => setActiveTab("shop")}
                >
                  <Text style={styles.bannerBtnText}>Shop Deals</Text>
                  <Ionicons name="arrow-forward" size={14} color="#161326" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Categories Horizontal Bar */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => setActiveTab("shop")}>
              <Text style={styles.seeAllText}>View Catalog</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillActive
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={16}
                    color={isSelected ? "#ffffff" : "#9e1313"}
                  />
                  <Text
                    style={[
                      styles.categoryPillText,
                      isSelected && styles.categoryPillTextActive
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Flash Deals / Featured Header */}
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="flame" size={20} color="#dc2626" />
              <Text style={styles.sectionTitle}>Featured Products</Text>
            </View>
            <Text style={styles.itemsCountText}>
              {filteredProducts.length} items
            </Text>
          </View>

          {/* Product Grid */}
          <View style={styles.productGrid}>
            {filteredProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                activeOpacity={0.88}
                onPress={() => setSelectedProduct(item)}
              >
                <View style={styles.cardImageContainer}>
                  <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{item.badge}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.cardWishlistBtn}
                    onPress={() => toggleWishlist(item.id)}
                  >
                    <Ionicons
                      name={wishlist.includes(item.id) ? "heart" : "heart-outline"}
                      size={18}
                      color={wishlist.includes(item.id) ? "#dc2626" : "#666"}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardCategory}>{item.categoryName}</Text>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <View style={styles.cardRatingRow}>
                    <Ionicons name="star" size={13} color="#f59e0b" />
                    <Text style={styles.cardRatingText}>{item.rating}</Text>
                    <Text style={styles.cardReviewsCount}>({item.reviews})</Text>
                  </View>

                  <View style={styles.cardBottomRow}>
                    <View>
                      <Text style={styles.cardPrice}>GH₵ {item.price.toLocaleString()}</Text>
                      {item.originalPrice && (
                        <Text style={styles.cardOriginalPrice}>
                          GH₵ {item.originalPrice.toLocaleString()}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.cardAddBtn}
                      onPress={() => addToCart(item, 1)}
                    >
                      <Ionicons name="add" size={18} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Services Banner */}
          <View style={styles.serviceBannerBox}>
            <Ionicons name="hardware-chip-outline" size={32} color="#9e1313" />
            <Text style={styles.serviceBannerTitle}>Custom Tech Consulting & Repairs</Text>
            <Text style={styles.serviceBannerText}>
              Need custom computer builds, software setups, or graphic design? Contact our specialist team today.
            </Text>
            <TouchableOpacity
              style={styles.serviceBannerBtn}
              onPress={() => {
                const serviceItem = PRODUCTS.find((p) => p.category === "services");
                if (serviceItem) setSelectedProduct(serviceItem);
              }}
            >
              <Text style={styles.serviceBannerBtnText}>Book a Service</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {activeTab === "shop" && (
        <View style={{ flex: 1, backgroundColor: "#f9f8fc" }}>
          {/* Search and Filters Header */}
          <View style={styles.shopSearchHeader}>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={18} color="#888" style={{ marginLeft: 12 }} />
              <TextInput
                style={styles.searchBarInput}
                placeholder="Search catalog..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
            </View>

            {/* Filter Bar */}
            <View style={styles.filterRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.filterChip,
                      selectedCategory === cat.id && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategory === cat.id && styles.filterChipTextActive
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Catalog List */}
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.shopGridContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCardShop}
                onPress={() => setSelectedProduct(item)}
              >
                <Image source={item.image} style={styles.cardImageShop} resizeMode="cover" />
                <View style={styles.cardBody}>
                  <Text style={styles.cardCategory}>{item.categoryName}</Text>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.cardPrice}>GH₵ {item.price.toLocaleString()}</Text>
                  <TouchableOpacity
                    style={styles.shopCardAddBtn}
                    onPress={() => addToCart(item, 1)}
                  >
                    <Text style={styles.shopCardAddBtnText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyView}>
                <Ionicons name="search-outline" size={48} color="#aaa" />
                <Text style={styles.emptyText}>No matching products found.</Text>
              </View>
            }
          />
        </View>
      )}

      {activeTab === "cart" && (
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={styles.cartTopBar}>
            <Text style={styles.cartTopBarTitle}>Shopping Bag ({cartItemCount})</Text>
            {cart.length > 0 && (
              <TouchableOpacity onPress={() => setCart([])}>
                <Text style={{ color: "#dc2626", fontWeight: "600", fontSize: 13 }}>
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {cart.length === 0 ? (
            <View style={styles.emptyView}>
              <Ionicons name="bag-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptyText}>Discover great computers, phones and deals!</Text>
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={() => setActiveTab("shop")}
              >
                <Text style={styles.emptyActionBtnText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
              {cart.map((item) => (
                <View key={item.product.id} style={styles.cartItemRow}>
                  <Image source={item.product.image} style={styles.cartItemImg} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.cartItemTitle} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.cartItemPrice}>
                      GH₵ {item.product.price.toLocaleString()}
                    </Text>

                    {/* Stepper */}
                    <View style={styles.stepperContainer}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => updateQuantity(item.product.id, -1)}
                      >
                        <Ionicons name="remove" size={14} color="#444" />
                      </TouchableOpacity>
                      <Text style={styles.stepperCount}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => updateQuantity(item.product.id, 1)}
                      >
                        <Ionicons name="add" size={14} color="#444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeFromCart(item.product.id)}
                    style={{ padding: 6 }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Promo Code Input */}
              <View style={styles.promoContainer}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Promo code (e.g. JARVIS25)"
                  value={promoCode}
                  onChangeText={setPromoCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.promoApplyBtn} onPress={handleApplyPromo}>
                  <Text style={styles.promoApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>

              {/* Order Summary */}
              <View style={styles.orderSummaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>GH₵ {subtotal.toLocaleString()}</Text>
                </View>
                {discountAmount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: "#16a34a" }]}>
                      Discount ({discountPercent}%)
                    </Text>
                    <Text style={[styles.summaryValue, { color: "#16a34a" }]}>
                      - GH₵ {discountAmount.toLocaleString()}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery (Standard)</Text>
                  <Text style={styles.summaryValue}>GH₵ {deliveryFee.toLocaleString()}</Text>
                </View>
                <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10, marginTop: 6 }]}>
                  <Text style={[styles.summaryLabel, { fontWeight: "800", color: "#161326" }]}>
                    Total
                  </Text>
                  <Text style={styles.grandTotalText}>
                    GH₵ {grandTotal.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Checkout Button */}
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => setIsCheckoutVisible(true)}
              >
                <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                <Ionicons name="shield-checkmark" size={18} color="#ffffff" />
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </View>
      )}

      {activeTab === "account" && (
        <ScrollView style={{ flex: 1, backgroundColor: "#f9f8fc" }}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>
                {user ? user.name.charAt(0).toUpperCase() : "J"}
              </Text>
            </View>
            <Text style={styles.profileName}>{user ? user.name : "Guest User"}</Text>
            <Text style={styles.profileEmail}>
              {user ? user.email : "Sign in to manage orders & addresses"}
            </Text>

            {!user ? (
              <TouchableOpacity
                style={styles.profileSignInBtn}
                onPress={() => setIsAuthModalVisible(true)}
              >
                <Text style={styles.profileSignInBtnText}>Sign In / Register</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.profileLogoutBtn}
                onPress={() => {
                  setUser(null);
                  showToast("Logged out successfully");
                }}
              >
                <Ionicons name="log-out-outline" size={16} color="#dc2626" />
                <Text style={styles.profileLogoutBtnText}>Log Out</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Account Options */}
          <View style={styles.accountMenu}>
            <TouchableOpacity style={styles.accountMenuItem} onPress={() => setActiveTab("cart")}>
              <View style={styles.menuIconBox}>
                <Ionicons name="bag-handle-outline" size={20} color="#9e1313" />
              </View>
              <Text style={styles.menuItemTitle}>My Orders</Text>
              <Ionicons name="chevron-forward" size={18} color="#bbb" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.accountMenuItem} onPress={() => setActiveTab("shop")}>
              <View style={styles.menuIconBox}>
                <Ionicons name="heart-outline" size={20} color="#9e1313" />
              </View>
              <Text style={styles.menuItemTitle}>Wishlist ({wishlist.length})</Text>
              <Ionicons name="chevron-forward" size={18} color="#bbb" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accountMenuItem}
              onPress={() =>
                Alert.alert(
                  "Support Contact",
                  "Jarvis Computer Consult Support:\n\nEmail: support@jarvisconsult.com\nPhone: +233 54 000 0000\nLocation: Accra, Ghana"
                )
              }
            >
              <View style={styles.menuIconBox}>
                <Ionicons name="headset-outline" size={20} color="#9e1313" />
              </View>
              <Text style={styles.menuItemTitle}>Customer Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#bbb" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accountMenuItem}
              onPress={() =>
                Alert.alert(
                  "About Jarvis Computer Consult",
                  "Jarvis Computer Consult is your trusted source for premium laptops, smartphones, high-performance peripherals, and specialized IT & graphic design services."
                )
              }
            >
              <View style={styles.menuIconBox}>
                <Ionicons name="information-circle-outline" size={20} color="#9e1313" />
              </View>
              <Text style={styles.menuItemTitle}>About Jarvis Computer Consult</Text>
              <Ionicons name="chevron-forward" size={18} color="#bbb" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ==========================================
          BOTTOM NAVIGATION TABS
      =========================================== */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab("home")}
        >
          <Ionicons
            name={activeTab === "home" ? "home" : "home-outline"}
            size={22}
            color={activeTab === "home" ? "#9e1313" : "#666"}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === "home" && styles.tabBtnTextActive
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab("shop")}
        >
          <Ionicons
            name={activeTab === "shop" ? "grid" : "grid-outline"}
            size={22}
            color={activeTab === "shop" ? "#9e1313" : "#666"}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === "shop" && styles.tabBtnTextActive
            ]}
          >
            Catalog
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab("cart")}
        >
          <View>
            <Ionicons
              name={activeTab === "cart" ? "cart" : "cart-outline"}
              size={23}
              color={activeTab === "cart" ? "#9e1313" : "#666"}
            />
            {cartItemCount > 0 && (
              <View style={styles.tabCartBadge}>
                <Text style={styles.tabCartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === "cart" && styles.tabBtnTextActive
            ]}
          >
            Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab("account")}
        >
          <Ionicons
            name={activeTab === "account" ? "person" : "person-outline"}
            size={22}
            color={activeTab === "account" ? "#9e1313" : "#666"}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === "account" && styles.tabBtnTextActive
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* ==========================================
          PRODUCT DETAIL MODAL
      =========================================== */}
      <Modal
        visible={!!selectedProduct}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedProduct(null)}
      >
        {selectedProduct && (
          <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View style={styles.detailHeader}>
              <TouchableOpacity
                onPress={() => setSelectedProduct(null)}
                style={styles.detailBackBtn}
              >
                <Ionicons name="close" size={24} color="#161326" />
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle} numberOfLines={1}>
                {selectedProduct.name}
              </Text>
              <TouchableOpacity
                onPress={() => toggleWishlist(selectedProduct.id)}
                style={styles.detailWishlistBtn}
              >
                <Ionicons
                  name={wishlist.includes(selectedProduct.id) ? "heart" : "heart-outline"}
                  size={22}
                  color={wishlist.includes(selectedProduct.id) ? "#dc2626" : "#444"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }}>
              <Image
                source={selectedProduct.image}
                style={styles.detailHeroImage}
                resizeMode="cover"
              />

              <View style={styles.detailContentBox}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={styles.detailCategory}>{selectedProduct.categoryName}</Text>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailBadgeText}>{selectedProduct.badge}</Text>
                  </View>
                </View>

                <Text style={styles.detailTitle}>{selectedProduct.name}</Text>

                <View style={styles.detailPriceRow}>
                  <Text style={styles.detailPrice}>
                    GH₵ {selectedProduct.price.toLocaleString()}
                  </Text>
                  {selectedProduct.originalPrice && (
                    <Text style={styles.detailOrigPrice}>
                      GH₵ {selectedProduct.originalPrice.toLocaleString()}
                    </Text>
                  )}
                  <View style={styles.detailRatingChip}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.detailRatingText}>
                      {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                    </Text>
                  </View>
                </View>

                <View style={styles.separator} />

                <Text style={styles.detailSectionHeading}>Overview</Text>
                <Text style={styles.detailDescription}>
                  {selectedProduct.longDescription}
                </Text>

                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Ionicons name="shield-checkmark-outline" size={18} color="#16a34a" />
                    <Text style={styles.featureText}>1 Year Warranty & Official Support</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="car-outline" size={18} color="#16a34a" />
                    <Text style={styles.featureText}>Fast Delivery Across Ghana</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="refresh-outline" size={18} color="#16a34a" />
                    <Text style={styles.featureText}>7-Day Replacement Guarantee</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.detailBottomBar}>
              <TouchableOpacity
                style={styles.detailAddCartBtn}
                onPress={() => {
                  addToCart(selectedProduct, 1);
                  setSelectedProduct(null);
                }}
              >
                <Ionicons name="cart-outline" size={20} color="#ffffff" />
                <Text style={styles.detailAddCartText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.detailBuyNowBtn}
                onPress={() => {
                  addToCart(selectedProduct, 1);
                  setSelectedProduct(null);
                  setActiveTab("cart");
                }}
              >
                <Text style={styles.detailBuyNowText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </Modal>

      {/* ==========================================
          AUTHENTICATION MODAL
      =========================================== */}
      <Modal
        visible={isAuthModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAuthModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.authModalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setIsAuthModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.authLogoCenter}>
              <Image source={require("./assets/icon.png")} style={styles.authLogoImg} resizeMode="contain" />
              <Text style={styles.authBrandTitle}>JARVIS</Text>
              <Text style={styles.authBrandSubtitle}>COMPUTER CONSULT</Text>
            </View>

            {/* Switch Tabs */}
            <View style={styles.authSwitchBar}>
              <TouchableOpacity
                style={[styles.authSwitchBtn, authMode === "login" && styles.authSwitchBtnActive]}
                onPress={() => {
                  setAuthMode("login");
                  setAuthAlert(null);
                }}
              >
                <Text style={[styles.authSwitchText, authMode === "login" && styles.authSwitchTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authSwitchBtn, authMode === "signup" && styles.authSwitchBtnActive]}
                onPress={() => {
                  setAuthMode("signup");
                  setAuthAlert(null);
                }}
              >
                <Text style={[styles.authSwitchText, authMode === "signup" && styles.authSwitchTextActive]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Notification Alert */}
            {authAlert && (
              <View style={styles.authAlertBox}>
                <Ionicons name="alert-circle" size={16} color="#dc2626" />
                <Text style={styles.authAlertText}>{authAlert}</Text>
              </View>
            )}

            {/* Form Fields */}
            {authMode === "signup" && (
              <View style={styles.authInputGroup}>
                <Text style={styles.authInputLabel}>Full Name</Text>
                <View style={styles.authInputWrapper}>
                  <Ionicons name="person-outline" size={18} color="#888" style={{ marginLeft: 10 }} />
                  <TextInput
                    style={styles.authTextInput}
                    placeholder="e.g. Samuel Mensah"
                    value={signupName}
                    onChangeText={setSignupName}
                  />
                </View>
              </View>
            )}

            <View style={styles.authInputGroup}>
              <Text style={styles.authInputLabel}>Email Address</Text>
              <View style={styles.authInputWrapper}>
                <Ionicons name="mail-outline" size={18} color="#888" style={{ marginLeft: 10 }} />
                <TextInput
                  style={styles.authTextInput}
                  placeholder="Enter your email"
                  value={authMode === "login" ? loginEmail : signupEmail}
                  onChangeText={authMode === "login" ? setLoginEmail : setSignupEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.authInputGroup}>
              <Text style={styles.authInputLabel}>Password</Text>
              <View style={styles.authInputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#888" style={{ marginLeft: 10 }} />
                <TextInput
                  style={styles.authTextInput}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  value={authMode === "login" ? loginPassword : signupPassword}
                  onChangeText={authMode === "login" ? setLoginPassword : setSignupPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10 }}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.authSubmitBtn} onPress={handleAuthSubmit}>
              <Text style={styles.authSubmitText}>
                {authMode === "login" ? "Sign In to Store" : "Create Account & Enter"}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>

            {/* Google Login Button */}
            <TouchableOpacity
              style={styles.googleAuthBtn}
              onPress={() => {
                setGoogleAlert(null);
                setGoogleEmail("");
                setGooglePassword("");
                setIsGoogleModalVisible(true);
              }}
            >
              <Ionicons name="logo-google" size={18} color="#ea4335" />
              <Text style={styles.googleAuthText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ==========================================
          GOOGLE SIGN IN MODAL (With Email & Valid Password)
      =========================================== */}
      <Modal
        visible={isGoogleModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsGoogleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.googleModalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setIsGoogleModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>

            <Ionicons name="logo-google" size={32} color="#ea4335" style={{ alignSelf: "center", marginBottom: 8 }} />
            <Text style={styles.googleModalHeading}>Sign in with Google</Text>
            <Text style={styles.googleModalSubtitle}>
              to continue to <Text style={{ fontWeight: "700" }}>Jarvis Computer Consult</Text>
            </Text>

            {googleAlert && (
              <View style={styles.authAlertBox}>
                <Ionicons name="alert-circle" size={16} color="#dc2626" />
                <Text style={styles.authAlertText}>{googleAlert}</Text>
              </View>
            )}

            <View style={styles.authInputGroup}>
              <Text style={styles.authInputLabel}>Google Email Address</Text>
              <View style={styles.authInputWrapper}>
                <TextInput
                  style={styles.authTextInput}
                  placeholder="name@gmail.com"
                  value={googleEmail}
                  onChangeText={setGoogleEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.authInputGroup}>
              <Text style={styles.authInputLabel}>Google Password</Text>
              <View style={styles.authInputWrapper}>
                <TextInput
                  style={styles.authTextInput}
                  placeholder="Enter valid password (min 6 chars)"
                  secureTextEntry={true}
                  value={googlePassword}
                  onChangeText={setGooglePassword}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.googleModalSubmitBtn} onPress={handleGoogleSubmit}>
              <Text style={styles.googleModalSubmitText}>Sign In with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ==========================================
          CHECKOUT MODAL
      =========================================== */}
      <Modal
        visible={isCheckoutVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCheckoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.checkoutModalCard}>
            <View style={styles.checkoutHeader}>
              <Text style={styles.checkoutTitle}>Complete Your Order</Text>
              <TouchableOpacity onPress={() => setIsCheckoutVisible(false)}>
                <Ionicons name="close" size={22} color="#444" />
              </TouchableOpacity>
            </View>

            <Text style={styles.checkoutSectionTitle}>Delivery Address</Text>
            <TextInput
              style={styles.checkoutInput}
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Enter Street / Town / City"
            />

            <Text style={styles.checkoutSectionTitle}>Payment Method</Text>
            <TouchableOpacity
              style={[styles.payOption, paymentMethod.includes("Mobile Money") && styles.payOptionActive]}
              onPress={() => setPaymentMethod("Mobile Money (MTN / Telecel)")}
            >
              <Ionicons name="phone-portrait-outline" size={18} color="#9e1313" />
              <Text style={styles.payOptionText}>Mobile Money (MTN / Telecel / AT)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.payOption, paymentMethod.includes("Card") && styles.payOptionActive]}
              onPress={() => setPaymentMethod("Debit / Credit Card")}
            >
              <Ionicons name="card-outline" size={18} color="#9e1313" />
              <Text style={styles.payOptionText}>Debit / Credit Card (Visa / Mastercard)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.payOption, paymentMethod.includes("Delivery") && styles.payOptionActive]}
              onPress={() => setPaymentMethod("Cash on Delivery")}
            >
              <Ionicons name="cash-outline" size={18} color="#9e1313" />
              <Text style={styles.payOptionText}>Cash / POS on Delivery</Text>
            </TouchableOpacity>

            <View style={styles.checkoutTotalRow}>
              <Text style={styles.checkoutTotalLabel}>Amount to Pay:</Text>
              <Text style={styles.checkoutTotalValue}>GH₵ {grandTotal.toLocaleString()}</Text>
            </View>

            <TouchableOpacity
              style={styles.placeOrderBtn}
              onPress={() => {
                setIsCheckoutVisible(false);
                setCart([]);
                Alert.alert(
                  "Order Placed Successfully! 🎉",
                  `Thank you, ${user ? user.name : "valued customer"}!\n\nYour order has been received by Jarvis Computer Consult and will be dispatched to ${deliveryAddress}.\n\nConfirmation sent to ${user ? user.email : "your email"}.`
                );
              }}
            >
              <Text style={styles.placeOrderBtnText}>Confirm & Place Order</Text>
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==========================================
// STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  toastContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    right: 20,
    backgroundColor: "#161326",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8
  },
  toastText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
    flex: 1
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f4",
    backgroundColor: "#ffffff"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  headerLogoImg: {
    width: 42,
    height: 42,
    borderRadius: 8
  },
  brandLockup: {
    justifyContent: "center"
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#161326",
    letterSpacing: 1
  },
  brandSubtitle: {
    fontSize: 8.5,
    fontWeight: "800",
    color: "#9e1313",
    letterSpacing: 1.8,
    marginTop: 1
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdf2f2",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    gap: 4
  },
  userNameText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9e1313",
    maxWidth: 70
  },
  signInHeaderBtn: {
    backgroundColor: "#9e1313",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  signInHeaderBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12
  },
  cartHeaderBtn: {
    width: 38,
    height: 38,
    backgroundColor: "#f4f3f8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  cartBadgeCount: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#9e1313",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3
  },
  cartBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800"
  },

  // Main Scroll
  mainScroll: {
    flex: 1,
    backgroundColor: "#fbfafc"
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1eff6",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    height: 44
  },
  searchBarInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 13,
    color: "#161326"
  },

  // Banner Carousel
  bannerScrollView: {
    paddingLeft: 16,
    marginBottom: 16
  },
  bannerCard: {
    width: width - 56,
    borderRadius: 18,
    padding: 20,
    marginRight: 14,
    justifyContent: "center"
  },
  bannerBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  bannerBadgeText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 11
  },
  bannerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4
  },
  bannerSubtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    marginBottom: 14
  },
  bannerBtn: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10
  },
  bannerBtnText: {
    color: "#161326",
    fontWeight: "800",
    fontSize: 12
  },

  // Section Headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 6
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#161326"
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9e1313"
  },
  itemsCountText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600"
  },

  // Category Pills
  categoriesScroll: {
    paddingLeft: 16,
    marginBottom: 18
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#edeaf4",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10
  },
  categoryPillActive: {
    backgroundColor: "#9e1313",
    borderColor: "#9e1313"
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#444"
  },
  categoryPillTextActive: {
    color: "#ffffff"
  },

  // Product Grid
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  productCard: {
    width: (width - 44) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#f0edf6",
    overflow: "hidden"
  },
  cardImageContainer: {
    height: 135,
    position: "relative",
    backgroundColor: "#f5f4f8"
  },
  cardImage: {
    width: "100%",
    height: "100%"
  },
  cardBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(18, 14, 36, 0.75)",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6
  },
  cardBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700"
  },
  cardWishlistBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center"
  },
  cardBody: {
    padding: 12
  },
  cardCategory: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#9e1313",
    textTransform: "uppercase",
    marginBottom: 3
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#161326",
    minHeight: 34
  },
  cardRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    gap: 3
  },
  cardRatingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#333"
  },
  cardReviewsCount: {
    fontSize: 10,
    color: "#888"
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "900",
    color: "#161326"
  },
  cardOriginalPrice: {
    fontSize: 10.5,
    color: "#aaa",
    textDecorationLine: "line-through"
  },
  cardAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#9e1313",
    alignItems: "center",
    justifyContent: "center"
  },

  // Service Box
  serviceBannerBox: {
    marginHorizontal: 16,
    backgroundColor: "#fff6f6",
    borderWidth: 1,
    borderColor: "#ffdada",
    borderRadius: 18,
    padding: 20,
    marginTop: 10,
    alignItems: "center"
  },
  serviceBannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#161326",
    marginTop: 8,
    textAlign: "center"
  },
  serviceBannerText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginVertical: 8,
    lineHeight: 18
  },
  serviceBannerBtn: {
    backgroundColor: "#9e1313",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10
  },
  serviceBannerBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12
  },

  // Shop Screen Styles
  shopSearchHeader: {
    backgroundColor: "#ffffff",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  filterRow: {
    paddingLeft: 16,
    marginTop: 4
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#f1eff6",
    marginRight: 8
  },
  filterChipActive: {
    backgroundColor: "#9e1313"
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555"
  },
  filterChipTextActive: {
    color: "#ffffff"
  },
  shopGridContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  productCardShop: {
    flex: 1,
    margin: 5,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#edeaf4",
    overflow: "hidden"
  },
  cardImageShop: {
    width: "100%",
    height: 120
  },
  shopCardAddBtn: {
    backgroundColor: "#f4f3f8",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8
  },
  shopCardAddBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9e1313"
  },

  // Cart Screen
  cartTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0edf6"
  },
  cartTopBarTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#161326"
  },
  cartItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f4f8"
  },
  cartItemImg: {
    width: 65,
    height: 65,
    borderRadius: 10,
    backgroundColor: "#f0f0f4"
  },
  cartItemTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#161326"
  },
  cartItemPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: "#9e1313",
    marginTop: 2
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6
  },
  stepperBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center"
  },
  stepperCount: {
    fontSize: 13,
    fontWeight: "800",
    color: "#161326"
  },
  promoContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10
  },
  promoInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13
  },
  promoApplyBtn: {
    backgroundColor: "#161326",
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  promoApplyText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 12
  },
  orderSummaryBox: {
    backgroundColor: "#faf9fd",
    borderWidth: 1,
    borderColor: "#edeaf4",
    borderRadius: 14,
    padding: 16,
    marginTop: 16
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4
  },
  summaryLabel: {
    fontSize: 13,
    color: "#666"
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#161326"
  },
  grandTotalText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#9e1313"
  },
  checkoutBtn: {
    backgroundColor: "#9e1313",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20
  },
  checkoutBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15
  },

  // Account Screen
  profileHeader: {
    backgroundColor: "#ffffff",
    paddingVertical: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  avatarBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#9e1313",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff"
  },
  profileName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#161326"
  },
  profileEmail: {
    fontSize: 13,
    color: "#777",
    marginTop: 2
  },
  profileSignInBtn: {
    backgroundColor: "#9e1313",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 12
  },
  profileSignInBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12
  },
  profileLogoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12
  },
  profileLogoutBtnText: {
    color: "#dc2626",
    fontWeight: "700",
    fontSize: 13
  },
  accountMenu: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee"
  },
  accountMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f8"
  },
  menuIconBox: {
    width: 32,
    alignItems: "center"
  },
  menuItemTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#161326",
    marginLeft: 8
  },

  // Bottom Tabs
  bottomTabBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#edeaf4",
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 18 : 8
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#777",
    marginTop: 3
  },
  tabBtnTextActive: {
    color: "#9e1313"
  },
  tabCartBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#9e1313",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2
  },
  tabCartBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800"
  },

  // Detail Modal
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  detailBackBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  detailWishlistBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  detailHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#161326",
    maxWidth: width - 120
  },
  detailHeroImage: {
    width: width,
    height: 280,
    backgroundColor: "#f5f4f8"
  },
  detailContentBox: {
    padding: 20
  },
  detailCategory: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9e1313",
    textTransform: "uppercase"
  },
  detailBadge: {
    backgroundColor: "#161326",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  detailBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700"
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#161326",
    marginVertical: 8
  },
  detailPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginVertical: 4
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: "900",
    color: "#9e1313"
  },
  detailOrigPrice: {
    fontSize: 14,
    color: "#aaa",
    textDecorationLine: "line-through"
  },
  detailRatingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fffbeb",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: "auto"
  },
  detailRatingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#78350f"
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f4",
    marginVertical: 16
  },
  detailSectionHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: "#161326",
    marginBottom: 6
  },
  detailDescription: {
    fontSize: 13.5,
    color: "#555",
    lineHeight: 20
  },
  featuresList: {
    marginTop: 16,
    gap: 10
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  featureText: {
    fontSize: 12.5,
    color: "#444",
    fontWeight: "600"
  },
  detailBottomBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
    backgroundColor: "#ffffff"
  },
  detailAddCartBtn: {
    flex: 1,
    backgroundColor: "#161326",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  },
  detailAddCartText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13
  },
  detailBuyNowBtn: {
    flex: 1,
    backgroundColor: "#9e1313",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  detailBuyNowText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13
  },

  // Modal Common
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  modalCloseBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0edf6",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  },

  // Auth Modal
  authModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    position: "relative"
  },
  authLogoCenter: {
    alignItems: "center",
    marginBottom: 16
  },
  authLogoImg: {
    width: 48,
    height: 48,
    marginBottom: 6
  },
  authBrandTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#161326",
    letterSpacing: 1
  },
  authBrandSubtitle: {
    fontSize: 9,
    fontWeight: "800",
    color: "#9e1313",
    letterSpacing: 2
  },
  authSwitchBar: {
    flexDirection: "row",
    backgroundColor: "#f4f3f8",
    borderRadius: 10,
    padding: 3,
    marginBottom: 16
  },
  authSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8
  },
  authSwitchBtnActive: {
    backgroundColor: "#ffffff"
  },
  authSwitchText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#777"
  },
  authSwitchTextActive: {
    color: "#161326"
  },
  authAlertBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fef2f2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fecaca"
  },
  authAlertText: {
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "700",
    flex: 1
  },
  authInputGroup: {
    marginBottom: 12
  },
  authInputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4
  },
  authInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    height: 44,
    backgroundColor: "#faf9fd"
  },
  authTextInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 13,
    color: "#161326"
  },
  authSubmitBtn: {
    backgroundColor: "#9e1313",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8
  },
  authSubmitText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13
  },
  googleAuthBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 10
  },
  googleAuthText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333"
  },

  // Google Modal
  googleModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 24,
    position: "relative"
  },
  googleModalHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f1f1f",
    textAlign: "center"
  },
  googleModalSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 2
  },
  googleModalSubmitBtn: {
    backgroundColor: "#1a73e8",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  googleModalSubmitText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13
  },

  // Checkout Modal
  checkoutModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22
  },
  checkoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },
  checkoutTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#161326"
  },
  checkoutSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#555",
    marginTop: 10,
    marginBottom: 6,
    textTransform: "uppercase"
  },
  checkoutInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    backgroundColor: "#faf9fd"
  },
  payOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 11,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 6
  },
  payOptionActive: {
    borderColor: "#9e1313",
    backgroundColor: "#fef2f2"
  },
  payOptionText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#333"
  },
  checkoutTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee"
  },
  checkoutTotalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#555"
  },
  checkoutTotalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#9e1313"
  },
  placeOrderBtn: {
    backgroundColor: "#9e1313",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16
  },
  placeOrderBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14
  },

  // Empty View
  emptyView: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 20
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#161326",
    marginTop: 10
  },
  emptyText: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 4
  },
  emptyActionBtn: {
    backgroundColor: "#9e1313",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginTop: 16
  },
  emptyActionBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13
  }
});
