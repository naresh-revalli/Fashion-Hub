import { useState, useEffect } from "react";
import { getAllProducts, getProductsByCategory } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllProducts(), getAllCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products. Make sure the backend is running.");
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = async (categoryId) => {
    setLoading(true);
    try {
      if (categoryId === null) {
        const data = await getAllProducts();
        setProducts(data);
        setSelectedCategory(null);
      } else {
        const data = await getProductsByCategory(categoryId);
        setProducts(data);
        setSelectedCategory(categoryId);
      }
    } catch {
      setError("Failed to load products for this category.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="home-header">
        <h1 className="page-title">Our Products</h1>
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="home-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="category-list">
            <li
              className={`category-item ${selectedCategory === null ? "active" : ""}`}
              onClick={() => handleCategoryClick(null)}
            >
              All Products
            </li>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`category-item ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Products */}
        <main className="products-area">
          {error && <div className="alert alert-error">{error}</div>}
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No products found.</div>
          ) : (
            <div className="products-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
