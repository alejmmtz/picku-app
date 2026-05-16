import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";
import { getOnboardingData, setOnboardingData } from "./onboardingStorage";

import UploadImageIcon from "../../../assets/upload image.svg?react";

const DEFAULT_SHOP_IMAGE = "/resources/img-2-onboarding.svg";
const MAX_IMAGE_SIZE_BYTES = 650 * 1024;

const EntrepreneurImage = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState(getOnboardingData().img ?? "");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImage("");
      setFeedbackMessage(
        "Image is too large to upload right now. Using default illustration instead."
      );
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setFeedbackMessage("");
      }
    };
    reader.readAsDataURL(file);
  };

  const continueToNext = () => {
    setOnboardingData({ img: image || DEFAULT_SHOP_IMAGE });
    navigate("/entrepreneur/onboarding/confirm");
  };

  return (
    <OnboardingShell progress={75} showBack>
      <header>
        <h1 className="m-0 !font-sofia text-[25px] font-bold leading-[1.12]">
          Make it yours!
        </h1>
        <p className="mt-[8px] text-[15px] font-light leading-[1.2]">
          Add a logo or image for your shop.
        </p>
      </header>

      <button
        className="mx-auto mt-[145px] flex h-[320px] w-[250px] items-center justify-center overflow-hidden rounded-[13px] border border-dashed border-maroon/36 bg-maroon/5"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        {image ? (
          <img className="h-full w-full object-cover" src={image} alt="Shop preview" />
        ) : (
          <UploadImageIcon className="h-[60px] w-[60px]" />
        )}
      </button>

      {feedbackMessage ? (
        <p className="mx-auto mt-[16px] max-w-[250px] text-center text-[13px] leading-[1.25] text-[#a77966]">
          {feedbackMessage}
        </p>
      ) : null}

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button
        className="mt-auto min-h-[53px] rounded-[12px] font-light bg-maroon text-[16px] text-white"
        type="button"
        onClick={continueToNext}
      >
        Continue
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurImage;
