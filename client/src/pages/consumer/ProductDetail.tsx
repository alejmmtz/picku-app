import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../../components/common/Loader";
import { useAxios } from "../../providers/AxiosProvider";
import { useCart } from "../../providers/CartProvider";
import { getProductById } from "../../services/product.service";
import type { Product } from "../../types/product.types";
import Button from "../../components/common/Button";

import ArrowIcon from "../../assets/arrow.svg?react";
import ShoppingCartWhiteIcon from "../../assets/shopping cart white.svg?react";

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
      <main className="min-h-screen flex justify-center bg-background font-sofia">
        <section className="w-full max-w-[430px] min-h-screen flex items-center justify-center">
          <Loader message="Loading product..." />
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex justify-center bg-background font-sofia">
        <section className="w-full max-w-[430px] min-h-screen flex flex-col items-center justify-center px-8 text-center">
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

  //cart :3
  const handleAddToCart = () => {
  if (!product.is_available) return;

  addToCart(product);

  navigate("/consumer/cart");
};


  return (
    <main className="min-h-screen flex justify-center bg-background font-sofia text-black">
      <section className="relative w-full max-w-[430px] min-h-screen overflow-hidden">
        <div className="relative h-[330px]">
          <img
            src={product.img}
            alt={product.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-white/20" />

          <div className="absolute left-8 top-14">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 rounded-full bg-white/80 ml-4 px-3 py-1 text-[13px] shadow-sm"
            >
              <ArrowIcon className="w-3 h-3" />
              <span>Back</span>
            </button>
          </div>
        </div>

         {/*product information*/}
         
        <section className="-mt-10 relative z-10 min-h-[calc(100vh-290px)] rounded-t-[28px] bg-background px-13 pt-8 pb-10">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-[21px] font-medium">{product.name}</h2>

              <p className="mt-1 text-[32px] leading-none font-regular text-orange">
                ${product.price.toLocaleString("es-CO")}
              </p>
            </div>

            <span
              className={`rounded-full bg-[#B1EE9F]/20 border px-4 py-1 text-[15px] font-light ${
                product.is_available
                  ? "border-[#3D7B00] text-[#3D7B00]"
                  : "border-[#DCD6D3] text-[#85827F]"
              }`}
            >
              {product.is_available ? "Available" : "Not available"}
            </span>
          </div>

          <div className="mb-32">
            <h2 className="text-[17px] font-regular mb-3">Description</h2>

            <p className="text-[16px] leading-tight font-light text-[#707070]">
              {product.description}
            </p>
          </div>

          <div className="absolute left-10 right-10 bottom-10 flex flex-col gap-4">

            {/*add to cart button*/}
            <Button
              disabled={!product.is_available}
              onClick={handleAddToCart}
              icon={<ShoppingCartWhiteIcon className="w-5 h-5" />}
            >
              Add to cart
            </Button>

          </div>
        </section>
      </section>
    </main>
  );
};

export default ProductDetail;