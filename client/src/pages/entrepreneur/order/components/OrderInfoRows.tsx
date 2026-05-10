import { CUSTOMER_INFO } from "../orderFlow.constants";

export default function OrderInfoRows() {
  return (
    <div className="mb-4">
      {CUSTOMER_INFO.map(({ label, value, accent }) => (
        <div
          key={label}
          className="flex items-center justify-between border-b border-black/10 py-2"
        >
          <span className="text-[15px] text-black/80">{label}</span>
          <span
            className={
              accent
                ? "text-[15px] font-medium text-orange"
                : "text-[15px] font-medium text-black/80"
            }
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
