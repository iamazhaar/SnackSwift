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

// CSS
import './App.css'

// Temporary placeholder components so redirects don't 404
const StudentHome = () => <div className="container" style={{paddingTop: '2rem'}}><h1>Shop List (Home)</h1></div>;
const MenuManager = () => <h1>Menu Management Page</h1>;

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
            
            {/* Note: Profile could technically go in either layout depending on role. 
                For simplicity, let's keep basic Profile here for now, 
                or duplicate the route in DashboardLayout if you want a different look. */}
            <Route path="/profile" element={<Profile />} />
          </Route>


          {/* ------------------------------------------- */}
          {/* LAYOUT 2: SHOP OWNER (Has Sidebar)          */}
          {/* ------------------------------------------- */}
          <Route path="/dashboard" element={<DashboardLayout />}>
             {/* When URL is /dashboard, it renders DashboardLayout -> Outlet -> Dashboard */}
             <Route index element={<Dashboard />} /> 
             
             {/* Future Owner Pages */}
             <Route path="menu" element={<MenuManager />} />
          </Route>


          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
