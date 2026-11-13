export default function ProductCard({ product, setSelectedProduct, handleAddToCart, money }) {
  return (
    <article className="product-card reveal-on-scroll">
      <button
        type="button"
        className="product-image"
        onClick={() => setSelectedProduct(product)}
        aria-label={`View ${product.title}`}
      >
        <span className="product-image-tag">MKOCIA FIND</span>

        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
        />

        <span className="quick-view">
          Quick view ↗
        </span>
      </button>

      <div className="product-details">
        <span className="product-category">
          {product.category}
        </span>

        <button
          type="button"
          className="product-title"
          onClick={() => setSelectedProduct(product)}
        >
          {product.title}
        </button>

        <div className="product-rating">
          <span>★</span>
          {product.rating?.rate || "N/A"}
          <span className="review-count">
            ({product.rating?.count || 0} reviews)
          </span>
        </div>

        <div className="product-card-bottom">
          <strong className="price">
            {money(product.price)}
          </strong>

          <button
            className="add-cart-button"
            onClick={() => handleAddToCart(product)}
          >
            <span>+</span> Add
          </button>
        </div>
      </div>
    </article>
  );
}