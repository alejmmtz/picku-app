import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./ConsumerAuth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1703";

const ConsumerSignup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Registrar usuario
      await axios.post(`${API_URL}/picku/api/auth/register`, {
        name,
        phone,
        email,
        password,
        role: "consumer",
      });

      // Después de registrarse, enviarlo al login
      navigate("/consumer/login", {
        state: {
          message: "Cuenta creada correctamente. Ahora inicia sesión.",
        },
      });

    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "No se pudo crear la cuenta";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-hero auth-hero--signup">
          <img
            src="/resources/Image-SignUp-Consumer.svg"
            alt="Ilustración de registro"
          />
        </div>

        <header>
          <h1 className="auth-title">Ready to pick?</h1>
          <p className="auth-subtitle">Join PickU as Consumer</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-label">Username</span>
            <span className="auth-input-wrap">
              <img className="auth-icon" src="/icons/user.svg" alt="" />
              <input
                className="auth-input"
                type="text"
                placeholder="Enter username"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </span>
          </label>

          <label className="auth-field">
            <span className="auth-label">Phone</span>
            <span className="auth-input-wrap">
              <img className="auth-icon" src="/icons/phone.svg" alt="" />
              <input
                className="auth-input"
                type="tel"
                placeholder="Enter number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                required
              />
            </span>
          </label>

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
                autoComplete="new-password"
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
              errorMessage ? "auth-feedback--error" : ""
            }`}
          >
            {errorMessage}
          </p>

          <button
            className="auth-submit"
            type="submit"
            disabled={isSubmitting}
            style={{margin: "28px 0 0"}}
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button
            type="button" 
            onClick={() => navigate("/consumer/login")}
          >
            Log In
          </button>
        </p>
      </section>
    </main>
  );
};

export default ConsumerSignup;