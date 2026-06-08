import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load orders.");
        setLoading(false);
      });
  }, []);

  const statusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED": return "status-delivered";
      case "SHIPPED": return "status-shipped";
      case "CANCELLED": return "status-cancelled";
      default: return "status-pending";
    }
  };

  if (loading) return <div className="loading page-container">Loading orders...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">My Orders</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className={`order-status ${statusColor(order.status)}`}>
                    {order.status || "PENDING"}
                  </span>
                </div>
                <span className="order-total">₹{order.totalPrice?.toFixed(2)}</span>
              </div>

              <div className="order-items">
                {order.items?.map((item) => (
                  <div key={item.id} className="order-item">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="order-item-img"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/60x60?text=No+Img";
                      }}
                    />
                    <div className="order-item-details">
                      <span className="order-item-name">{item.product?.name}</span>
                      <span className="order-item-meta">
                        Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                      </span>
                    </div>
                    <span className="order-item-subtotal">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
