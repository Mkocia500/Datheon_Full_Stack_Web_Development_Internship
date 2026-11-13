
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products = [],
  filteredProducts = [],
  loading,
  error,
  selectedCategory,
  setSelectedCategory,
  categories = [],
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
  const hasSearch = searchTerm.trim().length > 0;
  const hasActiveFilter = selectedCategory !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    handleGoHome?.();
  };

  return (
    <section
      className="products-section"
      id="products"
      aria-labelledby="products-heading"
    >
      {/* SECTION INTRODUCTION */}
      <div className="section-topline reveal-on-scroll">
        <span className="eyebrow">SHOP OUR COLLECTION</span>

        <span className="product-count">
          {products.length} PRODUCTS
        </span>
      </div>

      <div className="section-heading reveal-on-scroll">
        <div>
          <h2 id="products-heading">
            Explore our products<span>.</span>
          </h2>

          <p>
            Take a look around. Your next favourite might be here.
          </p>
        </div>
      </div>

      {/* SEARCH PANEL */}
      {isSearchOpen && (
        <div className="search-panel">
          <div className="search-input-wrap">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="7.5" />
              <path d="m16.5 16.5 4 4" />
            </svg>

            <input
              autoFocus
              type="search"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search products"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="clear-search-button"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* FILTERS AND SORTING */}
      <div className="catalog-toolbar">
        <div
          className="category-filters"
          role="group"
          aria-label="Filter products by category"
        >
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              className={
                selectedCategory === category.value ? "active" : ""
              }
              aria-pressed={selectedCategory === category.value}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="sort-wrapper">
          <label htmlFor="product-sort" className="sr-only">
            Sort products
          </label>

          <select
            id="product-sort"
            className="sort-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="status-message" role="status">
          <div className="loader" />
          <p>Preparing something good for you...</p>
        </div>

      ) : error ? (

        /* ERROR STATE */
        <div className="status-message error-message" role="alert">
          <h3>We couldn't load the products.</h3>
          <p>{error}</p>

          <button
            type="button"
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>

      ) : filteredProducts.length === 0 ? (

        /* EMPTY RESULTS */
        <div className="no-results">
          <span aria-hidden="true">⌕</span>

          <h3>No products found</h3>

          <p>
            {hasSearch
              ? `We couldn't find anything matching "${searchTerm}". Try another search.`
              : "There are no products in this category right now."}
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={clearFilters}
          >
            View all products
          </button>
        </div>

      ) : (

        /* PRODUCT RESULTS */
        <>
          <div className="results-info" aria-live="polite">
            Showing <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}

            {hasActiveFilter && (
              <span> in {selectedCategory}</span>
            )}

            {hasSearch && (
              <span> matching "{searchTerm}"</span>
            )}
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
