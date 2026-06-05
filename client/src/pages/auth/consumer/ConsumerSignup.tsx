import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config/axiosConfig";

import UserIcon from "../../../assets/user.svg?react";
import PhoneIcon from "../../../assets/phone.svg?react";
import MailIcon from "../../../assets/mail.svg?react";
import LockIcon from "../../../assets/lock.svg?react";
import EyeIcon from "../../../assets/eye.svg?react";
import EyeOffIcon from "../../../assets/eye-off.svg?react";

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
      await axios.post(`${API_URL}/picku/api/auth/register`, {
        name,
        phone,
        email,
        password,
        role: "consumer",
      });

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
    <main className="app-shell">
      <section className="app-screen max-h-screen flex flex-col justify-center">
        <div
          className={`flex min-h-40 right-10 transition-all duration-500 absolute z-50 m-0 ${errorMessage ? "top-7.5" : "top-13.5"} `}
        >
          <img
            className="block h-auto w-35"
            src="/resources/Image-SignUp-Consumer.svg"
          />
        </div>
        <div
          className={`mb-6 flex min-h-40 right-8 transition-all duration-500  absolute z-30 ${errorMessage ? "-top-3" : "top-0"}`}
        >
          <img
            className="block h-auto w-12.5"
            src="/resources/sign-up-colors.svg"
          />
        </div>

        <header>
          <h2 className="mb-2 text-2xl font-semibold leading-tight text-black">
            Ready to pick?
          </h2>
          <p className="app-subtitle">Join PickU as Consumer</p>
        </header>

        <form className="mt-12 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-light">Username</span>
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)] transition-all duration-500">
              <UserIcon className="h-5 w-5 shrink-0" />
              <input
                className="w-full bg-transparent py-4 font-light text-black outline-none placeholder:text-black/50"
                type="text"
                placeholder="Enter username"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-light">Phone</span>
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)] transition-all duration-500">
              <PhoneIcon className="h-5 w-5 shrink-0" />
              <input
                className="w-full bg-transparent py-4 font-light text-black outline-none placeholder:text-black/50"
                type="tel"
                placeholder="Enter number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                required
              />
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-light">Email</span>
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)] transition-all duration-500">
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
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)] transition-all duration-500">
              <LockIcon className="h-5 w-5 shrink-0" />
              <input
                className="w-full bg-transparent py-4 font-light text-black outline-none placeholder:text-black/50"
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
                  <EyeIcon className="h-5 w-5 shrink-0 cursor-pointer" />
                ) : (
                  <EyeOffIcon className="h-5 w-5 shrink-0 cursor-pointer" />
                )}
              </button>
            </span>
          </label>

          <p className={`m-0 ${errorMessage ? "text-orange" : ""}`}>
            {errorMessage}
          </p>

          <button
            className="app-action cursor-pointer bg-orange"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sign up" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-[16px] font-light">
          Already have an account?{" "}
          <button
            className="cursor-pointer bg-transparent p-0 font-medium text-orange"
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
