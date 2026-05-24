import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider.jsx";
import API_BASE_URL from "../config/api";
import loginImage from "../assets/loginImage.png";
import PasswordField from "./PasswordField";

import {
  validateEmail,
  validatePassword,
} from "../utils/validation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/lessons";

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });

      return;
    }

    setLoading(true);
    setResponseMsg("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        Email: email,
        password,
      });

      setResponseMsg(response.data.message);

      if (response.data.success) {
        localStorage.setItem(
          "userEmail",
          response.data.user.email ||
            response.data.user.Email ||
            ""
        );

        login(response.data.user, response.data.token);

        navigate(from, { replace: true });
      }
    } catch (error) {
      setResponseMsg(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">

        <div className="login-image">
          <img src={loginImage} alt="Login" />
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <h1>Hello, Welcome!</h1>

            <label>EMAIL:</label>

            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              style={{
                border: errors.email
                  ? "1px solid #ff4d6d"
                  : "",
              }}
            />

            {errors.email && (
              <p
                id="email-error"
                style={{
                  color: "#ff4d6d",
                  fontSize: "0.85rem",
                  marginTop: "5px",
                }}
              >
                {errors.email}
              </p>
            )}

            <PasswordField
              id="login-password"
              label="PASSWORD:"
              value={password}
              onChange={handlePasswordChange}
            />

            {errors.password && (
              <p
                style={{
                  color: "#ff4d6d",
                  fontSize: "0.85rem",
                  marginTop: "5px",
                }}
              >
                {errors.password}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "SUBMITTING..." : "SUBMIT"}
            </button>

            {responseMsg && (
              <p style={{ color: "white" }}>
                {responseMsg}
              </p>
            )}

            <p>
              Don't have an account?
              <Link to="/signup"> Signup</Link>
            </p>

            <p>
              Forgot Password?
              <Link to="/ForgetPassword">
                {" "}
                Click Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;