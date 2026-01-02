import { useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user data exists in localStorage on page load
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading] = useState(false);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    setUser(null);
  };

  // REVISED: Accept role and shopId
  const login = (accessToken, refreshToken, role, shopId) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    
    const userData = { role, shop_id: shopId };
    
    // Store in localStorage so it persists on Page Refresh
    localStorage.setItem("user_data", JSON.stringify(userData));
    
    setUser(userData); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};