//rafce
import React, { useState } from "react";
import "../css/LoginPage.css";
import autoTraceLogo from "../assets/autoTraceLogo.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 Replace with your Spring Boot API
    console.log("Login Data:", formData);

    // Example:
    // fetch("http://localhost:8080/api/auth/login", { ... })
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>AutoTrace</h2>
        <img className="logo" src={autoTraceLogo} alt="logo_image" />

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
