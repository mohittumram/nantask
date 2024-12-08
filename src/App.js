import React from "react";
import { ProductProvider } from "./ProductContext";
import ProductList from "./components/ProductList";
import { useProducts } from "./ProductContext";
// 
const AppContent = () => {
  const { products, setProducts } = useProducts();

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: `temp-${Date.now()}`,
        title: "Select Product",
        variants: [],
        isTemp: true,
      },
    ]);
  };

  return (
    <div className="app">
      <h1>Add Products</h1>
      <ProductList />
      <button className="add-product-button" onClick={handleAddProduct}>
        Add Product
      </button>
    </div>
  );
};

const App = () => {
  return (
    <ProductProvider>
      <AppContent />
    </ProductProvider>
  );
};

export default App;
