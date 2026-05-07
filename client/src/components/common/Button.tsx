import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  type?: "button" | "submit";
}

const Button = ({
  children,
  onClick,
  disabled = false,
  icon,
  type = "button",
}: ButtonProps) => {
  const baseStyles =
    "flex h-[54px] w-[320px] ml-3 items-center justify-center gap-2 rounded-[10px] text-[15px] font-medium transition-all duration-200";

  const buttonStyles = disabled
    ? "cursor-not-allowed bg-orange/40 text-white"
    : "bg-orange text-white";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${buttonStyles}`}
    >
      {icon}

      <span>{children}</span>
    </button>
  );
};

export default Button;