import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../providers/AxiosProvider";
import { getProductsByEntrepreneurId } from "../../../services/product.service";
import type { Product } from "../../../types/product.types";
import Loader from "../../../components/common/LoaderEntrepreneur";

import Logo from "../../../assets/logo entrepeneur color.svg";
import PlusIcon from "../../../assets/plus icon.svg?react";

const EntrepreneurProducts = () => {
  const axios = useAxios();
  const navigate = useNavigate();

  //temporal, luego toca cambiarlo con el log in
  const entrepreneurId = import.meta.env.VITE_TEMP_ENTREPRENEUR_ID;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await getProductsByEntrepreneurId(axios, entrepreneurId);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, [axios, entrepreneurId]);

  return (
    <main className="min-h-screen flex justify-center bg-background text-black">
      <section className="w-full max-w-[430px] min-h-screen px-13 pt-16 pb-20">
        <img src={Logo} alt="PickU" className="w-[72px] mb-14" />

        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-[28px] font-semibold">My products</h2>
            <p className="text-[16px] mt-1 font-light text-[#9C9BA6]">
              Total {products.length} items.
            </p>
          </div>

        {/* add product */}

          <button
            type="button"
            onClick={() => navigate("/entrepreneur/products/new")}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-maroon text-white"
            >
            <PlusIcon className="h-4 w-4" />
            </button>
        </div>

        {/* product cards */}
        <div className="flex flex-col gap-5">

            {loading && <Loader message="Loading products..." />}

            {!loading && products.length === 0 && (
            <div className="rounded-[16px] border border-[#DCD6D3] px-6 py-10 text-center">
                <p className="text-[17px] font-medium">No products yet</p>
                <p className="mt-2 text-[14px]  font-light text-[#7A716D]">
                Create your first product.
                </p>
            </div>
            )}


          {!loading &&
            products.map((product) => (
            <article
              key={product.id}
              className="flex items-center gap-4 rounded-[16px] border border-[#DCD6D3] p-4"
            >
              <img
                src={product.img}
                alt={product.name}
                className="h-[95px] w-[95px] rounded-[10px] object-cover"
              />

              <div className="flex-1">
                <h2 className="text-[17px] font-medium">{product.name}</h2>

                <p className="mt-1 line-clamp-2 font-light text-[14px] leading-tight text-[#85827F]">
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
                className="rounded-full bg-maroon px-7 py-2 text-[14px] text-white"
              >
                Edit
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default EntrepreneurProducts;