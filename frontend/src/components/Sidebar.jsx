import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SnackSwift 🍔</h2>
        <span className="badge">Owner</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
            <p className="nav-title">MAIN</p>
            <Link to="/dashboard" className={isActive("/dashboard")}>
                📊 Dashboard
            </Link>
            <Link to="/menu" className={isActive("/menu")}>
                🍔 Menu Management
            </Link>
            <Link to="/orders-history" className={isActive("/orders-history")}>
                🕒 Order History
            </Link>
        </div>

        <div className="nav-group">
            <p className="nav-title">ACCOUNT</p>
            <Link to="/profile" className={isActive("/profile")}>
                👤 Profile
            </Link>
            {user?.shop_id && (
                <Link to={`/shops/${user.shop_id}`} target="_blank" className="sidebar-link">
                    👀 View My Shop ↗
                </Link>
            )}
        </div>
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