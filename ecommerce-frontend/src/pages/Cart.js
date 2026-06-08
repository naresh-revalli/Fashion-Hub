import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { placeOrder } from "../services/orderService";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useContext(CartContext);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    setMessage("");

    const orderPayload = {
      totalPrice: cartTotal,
      status: "PENDING",
      items: cartItems.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        product: { id: item.productId },
      })),
    };

    try {
      await placeOrder(orderPayload);
      clearCart();
      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setMessage("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <h1 className="page-title">Shopping Cart</h1>
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Shopping Cart</h1>

      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item-img"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80x80?text=No+Img";
                }}
              />
              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">₹{item.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-qty">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                >
                  −
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="cart-item-subtotal">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                className="btn btn-danger-sm"
                onClick={() => removeFromCart(item.productId)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-primary btn-full"
            onClick={handleCheckout}
            disabled={placing}
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
          <button
            className="btn btn-outline btn-full"
            style={{ marginTop: "8px" }}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
