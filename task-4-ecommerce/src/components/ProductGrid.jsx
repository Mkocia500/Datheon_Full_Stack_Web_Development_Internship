import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  filteredProducts,
  loading,
  error,
  selectedCategory,
  setSelectedCategory,
  categories,
  searchTerm,
  setSearchTerm,
  isSearchOpen,
  sortBy,
  setSortBy,
  handleGoHome,
  setSelectedProduct,
  handleAddToCart,
  money,
}) {
  return (
    <section className="products-section" id="products">
      <div className="section-topline reveal-on-scroll">
        <span className="eyebrow">SHOP OUR COLLECTION</span>
        <span className="product-count">
          {products.length} PRODUCTS
        </span>
      </div>

      <div className="section-heading reveal-on-scroll">
        <div>
          <h2>
            Explore our products<span>.</span>
          </h2>
          <p>
            Take a look around. Your next favourite might be here.
          </p>
        </div>
      </div>

      {isSearchOpen && (
        <div className="search-panel">
          <div className="search-input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7.5" />
              <path d="m16.5 16.5 4 4" />
            </svg>

            <input
              autoFocus
              type="search"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      <div className="catalog-toolbar">
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.value}
              className={selectedCategory === category.value ? "active" : ""}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Sort products"
        >
          <option value="default">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="status-message">
          <div className="loader" />
          <p>Preparing something good for you...</p>
        </div>
      ) : error ? (
        <div className="status-message error-message">
          <h3>We couldn't load the products.</h3>
          <p>{error}</p>
          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-results">
          <span>⌕</span>
          <h3>No products found</h3>
          <p>Try another search or choose a different category.</p>
          <button className="primary-button" onClick={handleGoHome}>
            View all products
          </button>
        </div>
      ) : (
        <>
          <div className="results-info">
            Showing <strong>{filteredProducts.length}</strong> products
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                setSelectedProduct={setSelectedProduct}
                handleAddToCart={handleAddToCart}
                money={money}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}