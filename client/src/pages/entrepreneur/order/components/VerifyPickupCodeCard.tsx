import AppIcon from "./icons";

export default function VerifyPickupCodeCard() {
  return (
    <div className="rounded-xl border border-black/25 bg-background p-4">
      <div className=" flex items-center gap-2">
        <AppIcon name="smartphone" className="h-5 w-5 text-orange" />
        <p className="text-lg text-black">Verify Pickup Code</p>
      </div>

      <p className="mb-4 font-light text-black">
        Ask the costumer your pickup code.
      </p>

      <input
        type="text"
        placeholder="Enter code (e.g, E456)"
        className="mb-4 h-12 w-full rounded-xl border border-maroon px-4 text-sm text-black outline-none placeholder:text-black/25"
      />

      <button
        type="button"
        className="w-full rounded-xl bg-maroon px-4 py-4 text-base font-semibold text-background transition-transform active:scale-[0.99]"
      >
        Verify & Complete Order
      </button>
    </div>
  );
}
