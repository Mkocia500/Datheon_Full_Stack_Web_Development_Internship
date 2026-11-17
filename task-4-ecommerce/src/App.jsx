import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import CartDrawer from "./components/CartDrawer";
import "./App.css";


// STORE CONFIGURATION AND HELPER FUNCTIONS


// Base endpoint for the Fake Store API
const API_URL = "https://fakestoreapi.com/products";

// Product filter categories shown in the menu and filter bar
const categories = [
  { label: "All Products", value: "all" },
  { label: "Electronics", value: "electronics" },
  { label: "Jewelry", value: "jewelery" },
  { label: "Men's Clothing", value: "men's clothing" },
  { label: "Women's Clothing", value: "women's clothing" },
];

// Format any numeric amount as a USD price string
const money = (amount) => `$${Number(amount || 0).toFixed(2)}`;

const paymentMethodLabels = {
  card: "Credit / Debit Card (Visa / Mastercard)",
  paypal: "PayPal",
};

// Safely read and parse saved arrays from browser localStorage
const loadSavedData = (key) => {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Unable to load ${key}:`, error);
    return [];
  }
};

// Serialize and store data into browser localStorage
const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    return false;
  }
};


// MAIN APPLICATION COMPONENT


function App() {

  // PRODUCT DATA AND FETCH STATE

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);


  // SEARCH, FILTER AND SORT STATE

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");


  // CART AND ORDER HISTORY STATE

  const [cart, setCart] = useState(() => loadSavedData("mkocia-cart"));
  const [orderHistory, setOrderHistory] = useState(() =>
    loadSavedData("mkocia-orders")
  );


  // DRAWERS, MODALS AND TOAST NOTIFICATION STATE

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [toastMessage, setToastMessage] = useState("");


  // CUSTOMER CHECKOUT FORM AND PAYMENT STATE

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");


  // FETCH PRODUCTS FROM API ON LOAD OR RETRY

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        // Stop and throw an error if the server response is not OK
        if (!response.ok) {
          throw new Error(
            `Unable to retrieve products. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        // Make sure the returned payload is a valid product array
        if (!Array.isArray(data)) {
          throw new Error("The product data returned was invalid.");
        }

        setProducts(data);
      } catch (err) {
        // Ignore abort errors triggered when the request is cancelled
        if (err.name !== "AbortError") {
          setError(
            err.message ||
              "Something went wrong while loading products. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Cancel any active fetch request if the component unmounts or retries
    return () => controller.abort();
  }, [retryCount]);


  // SYNC CART AND ORDER HISTORY TO LOCAL STORAGE

  useEffect(() => {
    const saved = saveData("mkocia-cart", cart);

    if (!saved) {
      setToastMessage("Unable to save your cart on this device.");
    }
  }, [cart]);

  useEffect(() => {
    const saved = saveData("mkocia-orders", orderHistory);

    if (!saved) {
      setToastMessage("Unable to save your order history.");
    }
  }, [orderHistory]);


  // AUTO-DISMISS TOAST NOTIFICATION AFTER 3 SECONDS

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage]);


  // SCROLL REVEAL ANIMATION OBSERVER

  useEffect(() => {
    // Immediately show elements if IntersectionObserver is unsupported
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll(".reveal-on-scroll")
        .forEach((element) => element.classList.add("is-visible"));

      return;
    }

    // Watch elements and trigger their entrance animation once visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    const elements = document.querySelectorAll(
      ".reveal-on-scroll:not(.is-visible)"
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [products]);


  // FILTER AND SORT PRODUCTS

  const filteredProducts = useMemo(() => {
    // Filter products by selected category and search query
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const matchesSearch = (product.title || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });

    // Sort a shallow copy of the filtered list based on the active sort option
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort(
        (a, b) =>
          (b.rating?.rate || 0) - (a.rating?.rate || 0)
      );
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);


  // CART TOTALS, TAX AND SHIPPING CALCULATIONS

  const cartCount = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0
  );

  // Apply 10% tax and grant free shipping on orders $50 or more
  const tax = subtotal * 0.1;

  const shipping =
    subtotal === 0 || subtotal >= 50 ? 0 : 5;

  const total = subtotal + tax + shipping;


  // RECOMMENDED PRODUCTS FOR QUICK VIEW MODAL

  const suggestedProducts = useMemo(() => {
    if (!selectedProduct) return [];

    // Score other products by category match, price proximity, and rating
    return products
      .filter((product) => product.id !== selectedProduct.id)
      .map((product) => {
        const sameCategory =
          product.category === selectedProduct.category;

        const priceDifference =
          Math.abs(product.price - selectedProduct.price) /
          Math.max(selectedProduct.price, 1);

        const ratingDifference = Math.abs(
          (product.rating?.rate || 0) -
            (selectedProduct.rating?.rate || 0)
        );

        return {
          ...product,
          recommendationScore:
            (sameCategory ? 0 : 2) +
            priceDifference +
            ratingDifference * 0.15,
        };
      })
      .sort(
        (a, b) =>
          a.recommendationScore - b.recommendationScore
      )
      .slice(0, 4);
  }, [products, selectedProduct]);


  // NAVIGATION AND DRAWER HANDLERS

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setIsMenuOpen(false);
  };

  // Reset active filters and scroll smoothly back to the top
  const handleGoHome = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setIsSearchOpen(false);
    setIsMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openOrders = () => {
    setIsMenuOpen(false);
    setIsOrderHistoryOpen(true);
  };


  // SHOPPING CART HANDLERS

  // Add a product to the cart or increment its existing quantity
  const handleAddToCart = (product) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setToastMessage("Product added to your cart.");
  };

  // Adjust item quantity and remove any item whose quantity drops to zero
  const handleQuantityChange = (productId, change) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity + change,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((current) =>
      current.filter((item) => item.id !== productId)
    );

    setToastMessage("Item removed from your cart.");
  };


  // CHECKOUT ORDER SUBMISSION HANDLER

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    // Prevent checkout if cart is empty or required customer fields are blank
    if (cart.length === 0) {
      setToastMessage("Your shopping cart is empty.");
      return;
    }

    if (
      !customerDetails.name.trim() ||
      !customerDetails.email.trim() ||
      !customerDetails.address.trim()
    ) {
      setToastMessage("Please complete all customer details.");
      return;
    }

    // Create a permanent snapshot of the completed order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleString(),

      items: cart.map((item) => ({
        ...item,
      })),

      customer: {
        ...customerDetails,
      },

      subtotal,
      tax,
      shipping,
      total,

      paymentMethod,
      paymentStatus: "Pending",
    };

    // Save order to history, empty the cart, and reset checkout inputs
    setOrderHistory((previous) => [
      newOrder,
      ...previous,
    ]);

    setCart([]);

    setOrderPlaced(true);

    setCustomerDetails({
      name: "",
      email: "",
      address: "",
    });

    setPaymentMethod("card");

    setToastMessage("Your order has been recorded.");
  };


  // MAIN APPLICATION USER INTERFACE

  return (
    <div className="app">


      {/* TOAST NOTIFICATION BANNER */}

      {toastMessage && (
        <div className="toast-notification" role="status">
          <span className="toast-check">✓</span>
          {toastMessage}
        </div>
      )}


      {/* TOP NAVIGATION BAR */}

      <Navbar
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        handleGoHome={handleGoHome}
        scrollToProducts={scrollToProducts}
        openOrders={openOrders}
        setIsSearchOpen={setIsSearchOpen}
        setIsCartOpen={setIsCartOpen}
        cartCount={cartCount}
      />


      {/* MOBILE SLIDE-OUT NAVIGATION MENU */}

      {isMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        >
          <nav
            className="mobile-menu"
            aria-label="Mobile navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-heading">
              <span className="brand">
                Mkocia<span>Mart</span>
              </span>

              <button
                type="button"
                className="close-button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <button
              className="menu-link"
              onClick={handleGoHome}
            >
              Home
            </button>

            <button
              className="menu-link"
              onClick={scrollToProducts}
            >
              Shop all products
            </button>

            {/* Category filter shortcuts */}
            <p className="menu-label">Categories</p>

            {categories.map((category) => (
              <button
                key={category.value}
                className={`menu-link ${
                  selectedCategory === category.value
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCategory(category.value);
                  setIsMenuOpen(false);
                  scrollToProducts();
                }}
              >
                {category.label}
              </button>
            ))}

            <button
              className="menu-link orders-menu-link"
              onClick={openOrders}
            >
              My Orders ({orderHistory.length})
            </button>
          </nav>
        </div>
      )}

      <main>


        {/* HERO BANNER SECTION */}

        <section className="hero-section">

          <div className="hero-content">

            <span className="eyebrow">
              THE MKOCIA COLLECTION
            </span>

            <h1 className="animated-hero-heading">
              <span className="heading-line heading-first">
                Find your next
              </span>

              <span className="heading-line heading-second">
                favourite thing.
              </span>
            </h1>

            <p>
              Discover thoughtfully selected products for
              your everyday life. Quality finds, all in one
              place.
            </p>

            <button
              className="primary-button hero-button"
              onClick={scrollToProducts}
            >
              Explore collection <span>→</span>
            </button>

            <div className="hero-note">
              <span className="hero-note-line" />
              <span>DISCOVER. CHOOSE. ENJOY.</span>
            </div>

          </div>

          <div className="hero-visual">

            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=85"
                alt="Modern shopping boutique"
              />
            </div>

            <div className="hero-floating-card">
              <span className="floating-card-icon">✦</span>

              <div>
                <strong>Made for your style</strong>
                <p>Explore something new</p>
              </div>
            </div>

            <div className="hero-decor" />

          </div>

        </section>


        {/* STORE HIGHLIGHTS STRIP */}

        <section className="benefits-strip">

          <div>
            <span className="benefit-icon">◇</span>

            <div className="reveal-on-scroll">
              <strong>Curated collection</strong>
              <p>Products worth discovering</p>
            </div>
          </div>

          <div>
            <span className="benefit-icon">↗</span>

            <div className="reveal-on-scroll">
              <strong>Easy shopping</strong>
              <p>A simple shopping experience</p>
            </div>
          </div>

          <div>
            <span className="benefit-icon">♡</span>

            <div className="reveal-on-scroll">
              <strong>Find your favourites</strong>
              <p>Explore products you love</p>
            </div>
          </div>

        </section>


        {/* MAIN PRODUCT CATALOG GRID */}

        <ProductGrid
          products={products}
          filteredProducts={filteredProducts}
          loading={loading}
          error={error}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSearchOpen={isSearchOpen}
          sortBy={sortBy}
          setSortBy={setSortBy}
          handleGoHome={handleGoHome}
          setSelectedProduct={setSelectedProduct}
          handleAddToCart={handleAddToCart}
          money={money}
          onRetry={() => setRetryCount((count) => count + 1)}
        />


        {/* PRODUCT QUICK VIEW MODAL */}

        {selectedProduct && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="modal product-modal"
              onClick={(event) => event.stopPropagation()}
            >

              <div className="modal-heading">
                <span className="eyebrow">
                  PRODUCT DETAILS
                </span>

                <button
                  className="close-button"
                  onClick={() => setSelectedProduct(null)}
                  aria-label="Close product details"
                >
                  ×
                </button>
              </div>

              <div className="product-modal-content">

                <div className="product-modal-image">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                  />
                </div>

                <div className="product-modal-info">

                  <span className="product-category">
                    {selectedProduct.category}
                  </span>

                  <h2>{selectedProduct.title}</h2>

                  <div className="product-rating">
                    <span>★</span>

                    {selectedProduct.rating?.rate || "N/A"}

                    <span className="review-count">
                      ({selectedProduct.rating?.count || 0} reviews)
                    </span>
                  </div>

                  <strong className="modal-price">
                    {money(selectedProduct.price)}
                  </strong>

                  <p>{selectedProduct.description}</p>

                  <button
                    className="primary-button full-button"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    Add to shopping cart
                  </button>

                </div>

              </div>


              {/* RELATED PRODUCT RECOMMENDATIONS */}

              <div className="suggested-section">

                <div className="suggested-heading">
                  <div>
                    <span className="eyebrow">
                      DISCOVER MORE
                    </span>

                    <h3>
                      You might also like<span>.</span>
                    </h3>

                    <p>
                      Here are a few other products you may
                      find interesting.
                    </p>
                  </div>
                </div>

                {suggestedProducts.length > 0 ? (
                  <div className="suggested-grid">

                    {suggestedProducts.map((product) => (
                      <button
                        type="button"
                        className="suggested-card"
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="suggested-image">
                          <img
                            src={product.image}
                            alt={product.title}
                            loading="lazy"
                          />
                        </div>

                        <div className="suggested-info">

                          <span>{product.category}</span>

                          <h4>{product.title}</h4>

                          <div className="suggested-rating">
                            <span>★</span>
                            {product.rating?.rate || "N/A"}
                          </div>

                          <strong>
                            {money(product.price)}
                          </strong>

                        </div>
                      </button>
                    ))}

                  </div>
                ) : (
                  <p className="suggested-empty">
                    No similar products available right now.
                  </p>
                )}

              </div>

            </div>
          </div>
        )}


        {/* SHOPPING CART DRAWER */}

        <CartDrawer
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          cart={cart}
          handleQuantityChange={handleQuantityChange}
          handleRemoveFromCart={handleRemoveFromCart}
          subtotal={subtotal}
          tax={tax}
          shipping={shipping}
          total={total}
          money={money}
          setIsCheckoutOpen={setIsCheckoutOpen}
          setOrderPlaced={setOrderPlaced}
        />


        {/* CHECKOUT MODAL */}

        {isCheckoutOpen && (
          <div
            className="modal-overlay"
            onClick={() => setIsCheckoutOpen(false)}
          >
            <div
              className="modal checkout-modal"
              onClick={(event) => event.stopPropagation()}
            >

              {orderPlaced ? (


                /* ORDER CONFIRMATION SCREEN */

                <div className="order-success">

                  <div className="success-icon">✓</div>

                  <span className="eyebrow">
                    THANK YOU
                  </span>

                  <h2>Order received!</h2>

                  <p>
                    Your order has been recorded in this store
                    demo. Thank you for choosing Mkocia.
                  </p>

                  <button
                    className="primary-button full-button"
                    onClick={() => {
                      setOrderPlaced(false);
                      setIsCheckoutOpen(false);
                      setIsOrderHistoryOpen(true);
                    }}
                  >
                    View my orders
                  </button>

                </div>

              ) : (


                /* CHECKOUT DETAILS FORM */

                <>

                  <div className="modal-heading">

                    <div>
                      <span className="eyebrow">
                        ALMOST THERE
                      </span>

                      <h2>Checkout</h2>
                    </div>

                    <button
                      className="close-button"
                      onClick={() => setIsCheckoutOpen(false)}
                      aria-label="Close checkout"
                    >
                      ×
                    </button>

                  </div>

                  <p className="modal-subtitle">
                    Review your order and provide your details
                    to complete your purchase.
                  </p>

                  <form onSubmit={handlePlaceOrder}>


                    {/* ORDER ITEMS AND COST BREAKDOWN */}

                    <div className="checkout-section">

                      <div className="checkout-section-heading">
                        <span className="eyebrow">
                          01 — YOUR PURCHASE
                        </span>

                        <h3>Order Summary</h3>
                      </div>

                      <div className="checkout-items">

                        {cart.map((item) => (
                          <div
                            className="checkout-item"
                            key={item.id}
                          >

                            <div className="checkout-item-image">
                              <img
                                src={item.image}
                                alt={item.title}
                              />
                            </div>

                            <div className="checkout-item-details">
                              <h4>{item.title}</h4>

                              <span>
                                Quantity: {item.quantity}
                              </span>

                              <strong>
                                {money(item.price)}
                              </strong>
                            </div>

                            <div className="checkout-item-total">
                              {money(item.price * item.quantity)}
                            </div>

                          </div>
                        ))}

                      </div>

                      <div className="checkout-breakdown">

                        <div>
                          <span>Subtotal</span>
                          <strong>{money(subtotal)}</strong>
                        </div>

                        <div>
                          <span>Tax (10%)</span>
                          <strong>{money(tax)}</strong>
                        </div>

                        <div>
                          <span>Shipping</span>

                          <strong>
                            {shipping === 0
                              ? "FREE"
                              : money(shipping)}
                          </strong>
                        </div>

                        <div className="checkout-grand-total">
                          <span>Total to pay</span>
                          <strong>{money(total)}</strong>
                        </div>

                      </div>

                    </div>


                    {/* CUSTOMER DELIVERY DETAILS */}

                    <div className="checkout-section">

                      <div className="checkout-section-heading">
                        <span className="eyebrow">
                          02 — YOUR DETAILS
                        </span>

                        <h3>Customer Information</h3>
                      </div>

                      <div className="form-group">

                        <label htmlFor="customer-name">
                          Full name
                        </label>

                        <input
                          id="customer-name"
                          type="text"
                          placeholder="Your full name"
                          value={customerDetails.name}
                          onChange={(event) =>
                            setCustomerDetails((previous) => ({
                              ...previous,
                              name: event.target.value,
                            }))
                          }
                          required
                        />

                      </div>

                      <div className="form-group">

                        <label htmlFor="customer-email">
                          Email address
                        </label>

                        <input
                          id="customer-email"
                          type="email"
                          placeholder="you@example.com"
                          value={customerDetails.email}
                          onChange={(event) =>
                            setCustomerDetails((previous) => ({
                              ...previous,
                              email: event.target.value,
                            }))
                          }
                          required
                        />

                      </div>

                      <div className="form-group">

                        <label htmlFor="customer-address">
                          Delivery address
                        </label>

                        <textarea
                          id="customer-address"
                          placeholder="Enter your delivery address"
                          value={customerDetails.address}
                          onChange={(event) =>
                            setCustomerDetails((previous) => ({
                              ...previous,
                              address: event.target.value,
                            }))
                          }
                          required
                        />

                      </div>

                    </div>


                    {/* PAYMENT METHOD SELECTION */}

                    <div className="checkout-section">

                      <div className="checkout-section-heading">

                        <span className="eyebrow">
                          03 — PAYMENT
                        </span>

                        <h3>Payment Method</h3>

                        <p>
                          Select your preferred payment method.
                        </p>

                      </div>

                      <div className="payment-options">

                        <label
                          className={`payment-option ${
                            paymentMethod === "card"
                              ? "selected"
                              : ""
                          }`}
                        >

                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={() =>
                              setPaymentMethod("card")
                            }
                          />

                          <div className="payment-option-content">

                            <div className="payment-option-title">
                              <strong>Credit / Debit Card</strong>
                              <span>Visa · Mastercard</span>
                            </div>

                            <div className="payment-logos">
                              <span className="visa-logo">
                                VISA
                              </span>

                              <span className="mastercard-logo">
                                <i />
                                <i />
                              </span>
                            </div>

                          </div>

                        </label>

                        <label
                          className={`payment-option ${
                            paymentMethod === "paypal"
                              ? "selected"
                              : ""
                          }`}
                        >

                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentMethod === "paypal"}
                            onChange={() =>
                              setPaymentMethod("paypal")
                            }
                          />

                          <div className="payment-option-content">

                            <div className="payment-option-title">
                              <strong>PayPal</strong>
                              <span>
                                Pay securely with PayPal
                              </span>
                            </div>

                            <span className="paypal-logo">
                              PayPal
                            </span>

                          </div>

                        </label>

                      </div>

                      <p className="payment-demo-note">
                        Demo checkout only. No real payment
                        will be collected.
                      </p>

                    </div>


                    {/* FINAL PAYABLE TOTAL AND SUBMIT BUTTON */}

                    <div className="checkout-total">
                      <span>Amount payable</span>
                      <strong>{money(total)}</strong>
                    </div>

                    <button
                      type="submit"
                      className="primary-button full-button"
                      disabled={cart.length === 0}
                    >
                      Place order
                    </button>

                  </form>

                </>

              )}

            </div>
          </div>
        )}


        {/* ORDER HISTORY MODAL */}

        {isOrderHistoryOpen && (
          <div
            className="modal-overlay"
            onClick={() => setIsOrderHistoryOpen(false)}
          >
            <div
              className="modal orders-modal"
              onClick={(event) => event.stopPropagation()}
            >

              <div className="modal-heading">

                <div>
                  <span className="eyebrow">
                    YOUR ACCOUNT
                  </span>

                  <h2>Order history</h2>
                </div>

                <button
                  className="close-button"
                  onClick={() => setIsOrderHistoryOpen(false)}
                  aria-label="Close order history"
                >
                  ×
                </button>

              </div>

              {orderHistory.length === 0 ? (

                <div className="empty-cart">

                  <span className="empty-cart-icon">◇</span>

                  <h3>No orders yet.</h3>

                  <p>
                    Your completed orders will appear here.
                  </p>

                </div>

              ) : (

                <div className="orders-list">

                  {orderHistory.map((order) => (

                    <article
                      className="order-card"
                      key={order.id}
                    >

                      <div className="order-card-header">

                        <div>
                          <span className="eyebrow">
                            ORDER REFERENCE
                          </span>

                          <strong>{order.id}</strong>
                        </div>

                        <span className="order-date">
                          {order.date}
                        </span>

                      </div>

                      <div className="order-items-preview">

                        {order.items.map((item) => (

                          <div
                            className="order-item-row"
                            key={item.id}
                          >

                            <span>
                              {item.title} × {item.quantity}
                            </span>

                            <strong>
                              {money(item.price * item.quantity)}
                            </strong>

                          </div>

                        ))}

                      </div>

                      <p className="order-address">
                        <strong>Deliver to:</strong>{" "}
                        {order.customer?.name} —{" "}
                        {order.customer?.address}
                      </p>

                      <p className="order-payment">
                        <strong>Payment method:</strong>{" "}
                        {paymentMethodLabels[order.paymentMethod] ||
                          order.paymentMethod}
                      </p>

                      <p className="order-payment">
                        <strong>Payment status:</strong>{" "}
                        {order.paymentStatus}
                      </p>

                      <div className="order-card-footer">
                        <span>Order total</span>

                        <strong>{money(order.total)}</strong>
                      </div>

                    </article>

                  ))}

                </div>

              )}

            </div>
          </div>
        )}

      </main>


      {/* MOBILE FLOATING CART BAR */}

      {cartCount > 0 && (
        <button
          className="mobile-floating-cart"
          onClick={() => setIsCartOpen(true)}
          aria-label={`View cart with ${cartCount} items`}
        >

          <span className="floating-cart-count">
            {cartCount}
          </span>

          <strong>View cart</strong>

          <span>{money(total)}</span>

          <span>→</span>

        </button>
      )}


      {/* SITE FOOTER */}

      <footer className="site-footer">

        <div className="footer-main">

          <div>

            <button
              className="brand footer-brand"
              onClick={handleGoHome}
            >
              Mkocia<span>Mart</span>
            </button>

            <p>
              Discover something you love. A simpler way
              to explore products for everyday living.
            </p>

          </div>

          <div className="footer-links">

            <strong>Explore</strong>

            <button onClick={handleGoHome}>
              Home
            </button>

            <button onClick={scrollToProducts}>
              Shop products
            </button>

            <button onClick={openOrders}>
              My orders
            </button>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} MkociaMart All rights reserved.
          </span>

          <span>
            Discover. Choose. Enjoy.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;
