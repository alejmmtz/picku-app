import { useNavigate } from "react-router-dom";

import ShoppingBagIcon from "../../assets/shopping-bag.svg?react";
import ShoppingCartIcon from "../../assets/shopping-cart.svg?react";

const RoleSelector = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col justify-center px-12 text-black relative">
      <section className="w-full ">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold leading-tight mb-2 ">
            Sooo...
          </h2>

          <div className="flex items-center gap-2">
            <p className="text font-light">How would you like to use PickU?</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => navigate("/consumer/login")}
            className="cursor-pointer w-full rounded-2xl border border-black/25 px-4 py-4 flex items-center gap-6 text-left transition-all duration-400 hover:border-orange active:scale-90"
          >
            <div className="p-4 rounded-xl bg-orange/15 flex items-center justify-center shrink-0">
              <ShoppingBagIcon className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-orange text-lg font-semibold mb-1">
                I’m a Consumer
              </h2>
              <p className="leading-tight text-sm font-light">
                Browse and buy from student entrepreneurs
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/entrepreneur/login")}
            className="cursor-pointer w-full rounded-2xl border border-black/25 px-4 py-4 flex items-center gap-6 text-left transition-all duration-400 hover:border-blue active:scale-90"
          >
            <div className="p-4 rounded-xl bg-blue/15 flex items-center justify-center shrink-0">
              <ShoppingCartIcon className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-blue text-lg font-semibold mb-1">
                I’m an Entrepreneur
              </h2>
              <p className="leading-tight text-sm font-light">
                Sell your products to fellow students
              </p>
            </div>
          </button>
        </div>
      </section>

      <p className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-8 text-center font-light">
        You can switch roles anytime from your profile
      </p>
    </main>
  );
};

export default RoleSelector;
