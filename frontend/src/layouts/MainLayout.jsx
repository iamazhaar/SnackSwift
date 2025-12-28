import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar /> {/* Standard Top Navbar */}
      <Outlet /> {/* This renders the child page (Home, Login, etc.) */}
    </>
  );
};

export default MainLayout;