import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../config/axiosConfig";
import { getStoredAuth, removeStoredAuth } from "../../../utils/storage";

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
    navigate("/consumer/login", { replace: true });
  };

  const displayName = profile?.name ?? fallbackName;
  const displayEmail = profile?.email ?? fallbackEmail;

  return (
    <main className="flex min-h-screen justify-center bg-background font-sofia text-black">
      <section className="relative min-h-screen w-full max-w-[430px] overflow-hidden px-[50px] pt-[72px] pb-[120px]">
        <header className="relative mb-[48px] flex items-start justify-between">
          <img className="mt-[2px] w-[64px]" src="/logos/picku-logo.svg" alt="PickU" />
          <img
            className="absolute right-[5px] top-[-8px] h-[78px] w-[108px] object-contain"
            src="/resources/Image-SignUp-Consumer.svg"
            alt=""
          />
        </header>

        <section className="rounded-[10px] border border-[#cfc9c4] bg-[rgba(255,255,255,0.36)] px-[18px] py-[22px]">
          <div className="mb-[26px] flex items-center gap-[14px]">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] bg-[#ffe8dd]">
              <img className="h-[26px] w-[26px]" src="/icons/user.svg" alt="" />
            </div>

            <div className="min-w-0">
              <h1 className="m-0 truncate !font-sofia text-[16px] font-semibold leading-[1.25]">
                {displayName}
              </h1>
              <p className="mt-[4px] truncate text-[15px] leading-[1.25] text-[#aaa4a0]">
                {displayEmail}
              </p>
            </div>
          </div>

          <button
            className="flex min-h-[50px] w-full items-center justify-center gap-[18px] rounded-[10px] bg-orange px-4 text-[15px] font-semibold text-white"
            type="button"
            onClick={() => navigate("/")}
          >
            <span className="truncate">Switch to Entrepreneur Mode</span>
            <img className="h-6 w-6 brightness-0 invert" src="/icons/arrow-right.svg" alt="" />
          </button>
        </section>

        <button
          className="mt-[22px] flex w-full items-center rounded-[10px] border border-[#cfc9c4] bg-[rgba(255,255,255,0.36)] px-[18px] py-[18px] text-left"
          type="button"
          onClick={handleLogout}
        >
          <span className="mr-[14px] flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[8px] bg-[#ffe8e5]">
            <img className="h-[24px] w-[24px]" src="/icons/log-out.svg" alt="" />
          </span>

          <span className="min-w-0">
            <span className="block text-[15px] font-semibold leading-[1.25]">Log Out</span>
            <span className="mt-[5px] block truncate text-[13px] text-[#aaa4a0]">
              Sign out of your account.
            </span>
          </span>
        </button>

        {feedbackMessage ? (
          <p className="mt-4 text-center text-[12px] leading-[1.3] text-[#a77966]">
            {feedbackMessage}
          </p>
        ) : null}

        <footer className="absolute bottom-[126px] left-0 right-0 text-center text-[#d7d7d7]">
          <img
            className="mx-auto mb-[8px] w-[58px] opacity-45 grayscale"
            src="/logos/picku-logo.svg"
            alt="PickU"
          />
          <p className="m-0 text-[13px] leading-[1.8]">Version 1.0.0</p>
          <p className="m-0 text-[13px] leading-[1.8]">Supporting student entrepreneurs</p>
        </footer>

        
      </section>
    </main>
  );
};

export default ConsumerProfile;
