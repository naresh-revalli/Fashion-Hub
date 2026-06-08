import { useState, useEffect } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { getAllCategories } from "../services/categoryService";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  category: { id: "" },
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getAllProducts(), getAllCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      showMessage("Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      setForm((f) => ({ ...f, category: { id: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category.id ? { id: parseInt(form.category.id) } : null,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        showMessage("Product updated successfully!", "success");
      } else {
        await createProduct(payload);
        showMessage("Product created successfully!", "success");
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      loadData();
    } catch {
      showMessage("Failed to save product. Check all fields.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      category: { id: product.category?.id || "" },
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      showMessage("Product deleted.", "success");
      loadData();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 403) {
        showMessage("Access denied. Make sure you are logged in as ADMIN.", "error");
      } else if (status === 500) {
        showMessage("Cannot delete — product may be linked to an order or cart.", "error");
      } else if (!err.response) {
        showMessage("Cannot connect to server. Is the backend running?", "error");
      } else {
        showMessage(`Delete failed (${status}): ${err.response?.data?.message || err.message}`, "error");
      }
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Manage Products</h1>

      {message.text && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="admin-form-card">
        <h2 className="form-section-title">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                name="categoryId"
                value={form.category.id}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product description"
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                className="form-input"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input
                className="form-input"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL *</label>
            <input
              className="form-input"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                className="btn btn-outline"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="admin-table-wrap">
        <h2 className="form-section-title">All Products ({products.length})</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">No products yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="table-img"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50x50?text=N/A";
                      }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price.toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${p.stock > 0 ? "in-stock" : "out-stock"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button
                      className="btn btn-outline-sm"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger-sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
