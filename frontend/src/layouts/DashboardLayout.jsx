import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from '../components/DashboardHeader'

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* 1. Sidebar Fixed Left */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div style={{ 
          marginLeft: "250px", // Matches Sidebar width
          width: "100%", 
          padding: "0 2rem 2rem 2rem" // Padding for the content
      }}>
        {/* A. The Top Header */}
        <DashboardHeader />

        {/* B. The Page Content (Dashboard, Menu, etc.) */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;