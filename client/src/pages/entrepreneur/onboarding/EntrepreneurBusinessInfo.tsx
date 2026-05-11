import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";
import { getOnboardingData, setOnboardingData } from "./onboardingStorage";

const EntrepreneurBusinessInfo = () => {
  const navigate = useNavigate();
  const stored = getOnboardingData();
  const [name, setName] = useState(stored.name ?? "");
  const [contactInfo, setContactInfo] = useState(stored.contact_info ?? "");
  const [description, setDescription] = useState(stored.description ?? "");

  const canContinue = name.trim() && contactInfo.trim() && description.trim();

  const continueToNext = () => {
    if (!canContinue) return;
    setOnboardingData({
      name: name.trim(),
      contact_info: contactInfo.trim(),
      description: description.trim(),
    });
    navigate("/entrepreneur/onboarding/image");
  };

  return (
    <OnboardingShell progress={50} showBack>
      <header>
        <h1 className="m-0 !font-sofia text-[24px] font-bold leading-[1.12]">
          Set up business
        </h1>
        <p className="mt-[8px] text-[15px] leading-[1.05]">
          Add some basic information so students can discover and order from you.
        </p>
      </header>

      <form className="mt-[58px] flex flex-col gap-[17px]">
        <label className="flex flex-col gap-[11px]">
          <span className="text-[14px]">Company Name</span>
          <span className="flex min-h-[50px] items-center gap-[13px] rounded-[10px] border border-maroon px-[18px]">
            <img className="h-[21px] w-[21px] opacity-35" src="/icons/user.svg" alt="" />
            <input
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9d9d9d]"
              placeholder="Enter Company Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </span>
        </label>

        <label className="flex flex-col gap-[11px]">
          <span className="text-[14px]">Contact Information</span>
          <span className="flex min-h-[50px] items-center gap-[13px] rounded-[10px] border border-maroon px-[18px]">
            <img className="h-[21px] w-[21px] opacity-35" src="/icons/phone.svg" alt="" />
            <input
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9d9d9d]"
              placeholder="Enter Contact Information"
              value={contactInfo}
              onChange={(event) => setContactInfo(event.target.value)}
            />
          </span>
        </label>

        <label className="flex flex-col gap-[11px]">
          <span className="text-[14px]">Description</span>
          <textarea
            className="min-h-[112px] resize-none rounded-[10px] border border-maroon bg-transparent px-[18px] py-[17px] text-[14px] outline-none placeholder:text-[#9d9d9d]"
            placeholder="Type here..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </form>

      <button
        className="mt-auto min-h-[52px] rounded-[8px] bg-maroon text-[15px] font-semibold text-white disabled:opacity-45"
        type="button"
        disabled={!canContinue}
        onClick={continueToNext}
      >
        Continue
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurBusinessInfo;
