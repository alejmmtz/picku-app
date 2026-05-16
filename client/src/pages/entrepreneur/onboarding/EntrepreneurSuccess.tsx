import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

import CheckIcon from "../../../assets/check icon.svg?react";

const EntrepreneurSuccess = () => {
  const navigate = useNavigate();

  return (
    <OnboardingShell>
      <header className="mt-[42px]">
        <h1 className="m-0 flex items-center gap-[8px] !font-sofia text-[30px] font-bold leading-[1.1]">
          You're all set!
          <span className="flex items-center justify-center">
            <CheckIcon className="h-[40px] w-[40px]" />
          </span>
        </h1>
        <p className="mt-[8px] text-[15px] font-light leading-[1.05]">
          You're ready to start selling. Add your products and receive your first orders.
        </p>
      </header>

      <div className="mt-[170px] flex justify-center">
        <img className="w-[300px]" src="/resources/img-3-onboarding.svg" alt="" />
      </div>

      <button
        className="mt-auto min-h-[53px] rounded-[12px] font-light bg-maroon text-[16px] text-white"
        type="button"
        onClick={() => navigate("/entrepreneur/home")}
      >
        Continue
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurSuccess;
