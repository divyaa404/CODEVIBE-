import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider.jsx";
import API_BASE_URL from "../config/api";
import registerImage from "../assets/registerImage.png";

import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateCollege,
  validateYear,
} from "../utils/validation";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/lessons";

  // Username Validation
  const handleUsernameChange = (e) => {
    const value = e.target.value;

    setUsername(value);

    setErrors((prev) => ({
      ...prev,
      username: validateUsername(value),
    }));
  };

  // College Validation
  const handleCollegeChange = (e) => {
    const value = e.target.value;

    setCollege(value);

    setErrors((prev) => ({
      ...prev,
      college: validateCollege(value),
    }));
  };

  // Year Validation
  const handleYearChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,4}$/.test(value)) {
      setYear(value);

      setErrors((prev) => ({
        ...prev,
        year: validateYear(value),
      }));
    }
  };

  // Email Validation
  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value),
    }));
  };

  // Password Validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const collegeError = validateCollege(college);
    const yearError = validateYear(year);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (
      usernameError ||
      collegeError ||
      yearError ||
      emailError ||
      passwordError
    ) {
      setErrors({
        username: usernameError,
        college: collegeError,
        year: yearError,
        email: emailError,
        password: passwordError,
      });

      return;
    }

    setLoading(true);
    setResponseMsg("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        {
          username,
          Email: email,
          password,
          college,
          year,
        }
      );

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
      console.error(error);

      setResponseMsg(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">

        {/* Left Image */}
        <div className="login-image">
          <img
            src={registerImage}
            className="registerImage"
            alt="Student Registration"
          />
        </div>

        {/* Signup Form */}
        <div className="login-card">
          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Sign Up Form"
          >
            <h1>Create Your Account</h1>

            {/* Username */}
            <label>USERNAME:</label>

            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              aria-invalid={!!errors.username}
              aria-describedby="username-error"
              style={{
                border: errors.username
                  ? "1px solid #ff4d6d"
                  : "",
              }}
            />

            {errors.username && (
              <p
                id="username-error"
                style={{
                  color: "#ff4d6d",
                  fontSize: "0.85rem",
                  marginTop: "5px",
                }}
              >
                {errors.username}
              </p>
            )}

            {/* College */}
            <label>COLLEGE:</label>

            <input
              type="text"
              value={college}
              onChange={handleCollegeChange}
              aria-invalid={!!errors.college}
              aria-describedby="college-error"
              style={{
                border: errors.college
                  ? "1px solid #ff4d6d"
                  : "",
              }}
            />

            {errors.college && (
              <p
                id="college-error"
                style={{
                  color: "#ff4d6d",
                  fontSize: "0.85rem",
                  marginTop: "5px",
                }}
              >
                {errors.college}
              </p>
            )}

            {/* Year */}
            <label>YEAR:</label>

            <input
              type="text"
              value={year}
              onChange={handleYearChange}
              maxLength={4}
              aria-invalid={!!errors.year}
              aria-describedby="year-error"
              style={{
                border: errors.year
                  ? "1px solid #ff4d6d"
                  : "",
              }}
            />

            {errors.year && (
              <p
                id="year-error"
                style={{
                  color: "#ff4d6d",
                  fontSize: "0.85rem",
                  marginTop: "5px",
                }}
              >
                {errors.year}
              </p>
            )}

            {/* Email */}
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

            {/* Password */}
            <label>PASSWORD:</label>

            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              style={{
                border: errors.password
                  ? "1px solid #ff4d6d"
                  : "",
              }}
            />

            {errors.password && (
              <p
                id="password-error"
                style={{
                  color: "#ff4d6d",
                  fontSize: "0.85rem",
                  marginTop: "5px",
                }}
              >
                {errors.password}
              </p>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}>
              {loading ? "LOADING..." : "SUBMIT"}
            </button>

            {/* Response */}
            {responseMsg && (
              <p
                style={{
                  color: "#ff4d6d",
                  marginTop: "10px",
                }}
              >
                {responseMsg}
              </p>
            )}

            {/* Login Link */}
            <p className="login-link">
              Already have an account?
              <Link to="/login"> Login</Link>
            </p>

          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;