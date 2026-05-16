import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

const EntrepreneurOnboardingIntro = () => {
  const navigate = useNavigate();

  return (
    <OnboardingShell>
      <div className="mt-[15px]">
        <h1 className="m-0 !font-sofia text-[30px] font-bold leading-[1.1]">
          Ready to start selling?
        </h1>
        <p className="mt-[17px] font-light text-[16px] leading-[1.1]">
          Create your shop, show what you offer, and let others discover your picks!
        </p>
      </div>

      <div className="mt-[90px] flex justify-center">
        <img className="w-[290px]" src="/resources/img-1-onboarding.svg" alt="" />
      </div>

      <button
        className="mt-auto min-h-[53px] rounded-[12px] font-light bg-maroon text-[16px] text-white"
        type="button"
        onClick={() => navigate("/entrepreneur/onboarding/category")}
      >
        Set up your own business
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurOnboardingIntro;
