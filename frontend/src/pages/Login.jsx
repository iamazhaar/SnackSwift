import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Import the helper we just created
import "./LogIn.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      // 1. Send Credentials to Backend
      const response = await api.post("accounts/login/", {
        email: email,
        password: password,
      });

      // 2. Save the Tokens
      // SimpleJWT returns 'access' and 'refresh' tokens
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // 3. Determine User Role
      // Since standard JWTs don't always have the role, we fetch the profile 
      // using the token we just saved.
      const profileResponse = await api.get("accounts/profile/");
      const role = profileResponse.data.role;

      // 4. Redirect based on Role
      if (role === "SHOP_OWNER") {
        navigate("/dashboard"); // We will build this later
      } else {
        navigate("/"); // Redirect Students to Home
      }

    } catch (err) {
      console.error("Login failed", err);
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
      </div>
    </div>
  );
};

export default Login;