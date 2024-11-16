import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ProductItem from "./ProductItem";
import { useProducts } from "../ProductContext";

const ProductList = () => {
  const { products, setProducts } = useProducts();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProducts(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="products">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              padding: "8px",
              background: "#f8f8f8",
              minHeight: "100px",
            }}
          >
            {products.map((product, index) => (
              <Draggable
                key={product.id}
                draggableId={String(product.id)}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      marginBottom: "8px",
                      padding: "8px",
                      background: "#fff",
                      border: "1px solid #ddd",
                    }}
                  >
                    <ProductItem
                      product={product}
                      index={index}
                      showRemove={products.length > 1}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ProductList;
