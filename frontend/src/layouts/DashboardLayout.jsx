import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar /> {/* The Side Menu */}
      <div style={{ marginLeft: "260px", width: "100%", padding: "2rem", background: "#f9fafb", minHeight: "100vh" }}>
        <Outlet /> {/* This renders Dashboard, Menu, etc. */}
      </div>
    </div>
  );
};

export default DashboardLayout;