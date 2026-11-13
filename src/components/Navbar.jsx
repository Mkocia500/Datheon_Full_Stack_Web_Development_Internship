export default function Navbar({
  setIsMenuOpen,
  isMenuOpen,
  handleGoHome,
  scrollToProducts,
  openOrders,
  setIsSearchOpen,
  setIsCartOpen,
  cartCount,
}) {
  return (
    <header className="Mkocia-header">
      <div className="header-inner">
        <div className="header-left">
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <button type="button" className="brand" onClick={handleGoHome}>
            Mkocia<span>.</span>
          </button>
        </div>

        <nav className="desktop-nav" aria-label="Main navigation">
          <button onClick={handleGoHome}>Home</button>
          <button onClick={scrollToProducts}>Shop</button>
          <button onClick={openOrders}>My Orders</button>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              setIsSearchOpen((value) => !value);
              scrollToProducts();
            }}
            aria-label="Search products"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7.5" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </button>

          <button
            type="button"
            className="cart-header-button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open shopping cart with ${cartCount} items`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.5L22 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            <span className="cart-label">Cart</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}