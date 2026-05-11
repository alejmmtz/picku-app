import ReceiptRow from "./ReceiptRow";

export default function ReceiptCard() {
  return (
    <section className="relative rounded-xl border border-black/25 bg-background p-8">
      <div className="absolute left-0 top-[50%] h-12 w-6 -translate-x-1/2 -translate-y-1/2 rounded-r-full border-r border-black/25 bg-background" />
      <div className="absolute right-0 top-[50%] h-12 w-6 translate-x-1/2 -translate-y-1/2 rounded-l-full border-l border-black/25 bg-background" />

      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="text-3xl font-semibold  text-black">Order receipt</h2>
        <span className="text-lg text-black/25">#08B3</span>
      </div>

      <div className="grid gap-2">
        <ReceiptRow label="Name:" value="Alejandro Munoz" />
        <ReceiptRow label="Amount:" value="$4.000" accent />
      </div>

      <div className="my-16 border-t-2 border-dashed border-black/25" />

      <div className="grid gap-2 mb-8">
        <ReceiptRow label="Product:" value="Capuccino express" />
        <ReceiptRow label="Date:" value="19/03/2025" accent />
        <div className="flex justify-between items-center ">
          <span className="text-black">Status:</span>
          <span className="inline-flex w-fit items-center rounded-full border border-[#b8c77f] bg-[#edf3cf] px-3 py-1 text-sm font-medium text-[#6c7c24]">
            Delivered
          </span>
        </div>
      </div>
    </section>
  );
}
