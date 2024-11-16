import React, { useState, useEffect, useRef } from "react";
import { fetchProducts } from "../api";

const ProductPicker = ({ onClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const observerRef = useRef();

  const loadProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newProducts = await fetchProducts(search, page);
      setProducts((prev) => [...prev, ...newProducts]);
      setHasMore(newProducts.length > 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      setProducts([]);
      setPage(0);
      setHasMore(true);
    }, 300);
    return () => clearTimeout(debounceSearch);
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, loading]);

  const handleProductSelect = (product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  return (
    <div className="product-picker-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Select Products</h2>
          <button onClick={onClose}>×</button>
        </div>

        <input
          type="text"
          placeholder="Search product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-picker-item">
              <label>
                <input
                  type="checkbox"
                  checked={selectedProducts.some((p) => p.id === product.id)}
                  onChange={() => handleProductSelect(product)}
                />
                <img
                  src={product.image?.src}
                  alt={product.title || "Product"}
                />
                <span>{product.title}</span>
              </label>

              {product.variants.map((variant) => (
                <div key={variant.id} className="variant-picker-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedProducts.some(
                        (p) => p.id === variant.id
                      )}
                      onChange={() =>
                        handleProductSelect({ ...variant, isVariant: true })
                      }
                    />
                    <span>{variant.title}</span>
                    <span>{variant.price}</span>
                  </label>
                </div>
              ))}
            </div>
          ))}
          <div ref={observerRef} className="loading-trigger">
            {loading && <span>Loading...</span>}
          </div>
        </div>

        <div className="modal-footer">
          <span>{selectedProducts.length} products selected</span>
          <div className="modal-actions">
            <button onClick={onClose}>Cancel</button>
            <button
              onClick={() => onSelect(selectedProducts)}
              className="primary"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
