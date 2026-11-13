export default function CartDrawer({
  isCartOpen,
  setIsCartOpen,
  cart,
  handleQuantityChange,
  handleRemoveFromCart,
  subtotal,
  tax,
  shipping,
  total,
  money,
  setIsCheckoutOpen,
  setOrderPlaced,
}) {
  if (!isCartOpen) return null;

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-heading">
          <div>
            <span className="eyebrow">YOUR SELECTION</span>
            <h2>Shopping cart</h2>
          </div>

          <button
            className="close-button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-cart-icon">◇</span>
              <h3>Your cart is waiting.</h3>
              <p>You haven't added anything yet.</p>
              <button
                className="primary-button"
                onClick={() => setIsCartOpen(false)}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.title} />
                    </div>

                    <div className="cart-item-details">
                      <h4>{item.title}</h4>
                      <strong>{money(item.price)}</strong>

                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <strong className="item-total">
                      {money(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3>Order summary</h3>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>

                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span>{money(tax)}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : money(shipping)}</span>
                </div>

                <div className="summary-row total-row">
                  <strong>Total</strong>
                  <strong>{money(total)}</strong>
                </div>

                <button
                  className="primary-button full-button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                    setOrderPlaced(false);
                  }}
                >
                  Continue to checkout
                </button>

                <p className="cart-footnote">
                  Your order summary is calculated before checkout.
                </p>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}