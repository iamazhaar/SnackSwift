import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./MenuManager.css";

const MenuManager = () => {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    is_available: true,
    category_id: "" // Added category_id (see backend note below)
  });
  
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // FIX: Only fetch if we have a user and shop_id
    if (user && user.shop_id) {
      fetchMenu();
    } else if (user && !user.shop_id) {
      // If user is loaded but has no shop_id, stop loading
      setLoading(false); 
    }
  }, [user]);

  const fetchMenu = async () => {
    try {
      // URL MATCH: matches path('<int:id>/menu/', ShopMenuListView...)
      const response = await api.get(`shops/${user.shop_id}/menu/`); 
      setMenuItems(response.data);
    } catch (error) {
      console.error("Failed to fetch menu", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // URL MATCH: matches path('manage/menu/add/', ManageMenuCreateView...)
      // Note: We don't need to send shop_id, the view handles it via self.request.user.shop
      const response = await api.post("shops/manage/menu/add/", formData);
      
      setMenuItems([...menuItems, response.data]);
      setShowForm(false); 
      setFormData({ name: "", description: "", price: "", is_available: true, category_id: "" });
    } catch (error) {
      console.error("Failed to add item", error);
      alert("Error adding item.");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      // URL MATCH: matches path('manage/menu/<int:pk>/', ManageMenuDetailView...)
      await api.delete(`shops/manage/menu/${itemId}/`);
      setMenuItems(menuItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  if (loading) return <div className="p-4">Loading Menu...</div>;

  // If loaded but no shop ID (Safety check)
  if (!user?.shop_id) return <div className="p-4">Error: You are not linked to a shop.</div>;

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h2>Menu Management 🍔</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add New Item"}
        </button>
      </div>

      {showForm && (
        <div className="menu-form-card">
          <h3>Add New Item</h3>
          <form onSubmit={handleSubmit} className="menu-form">
            <div className="form-group">
              <label>Item Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>Price ($)</label>
              <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
            </div>

            {/* If you have categories, add a select input here for category_id */}
            
            <div className="form-group full-width">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} />
                Is Available?
              </label>
            </div>

            <button type="submit" className="btn-submit">Save Item</button>
          </form>
        </div>
      )}

      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-card">
            <div className="menu-card-header">
              <h4>{item.name}</h4>
              <span className="price-tag">${item.price}</span>
            </div>
            <p className="menu-desc">{item.description}</p>
            <div className="menu-card-footer">
               {/* Check for category existence before accessing name */}
              <span className="category-badge">{item.category?.name || "No Category"}</span>
              <button className="btn-delete" onClick={() => handleDelete(item.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManager;