import { useState, useEffect } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      showMessage("Failed to load categories.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        showMessage("Category updated!", "success");
      } else {
        await createCategory(form);
        showMessage("Category created!", "success");
      }
      setForm({ name: "" });
      setEditingId(null);
      loadCategories();
    } catch {
      showMessage("Failed to save category.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name });
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? Products in it may be affected.")) return;
    try {
      await deleteCategory(id);
      showMessage("Category deleted.", "success");
      loadCategories();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 403) {
        showMessage("Access denied. Make sure you are logged in as ADMIN.", "error");
      } else if (status === 500) {
        showMessage("Cannot delete — remove all products in this category first.", "error");
      } else if (!err.response) {
        showMessage("Cannot connect to server. Is the backend running?", "error");
      } else {
        showMessage(`Delete failed (${status}): ${err.response?.data?.message || err.message}`, "error");
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Manage Categories</h1>

      {message.text && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}

      <div className="admin-form-card" style={{ maxWidth: "500px" }}>
        <h2 className="form-section-title">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              placeholder="e.g. Electronics, Clothing..."
              required
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Add Category"}
            </button>
            {editingId && (
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => { setForm({ name: "" }); setEditingId(null); }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-table-wrap">
        <h2 className="form-section-title">All Categories ({categories.length})</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="empty-state">No categories yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.products?.length || 0}</td>
                  <td className="table-actions">
                    <button
                      className="btn btn-outline-sm"
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger-sm"
                      onClick={() => handleDelete(cat.id)}
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

export default AdminCategories;
