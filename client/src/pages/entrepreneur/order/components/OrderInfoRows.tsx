type OrderInfoRow = {
  label: string;
  value: string;
  accent?: boolean;
};

type OrderInfoRowsProps = {
  rows: OrderInfoRow[];
};

export default function OrderInfoRows({ rows }: OrderInfoRowsProps) {
  return (
    <div className="mb-6">
      {rows.map(({ label, value, accent }) => (
        <div
          key={label}
          className="flex items-center justify-between border-b border-black/25 py-2"
        >
          <span className=" text-black">{label}</span>
          <span
            className={
              accent ? " font-medium text-orange" : " font-medium text-black/80"
            }
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
