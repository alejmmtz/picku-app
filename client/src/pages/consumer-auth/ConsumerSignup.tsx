import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <main className="flex min-h-screen justify-center overflow-hidden bg-background font-sofia">
      <section className="flex min-h-screen w-full max-w-[430px] flex-col justify-center px-6 pt-5 pb-7">
        <div className="relative z-[2] mt-[38px] mb-[-104px] flex min-h-[80px] items-center justify-end">
          <img
            className="h-auto w-[140px]"
            src="/resources/Image-SignUp-Consumer.svg"
            alt="Ilustración de registro"
          />
        </div>

        <header>
          <h1 className="mb-[18px] !font-sofia text-[24px] font-semibold leading-[0.3] text-black">
            Ready to pick?
          </h1>
          <p className="mt-2 text-[15px] text-[rgba(27,27,27,0.82)]">
            Join PickU as Consumer
          </p>
        </header>

        <form className="mt-6 mb-[10px] flex flex-col gap-[14px]" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-[15px]">Username</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]">
              <img
                className="h-[22px] w-[22px] shrink-0 opacity-35"
                src="/icons/user.svg"
                alt=""
              />
              <input
                className="w-full bg-transparent py-[14px] text-black outline-none placeholder:text-[rgba(27,27,27,0.38)]"
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
            <span className="text-[15px]">Phone</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]">
              <img
                className="h-[22px] w-[22px] shrink-0 opacity-35"
                src="/icons/phone.svg"
                alt=""
              />
              <input
                className="w-full bg-transparent py-[14px] text-black outline-none placeholder:text-[rgba(27,27,27,0.38)]"
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
            <span className="text-[15px]">Email</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]">
              <img
                className="h-[22px] w-[22px] shrink-0 opacity-35"
                src="/icons/mail.svg"
                alt=""
              />
              <input
                className="w-full bg-transparent py-[14px] text-black outline-none placeholder:text-[rgba(27,27,27,0.38)]"
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
            <span className="text-[15px]">Password</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-orange bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]">
              <img
                className="h-[22px] w-[22px] shrink-0 opacity-35"
                src="/icons/lock.svg"
                alt=""
              />
              <input
                className="w-full bg-transparent py-[14px] text-black outline-none placeholder:text-[rgba(27,27,27,0.38)]"
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
                <img
                  className="h-[22px] w-[22px] shrink-0 opacity-35"
                  src={showPassword ? "/icons/eye.svg" : "/icons/eye-off.svg"}
                  alt=""
                />
              </button>
            </span>
          </label>

          <p className={`m-0 min-h-[18px] text-[13px] ${errorMessage ? "text-[#c43e14]" : ""}`}>
            {errorMessage}
          </p>

          <button
            className="mt-7 min-h-[52px] rounded-[12px] bg-orange text-[16px] text-white transition-[transform,opacity] duration-150 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sign up" : "Sign up"}
          </button>
        </form>

        <p className="mt-[18px] text-center text-[16px]">
          Already have an account?{" "}
          <button
            className="bg-transparent p-0 font-semibold text-orange"
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
