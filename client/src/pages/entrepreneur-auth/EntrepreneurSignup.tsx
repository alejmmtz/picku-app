import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1703";

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

    try {
      await axios.post(`${API_URL}/picku/api/auth/register`, {
        name,
        email,
        phone,
        password,
        role: "entrepreneur",
      });

      navigate("/entrepreneur/login", {
        state: {
          message: "Cuenta creada correctamente. Ahora inicia sesion.",
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
    <main className="flex min-h-screen justify-center overflow-hidden bg-background font-sofia text-black">
      <section className="flex h-screen w-full max-w-[430px] flex-col justify-center overflow-hidden px-6 py-4">
        <div className="relative z-[2] mt-[30px] mb-[-104px] flex min-h-[80px] items-center justify-center">
          <img
            className="h-auto w-[205px]"
            src="/resources/sign-up-img-signup.svg"
            alt=""
          />
        </div>

        <header className="mb-[38px] mt-[-20px]">
          <h1 className="m-0 !font-sofia text-[24px] font-bold leading-[1.1]">
            Start your own pick
          </h1>
          <p className="mt-[7px] text-[15px] leading-[1.2]">
            Join PickU as Entrepreneur
          </p>
        </header>

        <form className="flex flex-col gap-[17px]" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-[8px]">
            <span className="text-[14px] leading-[1.2]">Username</span>
            <span className="flex min-h-[50px] items-center gap-[12px] rounded-[10px] border border-maroon px-[18px]">
              <img className="h-[22px] w-[22px] opacity-35" src="/icons/user.svg" alt="" />
              <input
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9d9d9d]"
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
            <span className="text-[14px] leading-[1.2]">Email</span>
            <span className="flex min-h-[50px] items-center gap-[12px] rounded-[10px] border border-maroon px-[18px]">
              <img className="h-[22px] w-[22px] opacity-35" src="/icons/mail.svg" alt="" />
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
            <span className="text-[14px] leading-[1.2]">Phone</span>
            <span className="flex min-h-[50px] items-center gap-[12px] rounded-[10px] border border-maroon px-[18px]">
              <img className="h-[22px] w-[22px] opacity-35" src="/icons/phone.svg" alt="" />
              <input
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9d9d9d]"
                type="tel"
                placeholder="Enter number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                required
              />
            </span>
          </label>

          <label className="flex flex-col gap-[8px]">
            <span className="text-[14px] leading-[1.2]">Password</span>
            <span className="flex min-h-[50px] items-center gap-[12px] rounded-[10px] border border-maroon px-[18px]">
              <img className="h-[22px] w-[22px] opacity-35" src="/icons/lock.svg" alt="" />
              <input
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9d9d9d]"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                className="bg-transparent p-0"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
              >
                <img
                  className="h-[24px] w-[24px] opacity-35"
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
            className="mt-[10px] min-h-[52px] rounded-[8px] bg-maroon text-[15px] font-semibold text-white transition-[transform,opacity] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            Sign up
          </button>
        </form>

        <p className="mt-[24px] mb-[14px] text-center text-[15px]">
          Already have an account?{" "}
          <button
            className="bg-transparent p-0 font-semibold text-maroon"
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
