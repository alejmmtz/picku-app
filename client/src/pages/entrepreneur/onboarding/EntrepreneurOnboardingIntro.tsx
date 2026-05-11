import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

const EntrepreneurOnboardingIntro = () => {
  const navigate = useNavigate();

  return (
    <OnboardingShell>
      <div className="mt-[54px]">
        <h1 className="m-0 !font-sofia text-[26px] font-bold leading-[1.1]">
          Ready to start selling?
        </h1>
        <p className="mt-[17px] text-[16px] leading-[1.1]">
          Create your shop, show what you offer, and let others discover your picks!
        </p>
      </div>

      <div className="mt-[82px] flex justify-center">
        <img className="w-[240px]" src="/resources/img-1-onboarding.svg" alt="" />
      </div>

      <button
        className="mt-auto min-h-[52px] rounded-[8px] bg-maroon text-[15px] font-semibold text-white"
        type="button"
        onClick={() => navigate("/entrepreneur/onboarding/category")}
      >
        Set up your own business
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurOnboardingIntro;
