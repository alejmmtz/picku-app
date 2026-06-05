import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../../../components/common/Loader";
import { useAxios } from "../../../providers/AxiosProvider";
import { useCart } from "../../../providers/CartProvider";
import { getProductById } from "../../../services/product.service";
import type { Product } from "../../../types/product.types";
import Button from "../../../components/common/Button";

import ArrowIcon from "../../../assets/arrow.svg?react";
import ShoppingCartWhiteIcon from "../../../assets/shopping cart white.svg?react";

const ProductDetail = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const data = await getProductById(axios, id);
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [axios, id]);

  if (loading) {
    return (
      <main className="app-shell">
        <section className="app-screen flex items-center justify-center">
          <Loader message="Loading product..." />
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="app-shell">
        <section className="app-screen flex flex-col items-center justify-center text-center">
          <p className="text-[18px] font-medium">Product not found</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 rounded-full bg-orange px-6 py-2 text-white"
          >
            Go back
          </button>
        </section>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!product.is_available) return;
    addToCart(product);
    navigate("/consumer/cart");
  };

  return (
    <main className="app-shell">
      <section className="relative min-h-screen w-full  flex flex-col bg-background overflow-y-auto">
        <div className="relative h-96 w-full ">
          <img
            src={product.img}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-white/10" />

          <div className="absolute left-8 top-14">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 rounded-lg font-light bg-white px-3  py-2 text-sm shadow-xs"
            >
              <ArrowIcon className="w-3 h-3" />
              <span>Back</span>
            </button>
          </div>
        </div>

        <div className="-mt-10 relative z-10 flex-1 rounded-t-[28px] bg-background px-12 pt-8 pb-10 flex flex-col justify-between gap-8">
          <div>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0 flex-1">
                <h2 className="text-[22px] font-medium text-black leading-tight ">
                  {product.name}
                </h2>
                <p className="mt-2 text-3xl font-semibold text-orange">
                  ${product.price.toLocaleString("es-CO")}
                </p>
              </div>

              <span
                className={`rounded-full border px-4 py-1 text-[13px] font-light whitespace-nowrap ${
                  product.is_available
                    ? "bg-[#3D7B00]/5 border-[#3D7B00] text-[#3D7B00]"
                    : "bg-black/5 border-black/15 text-black/55"
                }`}
              >
                {product.is_available ? "Available" : "Not available"}
              </span>
            </div>

            <div>
              <h3 className="text-[17px] font-medium mb-2 text-black">
                Description
              </h3>
              <p className="text-[15px] font-light leading-relaxed text-black/60">
                {product.description}
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col justify-center text-sm font-medium mt-auto">
            <Button
              disabled={!product.is_available}
              onClick={handleAddToCart}
              icon={<ShoppingCartWhiteIcon className="w-4 h-4" />}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
