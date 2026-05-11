import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getStoredAuth, removeStoredAuth } from "../../../utils/storage";

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
      <section className="relative min-h-screen w-full max-w-[430px] overflow-hidden px-[50px] pt-[72px] pb-[120px]">
        <header className="relative mb-[48px] flex items-start justify-between">
          <img className="mt-[2px] w-[64px]" src="/logos/picku-logo.svg" alt="PickU" />
          <img
            className="absolute right-[5px] top-[-8px] h-[78px] w-[108px] object-contain"
            src="/resources/Image-profile-entrepeneurs.svg"
            alt=""
          />
        </header>

        <section className="rounded-[10px] border border-[#cfc9c4] bg-[rgba(255,255,255,0.36)] px-[18px] py-[22px]">
          <div className="mb-[26px] flex items-center gap-[14px]">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] bg-[#dff1fc]">
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
            className="flex min-h-[50px] w-full items-center justify-center gap-[18px] rounded-[10px] bg-maroon px-4 text-[15px] font-semibold text-white"
            type="button"
            onClick={() => navigate("/")}
          >
            <span className="truncate">Switch to Consumer Mode</span>
            <img className="h-6 w-6 brightness-0 invert" src="/icons/arrow-right.svg" alt="" 
            />
          </button>
        </section>

        <button
          className="mt-[12px] flex w-full items-center rounded-[10px] border border-[#cfc9c4] bg-[rgba(255,255,255,0.36)] px-[18px] py-[18px] text-left"
          type="button"
          onClick={handleEditBusiness}
        >
          <span className="mr-[14px] flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[8px] bg-[#eadbd9]">
            <img className="h-[24px] w-[24px]" src="/icons/edit-2.svg" alt="" />
          </span>

          <span className="min-w-0">
            <span className="block text-[15px] font-semibold leading-[1.25]">
              Edit business information
            </span>
            <span className="mt-[5px] block truncate text-[13px] text-[#aaa4a0]">
              Update your business details
            </span>
          </span>
        </button>

        <button
          className="mt-[12px] flex w-full items-center rounded-[10px] border border-[#cfc9c4] bg-[rgba(255,255,255,0.36)] px-[18px] py-[18px] text-left"
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

export default EntrepreneurProfile;
