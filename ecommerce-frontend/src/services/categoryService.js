import API from "./api";

export const getAllCategories = () => API.get("/categories").then((r) => r.data);
export const createCategory = (data) => API.post("/categories", data).then((r) => r.data);
export const updateCategory = (id, data) =>
  API.put(`/categories/${id}`, data).then((r) => r.data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`).then((r) => r.data);
