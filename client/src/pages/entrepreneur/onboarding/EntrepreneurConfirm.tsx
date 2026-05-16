import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAxios } from "../../../providers/AxiosProvider";
import OnboardingShell from "./OnboardingShell";
import {
  clearOnboardingData,
  getOnboardingData,
} from "./onboardingStorage";
import { getStoredAuth } from "../../../utils/storage";
import EditIcon from "../../../assets/edit-2.svg?react";
const DEFAULT_SHOP_IMAGE = "/resources/img-2-onboarding.svg";
const MAX_IMAGE_PAYLOAD_LENGTH = 900000;
const RETRYABLE_NETWORK_PATTERNS = [
  "getaddrinfo",
  "enotfound",
  "econnreset",
  "etimedout",
  "network error",
];

const getSafeShopImage = (image?: string) => {
  if (!image) {
    return DEFAULT_SHOP_IMAGE;
  }

  if (image.startsWith("data:") && image.length > MAX_IMAGE_PAYLOAD_LENGTH) {
    return DEFAULT_SHOP_IMAGE;
  }

  return image;
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const isRetryableRegistrationError = (error: unknown) => {
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  const message = String(error.response?.data?.message ?? error.message).toLowerCase();

  return (
    !status ||
    status >= 500 ||
    RETRYABLE_NETWORK_PATTERNS.some((pattern) => message.includes(pattern))
  );
};

const EntrepreneurConfirm = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const data = getOnboardingData();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerBusiness = async () => {
    const auth = getStoredAuth();
    if (!auth) {
      setErrorMessage("Inicia sesion como entrepreneur antes de registrar tu negocio.");
      return;
    }

    if (!data.name || !data.contact_info || !data.description || !data.category) {
      navigate("/entrepreneur/onboarding/category");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        name: data.name,
        contact_info: data.contact_info,
        description: data.description,
        category: data.category,
        img: getSafeShopImage(data.img),
      };

      try {
        await api.post("/picku/api/entrepreneurs/me", payload);
      } catch (error) {
        if (!isRetryableRegistrationError(error)) {
          throw error;
        }

        await wait(700);
        await api.post("/picku/api/entrepreneurs/me", payload);
      }

      clearOnboardingData();
      navigate("/entrepreneur/onboarding/success");
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "No pudimos registrar tu negocio";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingShell progress={100} showBack>
      <header>
        <h1 className="m-0 !font-sofia text-[25px] font-bold leading-[1.12]">
          Ready to go live?
        </h1>
        <p className="mt-[8px] font-light text-[15px] leading-[1.05]">
          Your shop is almost ready. Just review and start selling.
        </p>
      </header>

      <div className="mb-[-37px] ml-[150px] flex justify-center">
      <img
        className="h-[90px] w-[58px]"
        src="/resources/img-2-onboarding.svg"
        alt=""
      />
    </div>

      <section className="mt-[2px] flex flex-col gap-[16px]">
        <label className="flex flex-col gap-[8px]">
          <span className="text-[14px] font-light">Company Name</span>
          <button
            className="flex min-h-[52px] items-center justify-between rounded-[10px] border border-maroon px-[18px] text-left text-[14px]"
            type="button"
            onClick={() => navigate("/entrepreneur/onboarding/business")}
          >
            <span className="truncate font-light">{data.name || "Company Name"}</span>
            <EditIcon className="h-[20px] w-[20px]" />
          </button>
        </label>

        <label className="flex flex-col gap-[8px]">
          <span className="text-[14px] font-light">Contact Information</span>
          <button
            className="flex min-h-[52px] items-center justify-between rounded-[10px] border border-maroon px-[18px] font-light text-left text-[14px]"
            type="button"
            onClick={() => navigate("/entrepreneur/onboarding/business")}
          >
            <span className="truncate">{data.contact_info || "Contact Information"}</span>
            <EditIcon className="h-[20px] w-[20px]" />
          </button>
        </label>

        <label className="flex flex-col gap-[8px]">
          <span className="text-[14px] font-light">Description</span>
          <button
            className="flex min-h-[112px] items-start justify-between rounded-[10px] border  font-light border-maroon px-[18px] py-[17px] text-left text-[14px]"
            type="button"
            onClick={() => navigate("/entrepreneur/onboarding/business")}
          >
            <span className="line-clamp-4 ">{data.description || "Description"}</span>
            <EditIcon className="h-[20px] w-[20px]" />
          </button>
        </label>
      </section>

      {errorMessage ? (
        <p className="mt-[14px] text-[13px] text-[#c43e14]">{errorMessage}</p>
      ) : null}

      <button
        className="mt-auto min-h-[53px] rounded-[12px] font-light bg-maroon text-[16px] text-white disabled:opacity-60"
        type="button"
        disabled={isSubmitting}
        onClick={registerBusiness}
      >
        Register your own business
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurConfirm;
