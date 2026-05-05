import { useNavigate } from "react-router-dom";

import ShoppingBagIcon from "../../assets/shopping-bag.svg?react";
import ShoppingCartIcon from "../../assets/shopping-cart.svg?react";

const RoleSelector = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col justify-center px-13 font-sofia text-black relative">
      <section className="w-full max-w-[430px] mx-auto">
        <div className="mb-10">
          <h1 className="text-[32px] font-semibold leading-tight mb-2 font-sofia">
            Sooo...
          </h1>

          <div className="flex items-center gap-2">
            <p className="text-[16px] font-light">
                How would you like to use PickU?
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => navigate("/consumer/login")}
            className="w-full min-h-[112px] rounded-[22px] border border-[#DCD6D3] px-6 flex items-center gap-6 text-left transition-all duration-400 hover:border-orange hover:shadow-[0_12px_30px_rgba(255,112,45,0.10)] active:scale-[0.100]"
          >
            <div className="w-[74px] h-[74px] rounded-[14px] bg-[#FFE9DD] flex items-center justify-center shrink-0">
              <ShoppingBagIcon className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-orange text-[17px] font-medium mb-1">
                I’m a Consumer
              </h2>
              <p className="text-[15px] leading-tight font-light">
                Browse and buy from student entrepreneurs
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/entrepreneur/login")}
            className="w-full min-h-[112px] rounded-[22px] border border-[#ddd4cc] px-6 flex items-center gap-6 text-left transition-all duration-400 hover:border-blue hover:shadow-[0_12px_30px_rgba(255,112,45,0.10)] active:scale-[0.100]"
          >
            <div className="w-[74px] h-[74px] rounded-[14px] bg-[#DFF1FC] flex items-center justify-center shrink-0">
              <ShoppingCartIcon className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-blue text-[17px] font-medium mb-1">
                I’m an Entrepreneur
              </h2>
              <p className="text-[15px] leading-tight font-light">
                Sell your products to fellow students
              </p>
            </div>
          </button>
        </div>
      </section>

      <p className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-8 text-center text-[15px] font-light">
        You can switch roles anytime from your profile
      </p>
    </main>
  );
};

export default RoleSelector;
