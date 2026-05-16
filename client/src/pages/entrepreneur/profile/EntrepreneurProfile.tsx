import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getStoredAuth, removeStoredAuth } from "../../../utils/storage";
import BottomNav from "../../../components/common/BottomNav";

import LogoEntrepreneur from "../../../assets/logo entrepeneur color.svg";
import UserBlueIcon from "../../../assets/user blue.svg?react";
import Edit from "../../../assets/edit.svg?react"
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
  const [businessProfile, setBusinessProfile] =
    useState<EntrepreneurProfileData | null>(null);

  useEffect(() => {
    if (!auth) {
      navigate("/entrepreneur/login", { replace: true });
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      const [userResult, businessResult] = await Promise.allSettled([
        axios.get<UserProfile>("/picku/api/auth/me"),
        axios.get<EntrepreneurProfileData>("/picku/api/entrepreneurs/me"),
      ]);

      if (!isMounted) return;

      if (userResult.status === "fulfilled") {
        setUserProfile(userResult.value.data);
      }

      if (businessResult.status === "fulfilled") {
        setBusinessProfile(businessResult.value.data);
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [auth, axios, navigate]);

  const displayName =
    businessProfile?.name ??
    userProfile?.name ??
    (typeof auth?.user.user_metadata?.name === "string"
      ? auth.user.user_metadata.name
      : "Entrepreneur");
  const displayEmail = userProfile?.email ?? auth?.user.email ?? "entrepreneur@picku.app";

  const handleLogout = () => {
    removeStoredAuth();
    navigate("/", { replace: true });
  };

  const handleEditBusiness = () => {
    navigate("/entrepreneur/onboarding/category");
  };

  return (
    <main className="flex min-h-screen justify-center bg-background font-sofia text-black">
      <section className="w-full max-w-[430px] min-h-screen px-13 pt-16 pb-[140px]">
        <header className="relative mb-[45px] flex items-start justify-between">
          <img src={LogoEntrepreneur} alt="PickU" className="w-[72px] mt-2" />
          <img
            className="absolute right-[5px] top-[4px] h-[78px] w-[108px] object-contain"
            src="/resources/Image-profile-entrepeneurs.svg"
            alt=""
          />
        </header>

        {/* card profile */}
        <section className="rounded-[10px] border border-[#DCD6D3] px-[18px] py-[22px]">
          <div className="mb-[26px] flex items-center gap-[14px]">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[50px] bg-blue/10">
              <UserBlueIcon className="h-[26px] w-[26px]" />
            </div>

          
            <div className="min-w-0">
              <h1 className="m-0 truncate !font-sofia font-regular text-[16px] font-semibold leading-[1.25]">
                {displayName}
              </h1>
              <p className="mt-[4px] truncate text-[15px] font-light leading-[1.25] text-[#A7A7A7]">
                {displayEmail}
              </p>
            </div>
          </div>

          <button
            className="flex min-h-[50px] w-full items-center justify-center gap-[18px] rounded-[10px] bg-maroon px-4 text-[15px] font-regular text-white"
            type="button"
            onClick={() => navigate("/consumer/login")}
          >
            <span className="truncate">Switch to Consumer Mode</span>
            <img className="h-6 w-6 brightness-0 invert" src="/icons/arrow-right.svg" alt="" 
            />
          </button>
        </section>

      {/* edit info */}
        <button
          className="mt-[12px] flex w-full items-center rounded-[10px] border border-[#DCD6D3] px-[18px] py-[18px] text-left"
          type="button"
          onClick={handleEditBusiness}
        >
          <span className="mr-[14px] flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[8px] bg-[#eadbd9]">
            <Edit className="h-[24px] w-[24px]" />
          </span>

          <span className="min-w-0">
            <span className="block text-[15px] font-medium leading-[1.25]">
              Edit business information
            </span>
            <span className="mt-[5px] block truncate font-light text-[15px] text-[#A7A7A7]">
              Update your business details
            </span>
          </span>
        </button>

        <button
          className="mt-[12px] flex w-full items-center rounded-[10px] border border-[#DCD6D3]  px-[18px] py-[18px] text-left"
          type="button"
          onClick={handleLogout}
        >
          <span className="mr-[14px] flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[8px] bg-[#ffe8e5]">
            <LogoutIcon className="h-[24px] w-[24px]" />
          </span>

          <span className="min-w-0">
            <span className="block text-[15px] font-medium leading-[1.25]">Log Out</span>
            <span className="mt-[5px] block truncate text-[15px] font-light text-[#aaa4a0]">
              Sign out of your account.
            </span>
          </span>
        </button>

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

      <BottomNav variant="entrepreneur" />
    </main>
  );
};

export default EntrepreneurProfile;
