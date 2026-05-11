import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

const EntrepreneurSuccess = () => {
  const navigate = useNavigate();

  return (
    <OnboardingShell>
      <header className="mt-[42px]">
        <h1 className="m-0 flex items-center gap-[8px] !font-sofia text-[26px] font-bold leading-[1.1]">
          You&#39;re all set!
          <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#a9ed9d]">
            <img className="h-[18px] w-[18px]" src="/icons/check.svg" alt="" />
          </span>
        </h1>
        <p className="mt-[8px] text-[15px] leading-[1.05]">
          You&#39;re ready to start selling. Add your products and receive your first orders.
        </p>
      </header>

      <div className="mt-[118px] flex justify-center">
        <img className="w-[266px]" src="/resources/img-3-onboarding.svg" alt="" />
      </div>

      <button
        className="mt-auto min-h-[52px] rounded-[8px] bg-maroon text-[15px] font-semibold text-white"
        type="button"
        onClick={() => navigate("/entrepreneur/home")}
      >
        Continue
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurSuccess;
