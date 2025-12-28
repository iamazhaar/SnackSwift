import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import './App.css'

// Temporary placeholder components so redirects don't 404
const StudentHome = () => <div className="container"><h1>Shop List (Home)</h1></div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar sits outside Routes so it's always visible */}
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* The Destinations (Placeholders for now) */}
          <Route path="/" element={<StudentHome />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch-all: Redirect unknown URLs to Home for now */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
