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
        className="flex items-center gap-1 rounded-lg font-light bg-white px-3 py-2 text-sm shadow-xs transition-all active:scale-95"
      >
        <AppIcon name="chevron-left" className="h-3 w-3 text-black" />
        <span>Orders</span>
      </button>
    </div>
  );
}
