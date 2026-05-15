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
    <main className="flex min-h-screen justify-center overflow-hidden bg-background font-sofia text-black">
      <section className="w-full max-w-[430px] min-h-screen px-13 pt-31">
        <div className="mb-[70px] flex justify-center">
          <img
            className="h-auto w-[280px]"
            src="/resources/Img-login-Entrepeneurs.svg"
            alt=""
          />
        </div>

        <header className="mb-[38px] mt-[-20px]">
          <h1 className="m-0 !font-sofia text-[25px] font-semibold leading-[1.1]">
            Welcome back!
          </h1>
          <p className="mt-[7px] text-[16px] font-light leading-[1.2]">
            Log in as Entrepeneurs
          </p>
        </header>

        <form className="flex flex-col gap-[16px] mt-10 mb-[10px] " onSubmit={handleSubmit}>
          <label className="flex flex-col gap-[5px]">
            <span className="text-[15px] font-light">Email</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]">
              <MailIcon className="h-[22px] w-[22px] shrink-0" />
              <input
                className="w-full bg-transparent py-[14px] font-light  text-black outline-none placeholder:text-[rgba(27,27,27,0.38)]"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label className="flex flex-col gap-[8px]">
            <span className="text-[14px] leading-[1.2] font-light">Password</span>
             <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]">
              <LockIcon className="h-[22px] w-[22px] shrink-0" />
              <input
                className="w-full bg-transparent font-light py-[14px] outline-none placeholder:text-[#9d9d9d]"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                className="bg-transparent p-0"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                }
              >
                {showPassword ? (
            <EyeIcon className="h-[24px] w-[24px] shrink-0" />
          ) : (
            <EyeOffIcon className="h-[24px] w-[24px] shrink-0" />
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
            className="min-h-[52px] rounded-[12px] bg-maroon text-[16px] text-white transition-[transform,opacity] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            Log In
          </button>
        </form>

        <p className="mt-[18px] text-center font-light text-[16px]">
          Don't have an account?{" "}
          <button
            className="bg-transparent p-0 font-medium text-maroon"
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
