import { ORDER_INFO } from "../orderFlow.constants";

export default function OrderInfoRows() {
  return (
    <div className="mb-8">
      {ORDER_INFO.map(({ label, value, accent }) => (
        <div
          key={label}
          className="flex items-center justify-between border-b border-black/25 py-2"
        >
          <span className=" text-black">{label}</span>
          <span
            className={
              accent ? "font-medium text-orange" : "font-medium text-black"
            }
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
