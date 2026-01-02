import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get the login function from AuthContext to update global state
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Login (email-based)
      const res = await api.post("accounts/login/", {
        email,
        password,
      });

      const { access, refresh } = res.data;

      // 2. Store tokens
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // 3. Fetch profile (NO manual headers)
      const profileRes = await api.get("accounts/profile/");
      const { role, shop } = profileRes.data;

      // 4. Update auth state
      login(access, refresh, role, shop);

      // 5. Redirect
      navigate(role === "SHOP_OWNER" ? "/dashboard" : "/");

    } catch (err) {
      console.error(err.response?.data || err);
      setError("Invalid email or password.");
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Added the redirect link for registration */}
        <div className="login-footer" style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>
            Don't have an account? <Link to="/register" style={{ color: "#007bff", fontWeight: "bold" }}>Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;