import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>SnackSwift 🍔</h2>
      </div>

      <nav className="sidebar-nav">
        {/* Simplified List - No Categories */}
        <Link to="/dashboard" className={isActive("/dashboard")}>
            🛍️ Orders
        </Link>
        
        <Link to="/menu" className={isActive("/menu")}>
            🍔 Menu
        </Link>
        
        <Link to="/orders-history" className={isActive("/orders-history")}>
            🕒 History
        </Link>

        {user?.shop_id && (
            <Link to={`/shops/${user.shop_id}`} target="_blank" className="sidebar-link">
                👀 View Shop
            </Link>
        )}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;