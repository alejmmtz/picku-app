import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "./ConsumerAuth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1703";

const ConsumerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialSuccess =
    typeof location.state === "object" &&
    location.state !== null &&
    "message" in location.state &&
    typeof location.state.message === "string"
      ? location.state.message
      : "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(initialSuccess);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.post(`${API_URL}/picku/api/auth/login`, {
        email,
        password,
      });

      // AQUÍ después conecto con el Home 
      // cambia "/homepage" por la ruta real
      navigate("/homepage");

    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "No se pudo iniciar sesión";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-hero">
          <img
            src="/resources/Imagen-Login-Consumer.svg"
            alt="Ilustración de inicio de sesión"
          />
        </div>

        <header>
          <h1 className="auth-title">Welcome back!</h1>
          <p className="auth-subtitle">Log in as Consumer</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-label">Email</span>
            <span className="auth-input-wrap">
              <img className="auth-icon" src="/icons/mail.svg" alt="" />
              <input
                className="auth-input"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label className="auth-field">
            <span className="auth-label">Password</span>
            <span className="auth-input-wrap">
              <img className="auth-icon" src="/icons/lock.svg" alt="" />
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                className="auth-toggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                <img
                  className="auth-icon"
                  src={
                    showPassword
                      ? "/icons/eye.svg"
                      : "/icons/eye-off.svg"
                  }
                  alt=""
                />
              </button>
            </span>
          </label>

          <p
            className={`auth-feedback ${
              errorMessage
                ? "auth-feedback--error"
                : successMessage
                ? "auth-feedback--success"
                : ""
            }`}
          >
            {errorMessage || successMessage}
          </p>

          <button
            className="auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-switch">
          Don´t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/consumer/signup")}
          >
            Sign Up
          </button>
        </p>
      </section>
    </main>
  );
};

export default ConsumerLogin;