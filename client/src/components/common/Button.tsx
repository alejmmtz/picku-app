import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  type?: "button" | "submit";
}

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  icon,
  type = "button",
}: ButtonProps) => {
  const baseStyles =
    "flex h-[54px] w-full items-center justify-center gap-2 rounded-[10px] text-[15px] font-medium transition-all duration-200";

  const variants = {
    primary: disabled
      ? "cursor-not-allowed bg-orange/40 text-white"
      : "bg-orange text-white",

    secondary: disabled
      ? "cursor-not-allowed border border-orange opacity-50 text-orange"
      : "border border-orange text-orange",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {icon}

      <span>{children}</span>
    </button>
  );
};

export default Button;