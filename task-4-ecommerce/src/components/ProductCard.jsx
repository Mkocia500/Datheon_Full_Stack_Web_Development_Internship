
export default function ProductCard({
  product,
  setSelectedProduct,
  handleAddToCart,
  money,
}) {
  const rating = product.rating?.rate;
  const reviewCount = product.rating?.count ?? 0;

  return (
    <article className="product-card reveal-on-scroll">
      {/* Product Image */}
      <button
        type="button"
        className="product-image"
        onClick={() => setSelectedProduct(product)}
        aria-label={`View details for ${product.title}`}
      >
        <img
          src={product.image}
          alt={product.title || "Product image"}
          loading="lazy"
        />

        <span className="quick-view">
          Quick view ↗
        </span>
      </button>

      {/* Product Details */}
      <div className="product-details">
        <span className="product-category">
          {product.category || "General"}
        </span>

        <button
          type="button"
          className="product-title"
          onClick={() => setSelectedProduct(product)}
          aria-label={`View ${product.title}`}
        >
          {product.title || "Untitled Product"}
        </button>

        {/* Product Rating */}
        <div
          className="product-rating"
          aria-label={
            rating != null
              ? `Rated ${rating} out of 5 from ${reviewCount} reviews`
              : "No rating available"
          }
        >
          <span aria-hidden="true">★</span>

          {rating != null
            ? Number(rating).toFixed(1)
            : "N/A"}

          <span className="review-count">
            ({reviewCount} reviews)
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="product-card-bottom">
          <strong className="price">
            {money(product.price)}
          </strong>

          <button
            type="button"
            className="add-cart-button"
            onClick={() => handleAddToCart(product)}
            aria-label={`Add ${product.title} to cart`}
          >
            <span aria-hidden="true">+</span> Add
          </button>
        </div>
      </div>
    </article>
  );
}
