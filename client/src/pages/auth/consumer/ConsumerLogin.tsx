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
      navigate(redirectPath ?? "/consumer/home", { replace: true });
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "We couldn't log you in";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="app-screen max-h-screen flex flex-col justify-center">
        <div className="mb-6 flex min-h-40 items-center justify-center">
          <img
            className="block h-auto w-50"
            src="/resources/Imagen-Login-Consumer.svg"
            alt="Ilustración de inicio de sesión"
          />
        </div>

        <header>
          <h2 className="mb-2 text-2xl font-semibold leading-tight text-black">
            Welcome back!
          </h2>
          <p className="app-subtitle">Log in as Consumer</p>
        </header>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-light">Email</span>
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-orange bg-transparent px-4 transition-all duration-500 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]">
              <MailIcon className="h-5 w-5 shrink-0" />
              <input
                className="w-full bg-transparent py-4 font-light text-black outline-none placeholder:text-black/50"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-light">Password</span>
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-orange bg-transparent px-4 transition-all duration-500 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]">
              <LockIcon className="h-5 w-5 shrink-0" />
              <input
                className="w-full bg-transparent py-4 font-light text-black outline-none placeholder:text-black/50"
                type={showPassword ? "text" : "password"}
                placeholder="Keep it a Secret"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                className="inline-flex items-center bg-transparent p-0"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
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
            className={`m-0  ${
              errorMessage ? "text-orange" : successMessage ? "text-blue" : ""
            }`}
          >
            {errorMessage || successMessage}
          </p>

          <button
            className="app-action cursor-pointer bg-orange"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Log In" : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-[16px] font-light">
          Don't have an account?{" "}
          <button
            className="cursor-pointer bg-transparent p-0 font-medium text-orange"
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
