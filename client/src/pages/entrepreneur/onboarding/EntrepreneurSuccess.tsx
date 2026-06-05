import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

import CheckIcon from "../../../assets/check icon.svg?react";

const EntrepreneurSuccess = () => {
  const navigate = useNavigate();

  return (
    <OnboardingShell>
      <header className="mt-12 flex flex-col gap-2">
        <h2 className=" flex items-center gap-2 text-[30px] font-semibold ">
          You're all set!
          <span className="flex items-center justify-center">
            <CheckIcon className="h-8 w-8" />
          </span>
        </h2>
        <p className=" text-[15px] font-light leading-[1.05]">
          You're ready to start selling. Add your products and receive your
          first orders.
        </p>
      </header>

      <div className="mt-auto flex justify-center">
        <img className="w-full" src="/resources/img-3-onboarding.svg" alt="" />
      </div>

      <button
        className="app-action mt-auto bg-maroon  text-white"
        type="button"
        onClick={() => navigate("/entrepreneur/home")}
      >
        Continue
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurSuccess;
