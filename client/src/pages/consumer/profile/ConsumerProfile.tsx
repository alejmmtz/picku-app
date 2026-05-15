import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getStoredAuth, removeStoredAuth } from "../../../utils/storage";
import BottomNav from "../../../components/common/BottomNav";

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
    <main className="flex min-h-screen justify-center bg-background font-sofia text-black">
     <section className="w-full max-w-[430px] min-h-screen px-13 pt-16 pb-[220px]">
        <header className="relative mb-[45px] flex items-start justify-between mt-1.5">
          <img src={LogoConsumer} alt="PickU" className="w-[72px]" />
          <img
            className="absolute right-[5px] top-[-8px] h-[78px] w-[108px] object-contain"
            src="/resources/Image-SignUp-Consumer.svg"
            alt=""
          />
        </header>

        {/* card profile */}
        <section className="rounded-[10px] border border-[#DCD6D3] px-[18px] py-[22px]">
          <div className="mb-[26px] flex items-center gap-[14px]">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[50px] bg-orange/10">
              <UserOrangeIcon className="h-[26px] w-[26px]" />
            </div>

            <div className="min-w-0">
              <h1 className="m-0 truncate !font-sofia font-regular text-[16px] leading-[1.25]">
                {displayName}
              </h1>
              <p className="mt-[3px] truncate text-[15px] font-light leading-[1.25] text-[#A7A7A7]">
                {displayEmail}
              </p>
            </div>
          </div>

          <button
            className="flex min-h-[50px] w-full items-center justify-center gap-[18px] rounded-[10px] bg-orange px-4 text-[15px] font-medium text-white"
            type="button"
            onClick={() => navigate("/entrepreneur/login")}
          >
            <span className="truncate">Switch to Entrepreneur Mode</span>
            <img className="h-6 w-6 brightness-0 invert" src="/icons/arrow-right.svg" alt="" />
          </button>
        </section>

      {/* log out */}
        <button
          className="mt-[22px] flex w-full items-center rounded-[10px] border border-[#DCD6D3] px-[18px] py-[18px] text-left"
          type="button"
          onClick={handleLogout}
        >
          <span className="mr-[14px] flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[8px] bg-[#FF4A4A]/11">
            <LogoutIcon className="h-[24px] w-[24px]" />
          </span>

          <span className="min-w-0">
            <span className="block text-[15px] font-medium leading-[1.25]">Log Out</span>
            <span className="mt-[4px] block truncate font-light text-[15px] text-[#A7A7A7]">
              Sign out of your account.
            </span>
          </span>
        </button>

        {feedbackMessage ? (
          <p className="mt-4 text-center text-[12px] leading-[1.3] text-[#a77966]">
            {feedbackMessage}
          </p>
        ) : null}

        <footer className="absolute bottom-[126px] left-0 right-0 text-center text-[#D9D9D9]">
          <img
            className="mx-auto mb-[8px] w-[58px] opacity-12 grayscale"
            src="/logos/picku-logo.svg"
            alt="PickU"
          />
          <p className="m-0 text-[14px] leading-[1.8] font-light">Version 1.0.0</p>
          <p className="m-0 text-[14px] font-light leading-[1.8]">Supporting student entrepreneurs</p>
        </footer>

        
      </section>

      <BottomNav variant="consumer" />
    </main>
  );
};

export default ConsumerProfile;
