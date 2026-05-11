import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config/axiosConfig";
import type { AuthData } from "../../../types/authData";
import { setStoredAuth } from "../../../utils/storage";

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
      navigate("/entrepreneur/home");
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
      <section className="flex min-h-screen w-full max-w-[430px] flex-col justify-center px-[50px] py-8">
        <div className="mb-[44px] flex justify-center">
          <img
            className="h-auto w-[260px]"
            src="/resources/Img-login-Entrepeneurs.svg"
            alt=""
          />
        </div>

        <header className="mb-[38px] mt-[-20px]">
          <h1 className="m-0 !font-sofia text-[24px] font-bold leading-[1.1]">
            Welcome back!
          </h1>
          <p className="mt-[7px] text-[15px] leading-[1.2]">
            Log in as Entrepeneurs
          </p>
        </header>

        <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-[8px]">
            <span className="text-[14px] leading-[1.2]">Email</span>
            <span className="flex min-h-[50px] items-center gap-[12px] rounded-[10px] border border-maroon px-[18px]">
              <img
                className="h-[22px] w-[22px] opacity-35"
                src="/icons/mail.svg"
                alt=""
              />
              <input
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9d9d9d]"
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
            <span className="text-[14px] leading-[1.2]">Password</span>
            <span className="flex min-h-[50px] items-center gap-[12px] rounded-[10px] border border-maroon px-[18px]">
              <img
                className="h-[22px] w-[22px] opacity-35"
                src="/icons/lock.svg"
                alt=""
              />
              <input
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9d9d9d]"
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
                <img
                  className="h-[24px] w-[24px] opacity-35"
                  src={showPassword ? "/icons/eye.svg" : "/icons/eye-off.svg"}
                  alt=""
                />
              </button>
            </span>
          </label>

          <p
            className={`m-0 min-h-[18px] text-[13px] ${
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
            className="mt-[15px] min-h-[52px] rounded-[8px] bg-maroon text-[15px] font-semibold text-white transition-[transform,opacity] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            Log In
          </button>
        </form>

        <p className="mt-[24px] text-center text-[15px]">
          Don&#39;t have an account?{" "}
          <button
            className="bg-transparent p-0 font-semibold text-maroon"
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
