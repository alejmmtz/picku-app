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
        "Image is too large to upload right now. Using default illustration instead.",
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
      <header className="flex flex-col gap-2">
        <h2 className="text-[25px] font-semibold leading-[1.12]">
          Make it yours!
        </h2>
        <p className="text-[15px] font-light leading-[1.2]">
          Add a logo or image for your shop.
        </p>
      </header>

      <button
        className="flex min-h-72 m-auto w-full items-center justify-center overflow-hidden rounded-[13px] border border-dashed border-maroon/36 bg-maroon/5"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        {image ? (
          <img
            className="h-full w-full object-cover"
            src={image}
            alt="Shop preview"
          />
        ) : (
          <UploadImageIcon className="h-16 w-16" />
        )}
      </button>

      {feedbackMessage ? (
        <p className="mx-auto text-center text-[#a77966]">{feedbackMessage}</p>
      ) : null}

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button
        className="mt-auto app-action bg-maroon text-white"
        type="button"
        onClick={continueToNext}
      >
        Continue
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurImage;
