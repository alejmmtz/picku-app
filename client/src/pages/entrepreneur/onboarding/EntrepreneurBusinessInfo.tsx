import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";
import { getOnboardingData, setOnboardingData } from "./onboardingStorage";

import UserIcon from "../../../assets/user.svg?react";
import PhoneIcon from "../../../assets/phone.svg?react";

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
        <h1 className="m-0 !font-sofia text-[25px] font-bold leading-[1.12]">
          Set up business
        </h1>
        <p className="mt-[8px] text-[15px] font-light leading-[1.3]">
          Add some basic information so students can discover and order from you.
        </p>
      </header>

      <form className="mt-[42px] flex flex-col gap-[17px]">
        <label className="flex flex-col gap-[11px]">
          <span className="text-[14px] font-light">Company Name</span>
          <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]">
            <UserIcon className="h-[22px] w-[22px] shrink-0" />
            <input
              className="w-full bg-transparent font-light text-[15px] outline-none placeholder:text-[#9d9d9d]"
              placeholder="Enter Company Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </span>
        </label>

        <label className="flex flex-col gap-[11px]">
          <span className="text-[14px] font-light">Contact Information</span>
            <span className="flex min-h-12 items-center gap-3 rounded-[14px] border-[1.5px] border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]">
            <PhoneIcon className="h-[22px] w-[22px] shrink-0" />
            <input
              className="w-full bg-transparent font-light text-[15px] outline-none placeholder:text-[#9d9d9d]"
              placeholder="Enter Contact Information"
              value={contactInfo}
              onChange={(event) => setContactInfo(event.target.value)}
            />
          </span>
        </label>

        <label className="flex flex-col gap-[11px]">
          <span className="text-[14px] font-light">Description</span>
          <textarea
            className="min-h-[112px] resize-none rounded-[14px] font-light border border-maroon bg-transparent px-[18px] py-[17px] text-[15px] outline-none placeholder:text-[#9d9d9d]"
            placeholder="Type here..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </form>

      <button
        className="mt-auto min-h-[53px] rounded-[12px] font-light bg-maroon text-[16px] text-white disabled:opacity-45"
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
