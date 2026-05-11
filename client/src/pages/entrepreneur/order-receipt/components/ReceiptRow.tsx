type ReceiptRowProps = {
  label: string;
  value: string;
  accent?: boolean;
};

export default function ReceiptRow({
  label,
  value,
  accent = false,
}: ReceiptRowProps) {
  return (
    <div className="flex items-center justify-between ">
      <span className="text-black">{label}</span>
      <span
        className={
          accent
            ? "justify-self-start font-medium text-orange"
            : "justify-self-start font-medium text-black"
        }
      >
        {value}
      </span>
    </div>
  );
}
