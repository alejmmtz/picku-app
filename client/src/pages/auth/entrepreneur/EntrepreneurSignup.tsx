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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const randomNumber = Math.floor(1000000000 + Math.random() * 9999999999);

    setPhone(randomNumber.toString());

    try {
      await axios.post(`${API_URL}/picku/api/auth/register`, {
        name,
        phone,
        email,
        password,
        role: "entrepreneur",
      });

      try {
        const { data } = await axios.post<AuthData>(
          `${API_URL}/picku/api/auth/login`,
          {
            email,
            password,
          },
        );

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
    <main className="app-shell overflow-hidden">
      <section className="app-screen flex flex-col justify-center">
        <div className="relative  flex  items-center justify-center -mb-24">
          <img
            className="h-auto w-50"
            src="/resources/sign-up-img-signup.svg"
            alt=""
          />
        </div>

        <header>
          <h2 className="mb-2 text-2xl font-semibold leading-tight">
            Start your own pick!
          </h2>
          <p className="app-subtitle">Join PickU as Entrepreneur</p>
        </header>

        <form className="mt-8 mb-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-light">Username</span>
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)] transition-all duration-500">
              <UserIcon className="h-5 w-5 shrink-0" />
              <input
                className="w-full bg-transparent font-light py-4 outline-none placeholder:text-black/25"
                type="text"
                placeholder="Make it Cool!"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-light">Email</span>
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)] transition-all duration-500">
              <MailIcon className="h-5 w-5 shrink-0" />
              <input
                className="w-full bg-transparent font-light py-4  outline-none placeholder:text-black/25"
                type="email"
                placeholder="Your Email"
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
                className="w-full bg-transparent font-light py-4 outline-none placeholder:text-black/25"
                type={showPassword ? "text" : "password"}
                placeholder="Make it Secret..."
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
                  <EyeIcon className="h-5 w-5 shrink-0" />
                ) : (
                  <EyeOffIcon className="h-5 w-5 shrink-0" />
                )}
              </button>
            </span>
          </label>

          <p
            className={`m-0 text-[13px] ${errorMessage ? "text-[#c43e14]" : ""}`}
          >
            {errorMessage}
          </p>

          <button
            className="app-action cursor-pointer bg-maroon"
            type="submit"
            disabled={isSubmitting}
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 font-light text-center text-[16px]">
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
