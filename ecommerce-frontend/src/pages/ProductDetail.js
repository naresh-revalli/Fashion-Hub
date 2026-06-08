import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Product not found.");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="loading page-container">Loading...</div>;
  if (error) return <div className="page-container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page-container">
      <button className="btn btn-outline" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-detail-card">
        <div className="product-detail-img-wrap">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-detail-img"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/500x400?text=No+Image";
            }}
          />
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-desc">{product.description}</p>

          <div className="product-detail-meta">
            <span className="product-detail-price">₹{product.price.toFixed(2)}</span>
            <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {added && (
            <div className="alert alert-success">Added to cart!</div>
          )}

          <button
            className="btn btn-primary btn-lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>

          <button
            className="btn btn-outline btn-lg"
            onClick={() => navigate("/cart")}
            style={{ marginLeft: "12px" }}
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
