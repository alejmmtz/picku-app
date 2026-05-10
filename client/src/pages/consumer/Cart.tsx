import { useNavigate } from "react-router-dom";
import { useCart } from "../../providers/CartProvider";

import LogoConsumer from "../../assets/logo consumer.png";
import ArrowIcon from "../../assets/arrow.svg?react";
import TrashIcon from "../../assets/trash.svg?react";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
  } = useCart();

  return (
    <main className="min-h-screen flex justify-center bg-background font-sofia text-black">
      <section className="relative w-full max-w-[430px] min-h-screen px-13 pt-16 pb-32">
        <img src={LogoConsumer} alt="PickU" className="w-[72px] mt-1.5 mb-8 " />

        <button
          type="button"
          onClick={() => navigate("/consumer/home")}
          className="mb-4 flex items-center gap-2 font-regular text-[17px]"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* empty state */}
        <h2 className="mb-8 text-[28px] font-semibold">My cart</h2>

        {cartItems.length === 0 && (
          <div className="rounded-[16px] px-6 py-53 text-center">
            <p className="text-[17px] font-medium">Your cart is empty :(</p>
            <p className="mt-2 font-light text-[15px] text-[#7A716D]">
              Your favorite products await.
            </p>
          </div>
        )}

        {/* cart item */}
        <div className="flex flex-col gap-5">
          {cartItems.map((item) => (
            <article
              key={item.product.id}
              className="rounded-[16px] border border-[#DCD6D3] p-4"
            >
              <div className="flex gap-4">
                <img
                  src={item.product.img}
                  alt={item.product.name}
                  className="h-[100px] w-[100px] rounded-[10px] object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-[17px] font-medium">
                    {item.product.name}
                  </h2>

                  <p className="text-[16px] font-light text-[#707070]">
                    {item.product.category}
                  </p>

                  <p className="mt-4 font-medium text-[23px] text-orange">
                    ${item.product.price.toLocaleString("es-CO")}
                  </p>
                </div>
              </div>

              <div className="my-4 h-px bg-[#B5B3B3]/58" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-orange/80 font-light text-white"
                  >
                    -
                  </button>

                  <span className="text-[15px]">{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.product.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-[6px] font-light bg-orange/80 text-white"
                  >
                    +
                  </button>
                </div>

                <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="flex items-center gap-1 text-[15px] text-[#FF4A4A]"
                    >
                    <TrashIcon className="w-4 h-4" />

                    <span>Remove</span>
                </button>
              </div>
            </article>
          ))}
        </div>

          {/* subtotal */}
          
        <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 rounded-t-[18px] bg-white px-13 py-7 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[16px] font-light">Subtotal</p>
              <p className="text-[28px] leading-none text-orange">
                ${subtotal.toLocaleString("es-CO")}
              </p>
            </div>

            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={() => navigate("/consumer/checkout")}
              className={`h-[50px] rounded-[10px] px-9 text-[16px] font-light text-white ${
                cartItems.length === 0
                  ? "cursor-not-allowed bg-orange/40"
                  : "bg-orange"
              }`}
            >
              Checkout
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Cart;