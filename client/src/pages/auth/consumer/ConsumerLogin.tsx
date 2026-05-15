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
          : "No se pudo iniciar sesión";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen justify-center overflow-hidden bg-background font-sofia">
       <section className="w-full max-w-[430px] min-h-screen px-13 pt-31">
        <div className="mt-5 mb-[27px] flex min-h-[160px] items-center justify-center">
          <img
            className="block h-auto w-[210px]"
            src="/resources/Imagen-Login-Consumer.svg"
            alt="Ilustración de inicio de sesión"
          />
        </div>

        <header>
          <h1 className="mb-[16px] !font-sofia text-[25px] font-semibold leading-[0.3] text-black">
            Welcome back!
          </h1>
          <p className="text-[16px] text-black font-light">
            Log in as Consumer
          </p>
        </header>

        <form
          className="mt-10 mb-[10px] flex flex-col gap-[16px]"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2">
            <span className="text-[15px] font-light">Email</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]">
              <MailIcon className="h-[22px] w-[22px] shrink-0" />
              <input
                className="w-full bg-transparent py-[14px] font-light text-black outline-none placeholder:text-[rgba(27,27,27,0.38)]"
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
            <span className="text-[15px] font-light">Password</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]">
              <LockIcon className="h-[22px] w-[22px] shrink-0" />
              <input
                className="w-full bg-transparent py-[14px] font-light text-black outline-none placeholder:text-[rgba(27,27,27,0.38)]"
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
                <EyeIcon className="h-[22px] w-[22px] shrink-0" />
              ) : (
                <EyeOffIcon className="h-[22px] w-[22px] shrink-0" />
              )}
              </button>
            </span>
          </label>

          <p
            className={`m-0 min-h-[18px] text-[14px] ${
              errorMessage
                ? "text-[#c43e14]"
                : successMessage
                  ? "text-[#2c7b44]"
                  : ""
            }`}
          >
            {errorMessage || successMessage}
          </p>

          <button
            className="min-h-[52px] rounded-[12px] bg-orange text-[16px] text-white transition-[transform,opacity] duration-150 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Log In" : "Log In"}
          </button>
        </form>

        <p className="mt-[18px] text-center text-[16px] font-light">
          Don't have an account?{" "}
          <button
            className="bg-transparent p-0 font-medium text-orange"
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
