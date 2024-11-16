import React, { useState } from "react";
import { useProducts } from "../ProductContext";
import { DISCOUNT_TYPES } from "../types";
import ProductPicker from "./ProductPicker";

const ProductItem = ({ product, index, showRemove }) => {
  const { products, setProducts } = useProducts();
  const [showVariants, setShowVariants] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleRemove = () => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleDiscountChange = (value, type, variantId = null) => {
    const updatedProducts = [...products];
    const target = variantId
      ? updatedProducts[index].variants.find((v) => v.id === variantId)
      : updatedProducts[index];

    if (target) {
      target.discount = { value, type };
      setProducts(updatedProducts);
    }
  };

  const handleProductSelect = (selectedProducts) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1, ...selectedProducts);
    setProducts(updatedProducts);
    setShowPicker(false);
  };

  return (
    <div className="product-item">
      <div className="product-header">
        <div className="drag-handle">⋮⋮</div>
        <span>{index + 1}.</span>
        <div className="product-name">
          {product.title}
          <button onClick={() => setShowPicker(true)}>✏️</button>
        </div>
        <div className="discount-section">
          <input
            type="number"
            min="0"
            value={product.discount?.value || ""}
            onChange={(e) =>
              handleDiscountChange(
                e.target.value,
                product.discount?.type || DISCOUNT_TYPES.PERCENTAGE
              )
            }
          />
          <select
            value={product.discount?.type || DISCOUNT_TYPES.PERCENTAGE}
            onChange={(e) =>
              handleDiscountChange(
                product.discount?.value || "",
                e.target.value
              )
            }
          >
            {Object.values(DISCOUNT_TYPES).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {showRemove && (
          <button onClick={handleRemove} className="remove-button">
            ×
          </button>
        )}
      </div>

      {product.variants?.length > 1 && (
        <>
          <button
            onClick={() => setShowVariants(!showVariants)}
            className="variant-toggle"
          >
            {showVariants ? "Hide variants" : "Show variants"}
          </button>

          {showVariants && (
            <div className="variants-list">
              {product.variants.map((variant) => (
                <div key={variant.id} className="variant-item">
                  <span>{variant.title}</span>
                  <div className="discount-section">
                    <input
                      type="number"
                      min="0"
                      value={variant.discount?.value || ""}
                      onChange={(e) =>
                        handleDiscountChange(
                          e.target.value,
                          variant.discount?.type || DISCOUNT_TYPES.PERCENTAGE,
                          variant.id
                        )
                      }
                    />
                    <select
                      value={
                        variant.discount?.type || DISCOUNT_TYPES.PERCENTAGE
                      }
                      onChange={(e) =>
                        handleDiscountChange(
                          variant.discount?.value || "",
                          e.target.value,
                          variant.id
                        )
                      }
                    >
                      {Object.values(DISCOUNT_TYPES).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showPicker && (
        <ProductPicker
          onClose={() => setShowPicker(false)}
          onSelect={handleProductSelect}
        />
      )}
    </div>
  );
};

export default ProductItem;
