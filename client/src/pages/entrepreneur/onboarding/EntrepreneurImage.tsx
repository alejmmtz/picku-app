import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";
import { getOnboardingData, setOnboardingData } from "./onboardingStorage";

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
        "La imagen pesa demasiado para guardarla por ahora. Usaremos la ilustracion default."
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
        <h1 className="m-0 !font-sofia text-[24px] font-bold leading-[1.12]">
          Make it yours!
        </h1>
        <p className="mt-[8px] text-[15px] leading-[1.2]">
          Add a logo or image for your shop.
        </p>
      </header>

      <button
        className="mx-auto mt-[104px] flex h-[310px] w-[230px] items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-[#d7aaa9] bg-[#f7eeee]"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        {image ? (
          <img className="h-full w-full object-cover" src={image} alt="Shop preview" />
        ) : (
          <img className="h-[46px] w-[46px]" src="/icons/image.svg" alt="" />
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
        className="mt-auto min-h-[52px] rounded-[8px] bg-maroon text-[15px] font-semibold text-white"
        type="button"
        onClick={continueToNext}
      >
        Continue
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurImage;
