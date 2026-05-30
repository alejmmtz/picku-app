import { useNavigate } from "react-router-dom";

import ShoppingBagIcon from "../../assets/shopping-bag.svg?react";
import ShoppingCartIcon from "../../assets/shopping-cart.svg?react";

const RoleSelector = () => {
  const navigate = useNavigate();

  return (
    <main className="app-shell">
      <section className="app-screen flex flex-col justify-center">
        <div className="mb-10">
          <h2 className="app-title mb-2">Sooo...</h2>
          <p className="app-subtitle">How would you like to use PickU?</p>
        </div>

        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => navigate("/consumer/login")}
            className="app-card flex w-full cursor-pointer items-center gap-6 px-4 py-4 text-left transition-all duration-500 hover:border-orange active:scale-95"
          >
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-orange/15 p-4">
              <ShoppingBagIcon className="h-8 w-8" />
            </div>

            <div>
              <h2 className="mb-1 text-lg font-semibold text-orange">
                I'm a Consumer
              </h2>
              <p className="text-sm font-light leading-tight">
                Browse and buy from student entrepreneurs
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/entrepreneur/login")}
            className="app-card flex w-full cursor-pointer items-center gap-6 px-4 py-4 text-left transition-all duration-500 hover:border-blue active:scale-95"
          >
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-blue/15 p-4">
              <ShoppingCartIcon className="h-8 w-8" />
            </div>

            <div>
              <h2 className="mb-1 text-lg font-semibold text-blue">
                I'm an Entrepreneur
              </h2>
              <p className="text-sm font-light leading-tight">
                Sell your products to fellow students
              </p>
            </div>
          </button>
        </div>

        <p className="absolute bottom-12 left-1/2 w-full -translate-x-1/2 px-8 text-center font-light text-black/55">
          You can switch roles anytime from your profile
        </p>
      </section>
    </main>
  );
};

export default RoleSelector;
