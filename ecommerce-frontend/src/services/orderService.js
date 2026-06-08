import API from "./api";

export const placeOrder = (orderData) => API.post("/orders", orderData).then((r) => r.data);
export const getOrders = () => API.get("/orders").then((r) => r.data);
