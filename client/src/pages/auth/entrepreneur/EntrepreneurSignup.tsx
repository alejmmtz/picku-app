import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config/axiosConfig";
import type { AuthData } from "../../../types/authData";
import { setStoredAuth } from "../../../utils/storage";

import UserIcon from "../../../assets/user.svg?react";
import MailIcon from "../../../assets/mail.svg?react";
import LockIcon from "../../../assets/lock.svg?react";
import EyeIcon from "../../../assets/eye.svg?react";
import EyeOffIcon from "../../../assets/eye-off.svg?react";

const EntrepreneurSignup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
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
      await axios.post(`${API_URL}/picku/api/auth/register`, {
        name,
        email,
        password,
        role: "entrepreneur",
      });

      try {
        const { data } = await axios.post<AuthData>(`${API_URL}/picku/api/auth/login`, {
          email,
          password,
        });

        setStoredAuth(data);
        navigate("/entrepreneur/onboarding", { replace: true });
      } catch {
        navigate("/entrepreneur/login", {
          replace: true,
          state: {
            message:
              "Cuenta creada correctamente. Inicia sesion para continuar con el onboarding.",
          },
        });
      }
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
    <main className="flex min-h-screen justify-center overflow-hidden bg-background font-sofia text-black">
       <section className="w-full max-w-[430px] min-h-screen px-13 pt-30">
        <div className="relative z-[2] mb-[-104px] flex min-h-[80px] items-center justify-center">
          <img
            className="h-auto w-[200px] mr-7"
            src="/resources/sign-up-img-signup.svg"
            alt=""
          />
        </div>

        <header className="mb-[38px] mt-[-20px]">
          <h1 className="m-0 !font-sofia text-[25px] font-semibold leading-[1.1]">
            Start your own pick
          </h1>
          <p className="mt-[6px] font-light text-[16px] leading-[1.2]">
            Join PickU as Entrepreneur
          </p>
        </header>

        <form className="mt-10 mb-[10px] flex flex-col gap-[16px]" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-[7px]">
            <span className="text-[15px] font-light leading-[1.2]">Username</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]">
             <UserIcon className="h-[22px] w-[22px] shrink-0" />
              <input
                className="w-full bg-transparent font-light py-[14px] outline-none placeholder:text-[#9d9d9d]"
                type="text"
                placeholder="Enter username"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </span>
          </label>

          <label className="flex flex-col gap-[8px]">
            <span className="text-[15px] font-light leading-[1.2]">Email</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]">
              <MailIcon className="h-[22px] w-[22px] shrink-0" />
              <input
                className="w-full bg-transparent font-light py-[14px]  outline-none placeholder:text-[#9d9d9d]"
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
            <span className="text-[15px] font-light leading-[1.2]">Password</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]">
              <LockIcon className="h-[22px] w-[22px] shrink-0" />
              <input
                className="w-full bg-transparent font-light py-[14px] outline-none placeholder:text-[#9d9d9d]"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
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
            className={`m-0 min-h-[18px] text-[13px] ${errorMessage ? "text-[#c43e14]" : ""}`}
          >
            {errorMessage}
          </p>

          <button
            className="min-h-[52px] rounded-[12px] bg-maroon text-[16px] text-white transition-[transform,opacity] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            Sign up
          </button>
        </form>

        <p className="mt-[18px] font-light text-center text-[16px]">
          Already have an account?{" "}
          <button
            className="bg-transparent p-0 font-medium text-maroon"
            type="button"
            onClick={() => navigate("/entrepreneur/login")}
          >
            Log In
          </button>
        </p>
      </section>
    </main>
  );
};

export default EntrepreneurSignup;
