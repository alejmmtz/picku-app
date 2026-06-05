import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getStoredAuth, removeStoredAuth } from "../../../utils/storage";
import BottomNav from "../../../components/common/BottomNav";

import ShoppingCartIcon from "../../../assets/shopping cart consumer.svg?react";
import LogoConsumer from "../../../assets/logo consumer.png";
import UserOrangeIcon from "../../../assets/user orange.svg?react";
import LogoutIcon from "../../../assets/log-out.svg?react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "consumer" | "entrepreneur";
  created_at: string;
};

const ConsumerProfile = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const storedAuth = useMemo(() => getStoredAuth(), []);
  const fallbackName =
    typeof storedAuth?.user.user_metadata?.name === "string"
      ? storedAuth.user.user_metadata.name
      : "PickU user";
  const fallbackEmail = storedAuth?.user.email ?? "consumer@picku.app";

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!storedAuth) {
        navigate("/consumer/login", { replace: true });
        return;
      }

      try {
        const { data } = await axios.get<UserProfile>("/picku/api/auth/me");
        if (!isMounted) return;
        setProfile(data);
        setFeedbackMessage("");
      } catch (error) {
        if (!isMounted) return;
        const message =
          error instanceof Error
            ? error.message
            : "No pudimos cargar tu perfil completo.";
        setFeedbackMessage(message);
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [axios, navigate, storedAuth]);

  const handleLogout = () => {
    removeStoredAuth();
    navigate("/", { replace: true });
  };

  const displayName = profile?.name ?? fallbackName;
  const displayEmail = profile?.email ?? fallbackEmail;

  return (
    <main className="app-shell">
      <section className="app-screen">
        <header className=" flex items-center justify-between mb-8  h-6">
          <img
            src={LogoConsumer}
            onClick={() => navigate("/consumer/home")}
            alt="PickU"
            className="w-16"
          />
          <button
            type="button"
            onClick={() => navigate("/consumer/cart")}
            className="flex items-center justify-center"
          >
            <ShoppingCartIcon className="w-6 h-6" />
          </button>
        </header>

        <img
          className="absolute right-24 top-9 h-21 object-contain"
          src="/resources/Image-SignUp-Consumer.svg"
          alt=""
        />

        <section className="app-card px-6 py-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex p-3 shrink-0 items-center justify-center rounded-lg bg-orange/10">
              <UserOrangeIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h2 className=" truncate text-[16px] ">{displayName}</h2>
              <p className="truncate text-[15px] font-light  text-black/45">
                {displayEmail}
              </p>
            </div>
          </div>

          <button
            className="app-action flex  w-full items-center justify-center gap-4 bg-orange text-[14px]"
            type="button"
            onClick={() => navigate("/entrepreneur/login")}
          >
            <span className="truncate">Switch to Entrepreneur Mode</span>
            <img
              className="h-6 w-6 brightness-0 invert"
              src="/icons/arrow-right.svg"
              alt=""
            />
          </button>
        </section>

        <button
          className="app-card mt-4 flex w-full items-center p-6 text-left transition-all duration-500 active:scale-95"
          type="button"
          onClick={handleLogout}
        >
          <span className="mr-4 flex p-3 shrink-0 items-center justify-center rounded-lg bg-red-800/5">
            <LogoutIcon className="h-6 w-6" />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-[156x]  ">Log Out</span>
            <span className="block truncate font-light text-[15px] text-black/50">
              Sign out of your account.
            </span>
          </span>
        </button>

        {feedbackMessage ? (
          <p className="mt-4 text-center text-[12px] leading-[1.3] text-orange">
            {feedbackMessage}
          </p>
        ) : null}

        <footer className="absolute bottom-28 left-0 right-0 text-center text-black/20">
          <img
            className="mx-auto mb-2 w-16 opacity-12 grayscale"
            src="/logos/picku-logo.svg"
            alt="PickU"
          />
          <p className="m-0 text-[14px] leading-[1.8] font-light">
            Version 1.0.0
          </p>
          <p className="m-0 text-[14px] font-light leading-[1.8]">
            Supporting student entrepreneurs
          </p>
        </footer>
      </section>

      <BottomNav variant="consumer" />
    </main>
  );
};

export default ConsumerProfile;
