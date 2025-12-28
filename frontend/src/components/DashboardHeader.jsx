import { Link } from "react-router-dom";
import "./DashboardHeader.css";

const DashboardHeader = () => {
  // Get dynamic date: e.g., "October 19, 2021"
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="dash-header">
      {/* Left: Date */}
      <div className="header-left">
        <span className="calendar-icon">📅</span>
        <span className="date-text">{today}</span>
      </div>

      {/* Right: Search & Actions */}
      <div className="header-right">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search orders..." />
        </div>
        
        <button className="icon-btn">
          🔔 <span className="notification-dot"></span>
        </button>

        <Link to="/profile" className="profile-btn">
          <div className="avatar">👤</div>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;