import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user is logged in on page load
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return { user_id: decoded.user_id };
    } catch {
      return null;
    }
  });

  const [loading] = useState(false);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const login = (accessToken, refreshToken, role) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    // We store the role in state to control UI
    setUser({ role }); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};