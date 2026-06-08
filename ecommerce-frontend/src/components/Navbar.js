import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { token, user, logout, isAdmin } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          👗 FashionHub
        </Link>

        <div className="navbar-links">
          {token ? (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/orders" className="nav-link">
                My Orders
              </Link>
              {isAdmin && (
                <div className="nav-dropdown">
                  <span className="nav-link nav-dropdown-trigger">Admin ▾</span>
                  <div className="nav-dropdown-menu">
                    <Link to="/admin/products" className="dropdown-item">
                      Manage Products
                    </Link>
                    <Link to="/admin/categories" className="dropdown-item">
                      Manage Categories
                    </Link>
                  </div>
                </div>
              )}
              <Link to="/cart" className="nav-link cart-link">
                🛒 Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
              <div className="nav-user">
                <span className="user-greeting">
                  Hi, {user?.name || user?.email?.split("@")[0] || "User"}
                </span>
                <button className="btn btn-outline-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
