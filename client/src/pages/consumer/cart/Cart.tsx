import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../providers/CartProvider";
import { useAxios } from "../../../providers/AxiosProvider"; // Importado
import { getEntrepreneurById } from "../../../services/entrepreneur.service"; // Importado

import ArrowIcon from "../../../assets/arrow.svg?react";
import TrashIcon from "../../../assets/trash.svg?react";

const Cart = () => {
  const navigate = useNavigate();
  const axios = useAxios(); // Inicializado

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
  } = useCart();

  const [entrepreneurNames, setEntrepreneurNames] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchNames = async () => {
      const uniqueIds = Array.from(
        new Set(cartItems.map((item) => item.product.entrepreneur_id)),
      );

      const idsToFetch = uniqueIds.filter((id) => !entrepreneurNames[id]);
      if (idsToFetch.length === 0) return;

      try {
        const updatedNames = { ...entrepreneurNames };

        await Promise.all(
          idsToFetch.map(async (id) => {
            const data = await getEntrepreneurById(axios, id);
            updatedNames[id] = data.name; // Guardamos el nombre
          }),
        );

        setEntrepreneurNames(updatedNames);
      } catch (error) {
        console.error("Error fetching entrepreneur names in cart:", error);
      }
    };

    if (cartItems.length > 0) {
      fetchNames();
    }
  }, [cartItems, axios, entrepreneurNames]);

  return (
    <main className="app-shell">
      <section className="app-screen pb-32">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 font-light text-[17px]"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>Go back</span>
        </button>

        <h2 className="app-title mb-8">My cart</h2>

        {cartItems.length === 0 && (
          <div className="px-5 py-16 text-center">
            <div className="mb-6 flex h-full items-center justify-center">
              <img
                className="block h-auto w-40"
                src="/resources/sad.svg"
                alt="Ilustración de inicio de sesión"
              />
            </div>
            <p className="text-lg ">So alone here...</p>
            <p className="mt-1 text-sm text-black/50 font-light">
              Your favorite picks are waiting for you!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-5 bg-white">
          {cartItems.map((item) => (
            <article key={item.product.id} className="app-card p-4">
              <div className="flex gap-4">
                <img
                  src={item.product.img}
                  alt={item.product.name}
                  className="h-25 w-25 rounded-xl object-cover"
                />

                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-[17px] font-medium">
                      {item.product.name}
                    </h2>

                    <p className="text-sm font-light text-black/50 line-clamp-1">
                      {entrepreneurNames[item.product.entrepreneur_id] ||
                        "from..."}
                    </p>
                  </div>

                  <p className="font-medium text-[23px] text-orange mt-1">
                    ${item.product.price.toLocaleString("es-CO")}
                  </p>
                </div>
              </div>

              <div className="my-4 h-px bg-black/10" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="flex p-3 pb-4 leading-0 font-bold items-center justify-center rounded-lg bg-orange  text-white transition-all duration-500 active:scale-95"
                  >
                    -
                  </button>

                  <span className="text-lg text-center w-4">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.product.id)}
                    className="flex p-3 pb-4 leading-0 font-bold items-center justify-center rounded-lg bg-orange  text-white transition-all duration-500 active:scale-95"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="flex items-center gap-1 text-[15px] font-light text-[#d83b3b] transition-all duration-500 active:scale-95"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="fixed bottom-0 left-1/2 w-full -translate-x-1/2 rounded-t-2xl border-t border-black/10 bg-white px-12 py-7 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg ">Subtotal</p>
              <p className="text-2xl leading-none text-orange">
                ${subtotal.toLocaleString("es-CO")}
              </p>
            </div>

            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={() => navigate("/consumer/checkout")}
              className={`app-action px-9 text-[16px] ${
                cartItems.length === 0 ? "bg-orange/40" : "bg-orange"
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
