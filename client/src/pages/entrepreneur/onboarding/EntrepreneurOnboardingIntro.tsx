import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

const EntrepreneurOnboardingIntro = () => {
  const navigate = useNavigate();

  return (
    <OnboardingShell>
      <div className="flex flex-col gap-4 mb-16">
        <h2 className=" text-2xl font-semibold ">Ready to start selling?</h2>
        <p className="font-light  leading-[1.1]">
          Create your shop, show what you offer, and let others discover your
          picks!
        </p>
      </div>

      <div className="flex justify-center">
        <img className="w-64" src="/resources/img-1-onboarding.svg" alt="" />
      </div>

      <button
        className="app-action w-full text-md mt-16 bg-maroon  text-white"
        type="button"
        onClick={() => navigate("/entrepreneur/onboarding/category")}
      >
        Set up your own business
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurOnboardingIntro;
