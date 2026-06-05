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
      <header className="flex flex-col gap-2 mb-8">
        <h2 className="text-[25px] font-semibold ">Set up yout business</h2>
        <p className=" text-[15px] font-light leading-[1.3]">
          Add some basic information, so students can discover and order from
          you.
        </p>
      </header>

      <form className="mt- flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] font-light">Business Name</span>
          <span className="app-field flex min-h-12 items-center gap-3 rounded-xl border-[1.5px] border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]">
            <UserIcon className="h-6 w-6 shrink-0" />
            <input
              className="w-full bg-transparent font-light text-[15px] outline-none placeholder:text-black/50"
              placeholder="Make it Cool!"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[14px] font-light">Contact Information</span>
          <span className="app-field flex min-h-12 items-center gap-3 rounded-xl border-[1.5px] border-maroon bg-transparent px-4 focus-within:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]">
            <PhoneIcon className="h-6 w-6 shrink-0" />
            <input
              className="w-full bg-transparent font-light text-[15px] outline-none placeholder:text-black/50"
              placeholder="Enter your Number"
              value={contactInfo}
              onChange={(event) => setContactInfo(event.target.value)}
            />
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[14px] font-light">Description</span>
          <textarea
            className="app-field min-h-36 resize-none border-maroon px-4  text-[15px] focus:shadow-[0_0_0_3px_rgba(80,3,17,0.12)]"
            placeholder="Type here..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </form>

      <button
        className="app-action mt-auto bg-maroon  disabled:opacity-45"
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
