import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/common/Loader";

import { useAxios } from "../../../providers/AxiosProvider";
import { getEntrepreneurById } from "../../../services/entrepreneur.service";
import { getProductsByEntrepreneurId } from "../../../services/product.service";

import type { Entrepreneur } from "../../../types/entrepreneur.types";
import type { Product } from "../../../types/product.types";
import ArrowIcon from "../../../assets/arrow.svg?react";
import PhoneIcon from "../../../assets/phone.svg?react";

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
        <section className="app-screen max-h-screen flex items-center justify-center ">
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
      <section className="relative min-h-screen w-full">
        <div className="relative h-96">
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
              className="flex items-center gap-1 rounded-lg font-light bg-white px-3  py-2 text-sm shadow-xs"
            >
              <ArrowIcon className="w-3 h-3" />
              <span>Home</span>
            </button>
          </div>
        </div>

        <section className="-mt-10 relative z-10 min-h-[calc(100vh-290px)] rounded-t-[28px] bg-background px-12 pt-8 pb-10 ">
          <div className="flex flex-col items-start justify-start gap-3 mb-6">
            <div className="flex flex-col items-start justify-start gap-2 w-full mb-4">
              <div className="flex items-center gap-1">
                <h2 className="text-[21px] font-medium">{entrepreneur.name}</h2>
                <CheckIcon className="w-6 h-6" />
              </div>

              <span className="rounded-full border border-orange bg-orange/5 font-light px-4 py-1 text-sm text-orange whitespace-nowrap">
                {entrepreneur.category}
              </span>
            </div>

            <a
              href={`tel:${entrepreneur.contact_info}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-white focus:bg-orange focus:border-orange/0 focus:text-white transition-all duration-300 focus:scale-95 border-2 border-black/15 py-4 font-medium text-black cursor-pointer outline-none"
            >
              <PhoneIcon className="w-4 h-4 fill-current" />
              <span>{entrepreneur.contact_info}</span>
            </a>
          </div>

          <div className="mb-7">
            <h2 className="text-lg mb-2">About</h2>
            <p className="text-[16px] font-light leading-tight text-black/60">
              {entrepreneur.description}
            </p>
          </div>

          <div>
            <h2 className="text-lg  mb-4">Catalog</h2>

            {products.length === 0 && (
              <div className="px-5 py-16 text-center">
                <div className="mb-6 flex min-h-40 items-center justify-center">
                  <img
                    className="block h-auto w-50"
                    src="/resources/Imagen-Login-Consumer.svg"
                    alt="Ilustración de inicio de sesión"
                  />
                </div>
                <p className="text-lg ">Ummm... this is awkward.</p>
                <p className="mt-1 text-sm text-black/50 font-light">
                  This business has no products yet.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {products.map((product) => (
                <article
                  onClick={() => navigate(`/consumer/product/${product.id}`)}
                  key={product.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border border-black/15 bg-white p-4 ${
                    !product.is_available ? "opacity-60" : ""
                  }`}
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium line-clamp-1">{product.name}</h3>

                    <p className="text-sm leading-tight font-light text-black/60 line-clamp-1">
                      {product.description}
                    </p>

                    <p className="mt-2 text-lg font-medium">
                      ${product.price.toLocaleString("es-CO")}
                    </p>
                  </div>
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
