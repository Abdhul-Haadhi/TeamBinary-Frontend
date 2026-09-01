import React, { useState } from "react";
import "../css/LoginPage.css";
import autoTraceLogo from "../assets/autoTraceLogo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

  const [formData, setFormData] = useState({
    organizationCode: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();


  // =========================================================
  // HANDLE INPUT CHANGES
  // =========================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove previous error when user starts typing
    if (error) {
      setError("");
    }
  };


  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");


    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          organizationCode:
            formData.organizationCode.trim(),

          email:
            formData.email.trim(),

          password:
            formData.password,
        }
      );


      console.log(
        "Login response:",
        response.data
      );


      const user = response.data;


      // =================================================
      // CHECK TOKEN
      // =================================================

      if (!user.token) {

        throw new Error(
          "Authentication token was not received."
        );
      }


      // =================================================
      // STORE JWT
      // =================================================

      localStorage.setItem(
        "token",
        user.token
      );


      // =================================================
      // STORE USER INFORMATION
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId:
            user.userId,

          email:
            user.email,

          role:
            user.role,

          organizationId:
            user.organizationId,

          organizationCode:
            user.organizationCode,

          organizationName:
            user.organizationName,
        })
      );


      // =================================================
      // ROLE BASED REDIRECTION
      // =================================================

      if (user.role === "SYSTEM_ADMIN") {
        navigate("/organization-management", { replace: true })
      }

      else if (user.role === "ADMIN" || user.role === "INVESTIGATOR") {

        navigate("/admin-dashboard", { replace: true, });

      }

      else {

        setError("Your account has an invalid role.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      // =================================================
      // BACKEND ERROR MESSAGE
      // =================================================

      let message =
        "Unable to login. Please check your credentials.";


      if (
        error.response &&
        error.response.data
      ) {

        if (
          typeof error.response.data ===
          "string"
        ) {

          message =
            error.response.data;

        } else if (
          error.response.data.message
        ) {

          message =
            error.response.data.message;
        }
      }


      setError(
        message
      );


      // Do not leave an old token behind
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="login-container">

      <div className="login-card">


        {/* =================================================
                    LOGO / HEADER
                ================================================= */}

        <div className="login-header">

          <h2>
            AutoTrace
          </h2>

          <img
            className="logo"
            src={autoTraceLogo}
            alt="AutoTrace Logo"
          />

          <p className="login-subtitle">
            Law Enforcement Vehicle
            Investigation System
          </p>

        </div>


        {/* =================================================
                    LOGIN FORM
                ================================================= */}

        <form
          onSubmit={handleSubmit}
        >


          {/* ================================
                        ORGANIZATION
                    ================================= */}

          <div className="input-group">

            <label htmlFor="organizationCode">
              Organization Code
            </label>

            <input
              id="organizationCode"
              type="text"
              name="organizationCode"
              placeholder="e.g. DEMO-LAW-001"
              value={
                formData.organizationCode
              }
              onChange={
                handleChange
              }
              autoComplete="organization"
              required
              disabled={loading}
            />

          </div>


          {/* ================================
                        EMAIL
                    ================================= */}

          <div className="input-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              autoComplete="email"
              required
              disabled={loading}
            />

          </div>


          {/* ================================
                        PASSWORD
                    ================================= */}

          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              autoComplete="current-password"
              required
              disabled={loading}
            />

          </div>


          {/* ================================
                        ERROR
                    ================================= */}

          {error && (

            <div className="login-error">
              {error}
            </div>

          )}


          {/* ================================
                        LOGIN BUTTON
                    ================================= */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >

            {loading ? (

              <span className="login-loading">

                <span className="spinner"></span>

                Logging in...

              </span>

            ) : (

              "Login"

            )}

          </button>


        </form>


        {/* =================================================
                    SECURITY INFORMATION
                ================================================= */}

        <div className="login-security">

          <span className="security-icon">
            🔐
          </span>

          <span>
            Authorized law-enforcement personnel only
          </span>

        </div>


      </div>

    </div>
  );
};

export default LoginPage;