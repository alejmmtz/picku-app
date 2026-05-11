import { useNavigate } from "react-router-dom";
import ReceiptCard from "./components/ReceiptCard";

export default function OrderReceipt() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-black px-12 sm:py-6">
      <section className="relative h-dvh w-full bg-background">
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-1 flex-col">
            <div className="flex justify-center p-12 ">
              <img
                src="/images/receipt-guy-entrepreneur.png"
                alt="PickU"
                className="h-auto w-72"
              />
            </div>

            <ReceiptCard />

            <button
              type="button"
              onClick={() => navigate("/entrepreneur/order")}
              className="mt-12 mb-12 rounded-xl bg-maroon px-6 py-4 text-lg  text-white transition-transform active:scale-[0.99]"
            >
              Go back to orders
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
