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
    className={`border border-maroon/0 text-maroon px-4 py-2 text-sm rounded-2xl transition-all duration-300  ${
      selected ? " bg-orange text-black " : "  border-maroon/100"
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
    <OnboardingShell progress={25} showBack={true}>
      <header className="flex flex-col gap-2 ">
        <h2 className=" text-2xl font-semibold leading-[1.12]">
          Select Category
        </h2>
        <p className="font-light  leading-[1.2]">
          So people know what you sell.
        </p>
      </header>

      <section className="mt-8 items-center full-h justify-around">
        <p className="mb-4 text-sm font-light">Foods:</p>
        <div className="flex flex-wrap gap-2">
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

      <section className="mt-6">
        <p className="mb-4 text-sm font-light">More categories:</p>
        <div className="flex flex-wrap gap-2">
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
        className="app-action mt-auto bg-maroon  text-white disabled:opacity-45"
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
