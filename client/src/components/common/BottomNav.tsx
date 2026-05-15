import { useLocation, useNavigate } from "react-router-dom";

type BottomNavVariant = "consumer" | "entrepreneur";

type NavItem = {
  id: string;
  label: string;
  to: string;
  icon: "home" | "orders" | "chatbot" | "products" | "profile";
  matches: (pathname: string) => boolean;
};

const consumerItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    to: "/consumer/home",
    icon: "home",
    matches: (pathname) => pathname.startsWith("/consumer/home"),
  },
  {
    id: "orders",
    label: "Orders",
    to: "/consumer/orders",
    icon: "orders",
    matches: (pathname) =>
      pathname.startsWith("/consumer/orders") ||
      pathname.startsWith("/consumer/order"),
  },
  {
    id: "chatbot",
    label: "ChatBot",
    to: "/consumer/chatbot",
    icon: "chatbot",
    matches: (pathname) => pathname.startsWith("/consumer/chatbot"),
  },
  {
    id: "profile",
    label: "Profile",
    to: "/consumer/profile",
    icon: "profile",
    matches: (pathname) => pathname.startsWith("/consumer/profile"),
  },
];

const entrepreneurItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    to: "/entrepreneur/home",
    icon: "home",
    matches: (pathname) => pathname.startsWith("/entrepreneur/home"),
  },
  {
    id: "orders",
    label: "Orders",
    to: "/entrepreneur/orders",
    icon: "orders",
    matches: (pathname) =>
      pathname.startsWith("/entrepreneur/orders") ||
      pathname.startsWith("/entrepreneur/order"),
  },
  {
    id: "products",
    label: "Products",
    to: "/entrepreneur/products",
    icon: "products",
    matches: (pathname) => pathname.startsWith("/entrepreneur/products"),
  },
  {
    id: "profile",
    label: "Profile",
    to: "/entrepreneur/profile",
    icon: "profile",
    matches: (pathname) => pathname.startsWith("/entrepreneur/profile"),
  },
];

const iconMaskByName: Record<string, string> = {
  home: "/icons/home.svg",
  orders: "/icons/clipboard.svg",
  products: "/icons/shopping-bag-1.svg",
  profile: "/icons/user.svg",
  chatbot: "/icons/chatbot.svg",
};

export default function BottomNav({ variant }: { variant: BottomNavVariant }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = variant === "consumer" ? consumerItems : entrepreneurItems;
  const activeColor = variant === "consumer" ? "text-orange" : "text-maroon";
  const activeBarColor = variant === "consumer" ? "bg-orange" : "bg-maroon";
  const inactiveColor = "text-[#a7a7a7]";
  return (
    <nav className="fixed bottom-0 z-50 w-full rounded-t-2xl bg-white px-3 pb-5 pt-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <div className={`grid grid-cols-4 gap-1`}>
        {items.map((item) => {
          const isActive = item.matches(pathname);
          const maskUrl = iconMaskByName[item.icon];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.to)}
              className={`relative flex flex-col items-center justify-end gap-0.5 rounded-xl px-2 pb-1 pt-2 text-center transition-colors ${
                isActive ? activeColor : inactiveColor
              }`}
            >
              {isActive && (
                <span
                  className={`absolute left-1/2 -top-4 h-2 w-20 -translate-x-1/2 rounded-b-[999px] ${activeBarColor}`}
                />
              )}

              <span
                className={`h-6 w-6 ${isActive ? activeBarColor : "bg-[#A3A3A3]"}`}
                style={{
                  maskImage: `url(${maskUrl})`,
                  WebkitMaskImage: `url(${maskUrl})`,
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                }}
              />

              <span className="text-[12px] font-regular leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
