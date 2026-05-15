import AppIcon from "./icons";

type OrderFlowHeaderProps = {
  onBack: () => void;
};

export default function OrderFlowHeader({ onBack }: OrderFlowHeaderProps) {
  return (
    <div className="absolute left-8 top-14 z-20">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 rounded-xl  backdrop-blur-sm px-2 py-3 "
      >
        <AppIcon name="chevron-left" className="h-4 w-4 text-black" />
        <span className="text-sm font-semibold text-black">Orders</span>
      </button>
    </div>
  );
}
