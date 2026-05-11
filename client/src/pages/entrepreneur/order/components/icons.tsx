import type { CSSProperties } from "react";

export type AppIconName =
  | "chevron-left"
  | "check-circle"
  | "clipboard"
  | "navigation"
  | "thumbs-up"
  | "map-pin"
  | "smartphone";

type AppIconProps = {
  name: AppIconName;
  className?: string;
  style?: CSSProperties;
};

export default function AppIcon({
  name,
  className = "",
  style,
}: AppIconProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        WebkitMask: `url(/icons/${name}.svg) no-repeat center / contain`,
        mask: `url(/icons/${name}.svg) no-repeat center / contain`,
        backgroundColor: "currentColor",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
