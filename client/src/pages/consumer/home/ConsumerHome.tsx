import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoConsumer from "../../../assets/logo consumer.png";
import ShoppingCartIcon from "../../../assets/shopping cart consumer.svg?react";
import BannerConsumerHome from "../../../assets/Banner consumer home.png";
import CheckIcon from "../../../assets/check icon.svg?react";
import SearchIcon from "../../../assets/Search.svg?react";

import { useAxios } from "../../../providers/AxiosProvider";
import { getEntrepreneurs } from "../../../services/entrepreneur.service";
import { getProducts } from "../../../services/product.service";
import type { Entrepreneur } from "../../../types/entrepreneur.types";
import type { Product } from "../../../types/product.types";
import { filterEntrepreneurs } from "../../../utils/filterEntrepreneurs";
import Loader from "../../../components/common/Loader";
import BottomNav from "../../../components/common/BottomNav";
import { getStoredAuth } from "../../../utils/storage";

type UserProfile = {
  name: string;
};

const getStoredConsumerName = () => {
  const name = getStoredAuth()?.user.user_metadata?.name;
  return typeof name === "string" && name.trim() ? name.trim() : "there";
};

const ConsumerHome = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [consumerName, setConsumerName] = useState(getStoredConsumerName);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntrepreneurs = async () => {
      try {
        const productsData = await getProducts(axios);
        setProducts(productsData);

        const data = await getEntrepreneurs(axios);
        setEntrepreneurs(data.filter((entrepreneur) => entrepreneur.is_active));

        const profileResponse = await axios.get<UserProfile>("/picku/api/auth/me");
        setConsumerName(profileResponse.data.name);
      } catch (error) {
        console.error("Error loading entrepreneurs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEntrepreneurs();
  }, [axios]);

  const filteredEntrepreneurs = useMemo(() => {
  return filterEntrepreneurs(entrepreneurs, products, searchTerm);
}, [entrepreneurs, products, searchTerm]);

  return (
    <main className="app-shell">
      <section className="app-screen pb-[140px]">
        <header className="flex items-center justify-between mb-7">
          <img src={LogoConsumer} alt="PickU" className="w-[72px] " />

          <button
            type="button"
            onClick={() => navigate("/consumer/cart")}
            className="w-9 h-9 flex items-center justify-center"
          >
            <ShoppingCartIcon className="w-6 h-6" />
          </button>
        </header>

        <section className="mb-5">
          <p className="text-[16px] mb-1 font-light">
            Welcome back, {consumerName}!
          </p>
          <h2 className="app-title">
            Discover your next pick
          </h2>
        </section>

        {/*search input*/}
       <div className="relative mb-6">
    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />

    <input
        type="text"
        placeholder="Search for business..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="h-[54px] w-full rounded-xl border border-black/15 bg-transparent pl-11 pr-5 text-[13px] font-light outline-none transition-all duration-500 placeholder:text-black/50 focus:border-orange focus:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]"
    />
    </div>

        <img
          src={BannerConsumerHome}
          alt="Explore what's new"
          className="w-full mb-6"
        />

    {/*loader*/}
        <section>
          <h2 className="text-[20px] font-light mb-4">Open business</h2>

          {loading && (
        <Loader message="Finding open businesses..." />
        )}

        {!loading && filteredEntrepreneurs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl px-10 mt-30 py-10 text-center">
            <p className="text-[18px] font-medium">No open businesses yet :(</p>
            <p className="mt-2 text-[16px] leading-tight font-light text-black/60">
            Try again later.
            </p>
        </div>
        )}

            {/*card entrepreneur*/}
          <div className="flex flex-col gap-5">
            {filteredEntrepreneurs.map((entrepreneur) => (
              <article
                key={entrepreneur.id}
                onClick={() =>
                  navigate(`/consumer/business/${entrepreneur.id}`)
                }
                className="app-card cursor-pointer p-3 transition-all duration-500 hover:border-orange hover:shadow-[0_12px_30px_rgba(255,112,45,0.10)] active:scale-95"
              >
                <img
                  src={entrepreneur.img}
                  alt={entrepreneur.name}
                  className="w-full h-[106px] object-cover rounded-xl mb-3"
                />

                <div className="flex items-center gap-1 mb-1">
                  <h3 className="text-[17px] font-medium">
                    {entrepreneur.name}
                  </h3>
                  <CheckIcon className="w-6 h-6" />
                </div>

                <p className="mb-4 line-clamp-1 text-[15px] font-light text-black/60">
                  {entrepreneur.description}
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-light">
                    By: {entrepreneur.owner_name ?? "Student"}
                  </p>

                  <span className="rounded-full bg-orange/6 border border-orange px-4 py-1 font-light text-[15px] text-orange">
                    {entrepreneur.category}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <BottomNav variant="consumer" />
    </main>
  );
};

export default ConsumerHome;
