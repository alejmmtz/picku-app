type PickupCodeCardProps = {
  code: string;
};

export default function PickupCodeCard({ code }: PickupCodeCardProps) {
  return (
    <>
      <div className="mb-2 rounded-2xl border-2 border-orange bg-orange/10 px-2 py-8 text-center">
        <p className="mb-4 text-lg leading-0 text-black">PickUp Code</p>
        <p className="text-6xl leading-14 text-black">{code}</p>
      </div>

      <p className="mb-12 text-center font-light text-black/50">
        Show this code to collect your order
      </p>
    </>
  );
}
