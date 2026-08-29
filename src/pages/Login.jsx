import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("investigator");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const enteredUsername = username.trim();

    // ==========================================
    // DEMO LOGIN CREDENTIALS
    // ==========================================

    const users = {
      investigator: {
        username: "INV001",
        password: "investigator123",
      },

      admin: {
        username: "ADMIN001",
        password: "admin123",
      },
    };

    const selectedUser = users[role];

    if (
      enteredUsername === selectedUser.username &&
      password === selectedUser.password
    ) {
      onLogin(role);
      return;
    }

    setError(
      `Invalid ${role === "admin" ? "Administrator" : "Investigator"} ID or password.`
    );
  };

  return (
    <div className="login-page">

      {/* ==========================================
          BACKGROUND GRID
      ========================================== */}

      <div className="login-grid"></div>

      {/* ==========================================
          MAIN LOGIN CONTAINER
      ========================================== */}

      <div className="login-container">

        {/* ========================================
            LEFT BRANDING SECTION
        ======================================== */}

        <section className="login-brand">

          <div className="brand-badge">
            <span className="badge-icon">◈</span>
            AI POWERED INVESTIGATION PLATFORM
          </div>

          <h1 className="brand-title">
            AUTO <span>TRACE</span>
          </h1>

          <h2 className="brand-subtitle">
            Vehicle Investigation System
          </h2>

          <p className="brand-description">
            Search, identify and track suspected vehicles
            across multiple CCTV cameras using Artificial
            Intelligence, License Plate Recognition and
            Vehicle Re-Identification.
          </p>

          {/* Feature cards */}

          <div className="login-features">

            <div className="feature-item">
              <div className="feature-icon">▣</div>

              <div>
                <strong>Multi Camera</strong>
                <span>CCTV Tracking</span>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">▱</div>

              <div>
                <strong>AI Detection</strong>
                <span>Vehicle Recognition</span>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">⌾</div>

              <div>
                <strong>Smart Search</strong>
                <span>Image &amp; Text</span>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================
            RIGHT LOGIN SECTION
        ======================================== */}

        <section className="login-card">

          {/* Logo */}

          <div className="login-logo-wrapper">
            <img
              src="/team-binary-logo.png"
              alt="Auto Trace"
              className="login-logo"
            />
          </div>

          <div className="system-status">
            <span></span>
            AI SYSTEM READY
          </div>

          <div className="login-heading">
            <h2>Welcome Back</h2>

            <p>
              Sign in to access the AUTO TRACE investigation
              platform.
            </p>
          </div>

          {/* ========================================
              ROLE SELECTOR
          ======================================== */}

          <div className="role-selector">

            <button
              type="button"
              className={
                role === "investigator"
                  ? "role-button active"
                  : "role-button"
              }
              onClick={() => {
                setRole("investigator");
                setError("");
              }}
            >
              <span className="role-icon">◉</span>

              <span>
                <strong>Investigator</strong>
                <small>Investigation Access</small>
              </span>
            </button>

            <button
              type="button"
              className={
                role === "admin"
                  ? "role-button active"
                  : "role-button"
              }
              onClick={() => {
                setRole("admin");
                setError("");
              }}
            >
              <span className="role-icon">◆</span>

              <span>
                <strong>Administrator</strong>
                <small>System Management</small>
              </span>
            </button>

          </div>

          {/* ========================================
              LOGIN FORM
          ======================================== */}

          <form onSubmit={handleSubmit} className="login-form">

            {/* Username */}

            <div className="input-group">

              <label htmlFor="username">
                {role === "admin"
                  ? "Administrator ID"
                  : "Investigator ID"}
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ◉
                </span>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder={
                    role === "admin"
                      ? "Enter Administrator ID"
                      : "Enter Investigator ID"
                  }
                  autoComplete="username"
                />

              </div>

            </div>

            {/* Password */}

            <div className="input-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ◇
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Show password"
                >
                  {showPassword ? "◉" : "○"}
                </button>

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="login-error">
                <span>!</span>
                {error}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              className="login-button"
            >
              <span>ACCESS SYSTEM</span>
              <span className="login-arrow">→</span>
            </button>

          </form>

          {/* Security information */}

          <div className="security-note">

            <span className="security-icon">
              ◈
            </span>

            <div>
              <strong>SECURE ACCESS</strong>
              <p>
                Authorized personnel only
              </p>
            </div>

          </div>

          <div className="login-footer">
            <span>AUTO TRACE</span>
            <span>•</span>
            <span>AI INVESTIGATION PLATFORM</span>
          </div>

        </section>

      </div>

    </div>
  );
}

export default Login;