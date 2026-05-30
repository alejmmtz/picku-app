import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config/axiosConfig";
import type { AuthData } from "../../../types/authData";
import { setStoredAuth } from "../../../utils/storage";

import MailIcon from "../../../assets/mail.svg?react";
import LockIcon from "../../../assets/lock.svg?react";
import EyeIcon from "../../../assets/eye.svg?react";
import EyeOffIcon from "../../../assets/eye-off.svg?react";

const EntrepreneurLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialSuccess =
    typeof location.state === "object" &&
    location.state !== null &&
    "message" in location.state &&
    typeof location.state.message === "string"
      ? location.state.message
      : "";

  const redirectPath =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : null;

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
      const { data } = await axios.post<AuthData>(
        `${API_URL}/picku/api/auth/login`,
        {
          email,
          password,
        },
      );

      setStoredAuth(data);

      if (redirectPath) {
        navigate(redirectPath, { replace: true });
        return;
      }

      try {
        await axios.get(`${API_URL}/picku/api/entrepreneurs/me`, {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        });

        navigate("/entrepreneur/home", { replace: true });
      } catch (profileError) {
        if (
          axios.isAxiosError(profileError) &&
          profileError.response?.status === 404
        ) {
          navigate("/entrepreneur/onboarding", { replace: true });
          return;
        }

        throw profileError;
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "No se pudo iniciar sesion";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="app-screen max-h-screen flex flex-col justify-center">
        <div className="mb-12 flex min-h-40 items-center justify-center relative z-50">
          <img
            className="block h-auto w-64"
            src="/resources/Img-login-Entrepeneurs.svg"
            alt="Ilustración de inicio de sesión"
          />
        </div>

        <header>
          <h2 className="mb-4 text-2xl font-semibold leading-tight text-black">
            Welcome back!
          </h2>
          <p className="app-subtitle">Log in as Entrepreneur</p>
        </header>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-light">Email</span>
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)] transition-all duration-500">
              <MailIcon className="h-5 w-5 shrink-0" />
              <input
                className="w-full bg-transparent py-4 font-light text-black outline-none placeholder:text-black/50"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-light">Password</span>
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)] transition-all duration-500">
              <LockIcon className="h-5 w-5 shrink-0" />
              <input
                className="w-full bg-transparent py-4 font-light text-black outline-none placeholder:text-black/50"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                className="inline-flex items-center bg-transparent p-0"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5 shrink-0 cursor-pointer" />
                ) : (
                  <EyeOffIcon className="h-5 w-5 shrink-0 cursor-pointer" />
                )}
              </button>
            </span>
          </label>

          <p
            className={`m-0 ${
              errorMessage
                ? "text-maroon"
                : successMessage
                  ? "text-[#2c7b44]"
                  : ""
            }`}
          >
            {errorMessage || successMessage}
          </p>

          <button
            className="app-action cursor-pointer bg-maroon"
            type="submit"
            disabled={isSubmitting}
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-[16px] font-light">
          Don't have an account?{" "}
          <button
            className="cursor-pointer bg-transparent p-0 font-medium text-maroon"
            type="button"
            onClick={() => navigate("/entrepreneur/signup")}
          >
            Sign Up
          </button>
        </p>
      </section>
    </main>
  );
};

export default EntrepreneurLogin;
