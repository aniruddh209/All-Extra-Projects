import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // External CSS

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("⚠️ Please fill in all fields");
      return;
    }

    // Fake login check (replace with API later)
    if (email === "test@example.com" && password === "123456") {
      setError("");
      alert("✅ Login successful!");
      navigate("/"); // Redirect to home
    } else {
      setError("❌ Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Log in to explore more games</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <Link to="/signup" className="login-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;