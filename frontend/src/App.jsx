import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import './App.css'

// temporary placeholder components so redirects don't 404
const StudentHome = () => <h1>Student Home (Shop List)</h1>;
const OwnerDashboard = () => <h1>Owner Dashboard</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. The Login Page */}
        <Route path="/login" element={<Login />} />

        {/* 2. The Destinations (Placeholders for now) */}
        <Route path="/" element={<StudentHome />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />

        {/* 3. Catch-all: Redirect unknown URLs to Login for now */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
