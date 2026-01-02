import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import MenuManager from "./pages/MenuManager";

import './App.css';

// Temporary placeholder
const StudentHome = () => <div className="container" style={{paddingTop: '2rem'}}><h1>Shop List (Home)</h1></div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        
          {/* ------------------------------------------- */}
          {/* LAYOUT 1: PUBLIC / STUDENT (Has Navbar)     */}
          {/* ------------------------------------------- */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<StudentHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Route>


          {/* ------------------------------------------- */}
          {/* LAYOUT 2: SHOP OWNER (Has Sidebar)          */}
          {/* ------------------------------------------- */}
          {/* FIX: Removed 'path="/dashboard"' from the wrapper below */}
          <Route element={<DashboardLayout />}>
             
             {/* Now we define the full paths for each page here */}
             <Route path="/dashboard" element={<Dashboard />} /> 
             <Route path="/menu" element={<MenuManager />} />
             <Route path="/orders-history" element={<div>Order History Coming Soon</div>} />
             
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;