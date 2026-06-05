import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getStoredAuth, removeStoredAuth } from "../../../utils/storage";
import BottomNav from "../../../components/common/BottomNav";

import LogoEntrepreneur from "../../../assets/logo entrepeneur color.svg";
import UserBlueIcon from "../../../assets/user blue.svg?react";
import Edit from "../../../assets/edit.svg?react";
import LogoutIcon from "../../../assets/log-out.svg?react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

type EntrepreneurProfileData = {
  id: string;
  name: string;
};

const EntrepreneurProfile = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const auth = useMemo(() => getStoredAuth(), []);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!auth) {
      navigate("/entrepreneur/login", { replace: true });
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      const [userResult] = await Promise.allSettled([
        axios.get<UserProfile>("/picku/api/auth/me"),
        axios.get<EntrepreneurProfileData>("/picku/api/entrepreneurs/me"),
      ]);

      if (!isMounted) return;

      if (userResult.status === "fulfilled") {
        setUserProfile(userResult.value.data);
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [auth, axios, navigate]);

  const displayName =
    userProfile?.name ??
    (typeof auth?.user.user_metadata?.name === "string"
      ? auth.user.user_metadata.name
      : "Entrepreneur");

  const displayEmail =
    userProfile?.email ?? auth?.user.email ?? "entrepreneur@picku.app";

  const handleLogout = () => {
    removeStoredAuth();
    navigate("/", { replace: true });
  };

  const handleEditBusiness = () => {
    navigate("/entrepreneur/onboarding/category");
  };

  return (
    <main className="app-shell">
      <section className="app-screen">
        <header className="flex items-center justify-between mb-8">
          <img
            src={LogoEntrepreneur}
            onClick={() => navigate("/consumer/home")}
            alt="PickU"
            className="w-16 cursor-pointer"
          />
        </header>

        <img
          className="absolute right-24 top-9 h-21 object-contain"
          src="/resources/Image-profile-entrepeneurs.svg"
          alt=""
        />

        <section className="app-card px-6 py-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex p-3 shrink-0 items-center justify-center rounded-lg bg-blue/10">
              <UserBlueIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-medium text-black">
                {displayName}
              </h2>
              <p className="truncate text-[15px] font-light text-black/45 mt-1">
                {displayEmail}
              </p>
            </div>
          </div>

          <button
            className="app-action flex w-full items-center justify-center gap-4 bg-maroon text-[14px]"
            type="button"
            onClick={() => navigate("/consumer/login")}
          >
            <span className="truncate">Switch to Consumer Mode</span>
            <img
              className="h-6 w-6 brightness-0 invert"
              src="/icons/arrow-right.svg"
              alt=""
            />
          </button>
        </section>

        <button
          className="app-card mt-2 flex w-full items-center p-6 text-left transition-all duration-500 active:scale-95"
          type="button"
          onClick={handleEditBusiness}
        >
          <span className="mr-4 flex p-3 shrink-0 items-center justify-center rounded-lg bg-maroon/5">
            <Edit className="h-6 w-6 text-maroon" />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-[16px] font-medium text-black">
              Edit business information
            </span>
            <span className="block truncate font-light text-[15px] text-black/50 mt-1">
              Update your business details
            </span>
          </span>
        </button>

        <button
          className="app-card mt-2 flex w-full items-center p-6 text-left transition-all duration-500 active:scale-95"
          type="button"
          onClick={handleLogout}
        >
          <span className="mr-4 flex p-3 shrink-0 items-center justify-center rounded-lg bg-red-800/5">
            <LogoutIcon className="h-6 w-6" />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-[16px] font-medium text-black">
              Log Out
            </span>
            <span className="block truncate font-light text-[15px] text-black/50 mt-1">
              Sign out of your account.
            </span>
          </span>
        </button>

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

      <BottomNav variant="entrepreneur" />
    </main>
  );
};

export default EntrepreneurProfile;
