import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          SnackSwift 🍔
        </Link>

        {/* Middle Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shops" className="nav-link">Shops</Link>
          {user && <Link to="/orders" className="nav-link">Orders</Link>}
        </div>

        {/* Right Side: Auth Buttons */}
        <div className="navbar-auth">
          {user ? (
            // If Logged In: Show Profile & Logout
            <>
              <Link to="/profile" className="btn-outline">
                Profile 👤
              </Link>
              <button onClick={handleLogout} className="btn-primary">
                Logout
              </button>
            </>
          ) : (
            // If Logged Out: Show Login
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;