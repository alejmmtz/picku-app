import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";
import { getOnboardingData, setOnboardingData } from "./onboardingStorage";

const foodCategories = ["Meals", "Drinks", "Snacks", "Desserts & sweets"];
const moreCategories = [
  "Clothing & accessories",
  "Crafts",
  "Beauty & personal care",
  "Art",
  "Stationery",
  "Services",
  "Technology",
];

const CategoryButton = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    className={`min-h-[34px] rounded-[8px] border px-[10px] text-[14px] font-semibold ${
      selected
        ? "border-maroon bg-[#f4e9e6] text-maroon"
        : "border-[#d6cec9] bg-transparent text-maroon"
    }`}
    type="button"
    onClick={onClick}
  >
    {label}
  </button>
);

const EntrepreneurCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(getOnboardingData().category ?? "");

  const continueToNext = () => {
    if (!category) return;
    setOnboardingData({ category });
    navigate("/entrepreneur/onboarding/business");
  };

  return (
    <OnboardingShell progress={25}>
      <header>
        <h1 className="m-0 !font-sofia text-[24px] font-bold leading-[1.12]">
          Select Category
        </h1>
        <p className="mt-[8px] text-[15px] leading-[1.2]">So people know what you sell.</p>
      </header>

      <section className="mt-[46px]">
        <p className="mb-[15px] text-[15px]">Foods:</p>
        <div className="flex flex-wrap gap-[8px]">
          {foodCategories.map((item) => (
            <CategoryButton
              key={item}
              label={item}
              selected={category === item}
              onClick={() => setCategory(item)}
            />
          ))}
        </div>
      </section>

      <section className="mt-[38px]">
        <p className="mb-[16px] text-[15px]">Mas categorias:</p>
        <div className="flex flex-wrap gap-[8px]">
          {moreCategories.map((item) => (
            <CategoryButton
              key={item}
              label={item}
              selected={category === item}
              onClick={() => setCategory(item)}
            />
          ))}
        </div>
      </section>

      <button
        className="mt-auto min-h-[52px] rounded-[8px] bg-maroon text-[15px] font-semibold text-white disabled:opacity-45"
        type="button"
        disabled={!category}
        onClick={continueToNext}
      >
        Continue
      </button>
    </OnboardingShell>
  );
};

export default EntrepreneurCategory;
