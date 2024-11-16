// api.js
const API_KEY = "72njgfa948d9aS7gs5";

export const fetchProducts = async (search = "", page = 0, limit = 10) => {
  try {
    const response = await fetch(
      `/task/products/search?search=${search}&page=${page}&limit=${limit}`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
