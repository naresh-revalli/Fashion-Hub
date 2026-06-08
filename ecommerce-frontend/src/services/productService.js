import API from "./api";

export const getAllProducts = () => API.get("/products").then((r) => r.data);
export const getProductById = (id) => API.get(`/products/${id}`).then((r) => r.data);
export const getProductsByCategory = (categoryId) =>
  API.get(`/products/category/${categoryId}`).then((r) => r.data);
export const createProduct = (data) => API.post("/products", data).then((r) => r.data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data).then((r) => r.data);
export const deleteProduct = (id) => API.delete(`/products/${id}`).then((r) => r.data);
