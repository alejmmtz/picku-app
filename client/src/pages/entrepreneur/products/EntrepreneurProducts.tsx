import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getCurrentEntrepreneur } from "../../../services/entrepreneur.service";
import { getProductsByEntrepreneurId } from "../../../services/product.service";
import type { Product } from "../../../types/product.types";
import Loader from "../../../components/common/Loader"; // Componente Loader estandarizado
import BottomNav from "../../../components/common/BottomNav";

import Logo from "../../../assets/logo entrepeneur color.svg";
import PlusIcon from "../../../assets/plus icon.svg?react";

const EntrepreneurProducts = () => {
  const api = useAxios();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const entrepreneur = await getCurrentEntrepreneur(api);
        const data = await getProductsByEntrepreneurId(api, entrepreneur.id);
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate("/entrepreneur/onboarding", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [api, navigate]);

  return (
    <main className="app-shell">
      <section className="app-screen mb-16">
        <header className="flex items-center justify-between mb-6">
          <img
            src={Logo}
            onClick={() => navigate("/consumer/home")}
            alt="PickU"
            className="w-16 cursor-pointer"
          />
        </header>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-black">My products</h2>
            <p className=" text-black/60 font-light mt-2">
              Total {products.length} items.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/entrepreneur/products/new")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon text-white transition-all hover:bg-maroon/90 active:scale-95"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {loading && <Loader message="Loading your products..." />}

          {!loading && products.length === 0 && (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-full items-center justify-center">
                <img
                  className="block h-auto w-40"
                  src="/resources/sad.svg"
                  alt="No orders available"
                />
              </div>
              <p className="text-[18px] font-medium text-black">
                No products yet!
              </p>
              <p className="mt-1 text-[15px] font-light text-black/50">
                What are you waiting for to?
              </p>
            </div>
          )}

          {!loading &&
            products.map((product) => (
              <article
                key={product.id}
                className="bg-white app-card p-4 flex flex-col gap-2 items-center transition-all duration-300 active:scale-[0.99]"
              >
                <div className="flex flex-row w-full gap-2">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="h-24 w-24 rounded-xl object-cover shrink-0 bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-medium truncate">
                      {product.name}
                    </h2>
                    <p className="mt-1 line-clamp-1 text-sm font-light text-black/60">
                      {product.description}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-black">
                      ${product.price.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/entrepreneur/products/edit/${product.id}`)
                  }
                  className="rounded-lg app-action w-full bg-maroon px-6 py-2 text-sm font-medium text-white transition-all active:scale-95 shrink-0"
                >
                  Edit
                </button>
              </article>
            ))}
        </div>
      </section>

      <BottomNav variant="entrepreneur" />
    </main>
  );
};

export default EntrepreneurProducts;
