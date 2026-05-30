import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getCurrentEntrepreneur } from "../../../services/entrepreneur.service";
import { getProductsByEntrepreneurId } from "../../../services/product.service";
import type { Product } from "../../../types/product.types";
import Loader from "../../../components/common/LoaderEntrepreneur";
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
      <section className="app-screen pb-[140px]">
        <img src={Logo} alt="PickU" className="w-[72px] mt-2 mb-14" />

        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="app-title">My products</h2>
            <p className="app-subtitle mt-1">
              Total {products.length} items.
            </p>
          </div>

        {/* add product */}

          <button
            type="button"
            onClick={() => navigate("/entrepreneur/products/new")}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-maroon text-white transition-all duration-500 active:scale-95"
            >
            <PlusIcon className="h-4 w-4" />
            </button>
        </div>

        {/* product cards */}
        <div className="flex flex-col gap-5">

            {loading && <Loader message="Loading products..." />}

            {!loading && products.length === 0 && (
            <div className="px-6 py-50 text-center">
                <p className="text-[17px] font-medium">No products yet :(</p>
                <p className="mt-2 text-[14px]  font-light text-black/60">
                Create your first product.
                </p>
            </div>
            )}


          {!loading &&
            products.map((product) => (
            <article
              key={product.id}
              className="app-card flex items-center gap-4 p-4"
            >
              <img
                src={product.img}
                alt={product.name}
                className="h-[95px] w-[95px] rounded-xl object-cover"
              />

              <div className="flex-1">
                <h2 className="text-[17px] font-medium">{product.name}</h2>

                <p className="mt-1 line-clamp-2 text-[14px] font-light leading-tight text-black/60">
                  {product.description}
                </p>

                <p className="mt-4 text-[17px] font-medium">
                  ${product.price.toLocaleString("es-CO")}
                </p>
              </div>
            
             {/* edit product */}
              <button
                type="button"
                onClick={() =>
                  navigate(`/entrepreneur/products/edit/${product.id}`)
                }
                className="rounded-full bg-maroon px-7 py-2 text-[14px] font-light text-white transition-all duration-500 active:scale-95"
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
