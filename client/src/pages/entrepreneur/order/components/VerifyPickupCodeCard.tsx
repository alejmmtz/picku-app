import AppIcon from "./icons";

export default function VerifyPickupCodeCard() {
  return (
    <div className="rounded-2xl border border-black/10 bg-background p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-orange/35">
          <AppIcon name="smartphone" className="h-3.5 w-3.5 text-orange" />
        </div>
        <p className="text-[15px] font-medium text-black/85">Verify Pickup Code</p>
      </div>

      <p className="mb-4 text-sm leading-5 text-black/55">
        Ask the costumer to show you their pickup code.
      </p>

      <input
        type="text"
        placeholder="Enter code (e.g, E456)"
        className="mb-4 h-12 w-full rounded-xl border border-maroon/70 bg-white px-4 text-sm text-black outline-none placeholder:text-black/25"
      />

      <button
        type="button"
        className="w-full rounded-xl bg-maroon px-4 py-4 text-base font-semibold text-white transition-transform active:scale-[0.99]"
      >
        Verify & Complete Order
      </button>
    </div>
  );
}
