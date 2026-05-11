import { useNavigate } from "react-router-dom";
import OrderFlowHeader from "./components/OrderFlowHeader";
import OrderMap from "./components/OrderMap";
import OrderSummaryCard from "./components/OrderSummaryCard";

export default function Order() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-black sm:px-6 sm:py-6">
      <section className="relative h-dvh w-full overflow-hidden sm:mx-auto sm:w-100">
        <OrderMap />
        <OrderFlowHeader onBack={() => navigate(-1)} />
        <OrderSummaryCard />
      </section>
    </main>
  );
}
