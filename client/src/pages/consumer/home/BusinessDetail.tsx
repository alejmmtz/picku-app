import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/common/Loader";

import { useAxios } from "../../../providers/AxiosProvider";
import { getEntrepreneurById } from "../../../services/entrepreneur.service";
import { getProductsByEntrepreneurId } from "../../../services/product.service";

import type { Entrepreneur } from "../../../types/entrepreneur.types";
import type { Product } from "../../../types/product.types";
import ArrowIcon from "../../../assets/arrow.svg?react";

import CheckIcon from "../../../assets/check icon.svg?react";


const BusinessDetail = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { id } = useParams();

  const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusinessDetail = async () => {
      if (!id) return;

      try {
        const businessData = await getEntrepreneurById(axios, id);
        const productsData = await getProductsByEntrepreneurId(axios, id);

        setEntrepreneur(businessData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading business detail:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinessDetail();
  }, [axios, id]);

  if (loading) {
  return (
    <main className="app-shell">
      <section className="app-screen flex items-center justify-center">
        <Loader message="Loading business..." />
      </section>
    </main>
  );
}

  if (!entrepreneur) {
    return (
      <main className="app-shell">
        <section className="app-screen flex flex-col items-center justify-center text-center">
          <p className="text-[18px] font-medium">Business not found</p>
          <button
            type="button"
            onClick={() => navigate("/consumer/home")}
            className="mt-4 rounded-full bg-orange px-6 py-2 text-white"
          >
            Go back
          </button>
        </section>
      </main>
    );
  }
  

  return (
    <main className="app-shell">
      <section className="relative min-h-screen w-full max-w-[430px] overflow-hidden">
        <div className="relative h-[300px]">
          <img
            src={entrepreneur.img}
            alt={entrepreneur.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-white/30" />

          <div className="absolute left-8 top-14">

          <button
            type="button"
            onClick={() => navigate("/consumer/home")}
            className="flex items-center gap-1 rounded-full font-light bg-white/80 px-3 ml-4 py-1 text-[13px] shadow-sm"
          >
            <ArrowIcon className="w-3 h-3" />
            <span>Home</span>
          </button>
          </div>
        </div>

      {/* information card */}
        <section className="-mt-10 relative z-10 min-h-[calc(100vh-290px)] rounded-t-[28px] bg-background px-12 pt-8 pb-10 ">
          <div className="flex items-start justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-1 mb-5">
                <h2 className="text-[21px] font-medium">
                  {entrepreneur.name}
                </h2>
                <CheckIcon className="w-6 h-6" />
              </div>

              <span className="rounded-full  border border-orange bg-orange/6 font-light px-4 py-1 text-[15px] text-orange">
                {entrepreneur.category}
              </span>
            </div>

            <p className="text-[15px] font-light mt-1 text-[#85827F]">
              {entrepreneur.contact_info}
            </p>
          </div>

          <div className="mb-7">
            <h2 className="text-[17px] font-light mb-2">About</h2>
            <p className="text-[16px] font-light leading-tight text-black/60">
              {entrepreneur.description}
            </p>
          </div>

          <div>
            <h2 className="text-[17px] font-light mb-4">Catalog</h2>

            {/* products */}
            {products.length === 0 && (
              <div className="px-5 py-35 text-center">
                <p className="text-[15px] font-medium">
                  No products available :(
                </p>
                <p className="mt-1 text-[13px] text-black/60 font-light">
                  This business has no products yet.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {products.map((product) => (
                <article
                key={product.id}
                className={`flex items-center gap-3 rounded-xl border border-black/15 p-3 ${
                  !product.is_available ? "opacity-60" : ""
                }`}
>
                  <img
                    src={product.img}
                    alt={product.name}
                    className="h-[78px] w-[78px] rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-medium line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-[13px] leading-tight font-light text-black/60 line-clamp-2">
                      {product.description}
                    </p>

                    <p className="mt-2 text-[15px] font-medium">
                      ${product.price.toLocaleString("es-CO")}
                    </p>
                  </div>

                  
                  {product.is_available ? (
                  
                  <button
                    type="button"
                    onClick={() => navigate(`/consumer/product/${product.id}`)}
                    className="rounded-full bg-orange px-4 py-2 text-[12px] font-light text-white"
                  >
                    More info
                  </button>
                ) : (
                  <span className="rounded-full border border-black/15 px-4 py-2 text-[11px] font-light text-[#85827F]">
                    Not available
                  </span>
                )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default BusinessDetail;