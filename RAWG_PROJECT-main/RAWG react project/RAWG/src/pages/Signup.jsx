import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup form submitted:", formData);

    // Here you can call your API to register new user
    alert("Account created successfully!");
    navigate("/login");
  };

  return (
    <div
      style={{
        background: "#181a1b",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#23272a",
          padding: "2rem",
          borderRadius: "16px",
          width: "400px",
          color: "#fff",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        }}
      >
        <h2
          style={{
            color: "#ffb347",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: "bold" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                background: "#2c2f33",
                border: "none",
                color: "#fff",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: "bold" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                background: "#2c2f33",
                border: "none",
                color: "#fff",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: "bold" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                background: "#2c2f33",
                border: "none",
                color: "#fff",
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-warning w-100"
            style={{
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "0.6rem",
            }}
          >
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: "1rem", textAlign: "center", color: "#bbb" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#ffb347", textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;