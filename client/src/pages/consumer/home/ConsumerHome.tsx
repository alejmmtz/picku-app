import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoConsumer from "../../../assets/logo consumer.png";
import ShoppingCartIcon from "../../../assets/shopping cart consumer.svg?react";
import BannerConsumerHome from "../../../assets/Banner_consumer_home.svg";
import Muffy from "../../../assets/muffy.svg";

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

const getTimeOfDay = (): "morning" | "afternoon" | "night" => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
};

// Categorías unificadas para el mapeo del carrusel
const CATEGORIES = [
  "All",
  "Meals",
  "Drinks",
  "Snacks",
  "Desserts & sweets",
  "Clothing & accessories",
  "Crafts",
  "Beauty & personal care",
  "Art",
  "Stationery",
  "Services",
  "Technology",
];

const ConsumerHome = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [consumerName, setConsumerName] = useState(getStoredConsumerName);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const timeOfDay = useMemo(() => getTimeOfDay(), []);

  useEffect(() => {
    const loadEntrepreneurs = async () => {
      try {
        const productsData = await getProducts(axios);
        setProducts(productsData);

        const data = await getEntrepreneurs(axios);
        setEntrepreneurs(data.filter((entrepreneur) => entrepreneur.is_active));

        const profileResponse =
          await axios.get<UserProfile>("/picku/api/auth/me");
        setConsumerName(profileResponse.data.name);
      } catch (error) {
        console.error("Error loading entrepreneurs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEntrepreneurs();
  }, [axios]);

  // Modificado para filtrar por término de búsqueda Y por categoría seleccionada
  const filteredEntrepreneurs = useMemo(() => {
    const searchFiltered = filterEntrepreneurs(
      entrepreneurs,
      products,
      searchTerm,
    );

    if (selectedCategory === "All") {
      return searchFiltered;
    }

    return searchFiltered.filter(
      (entrepreneur) =>
        entrepreneur.category?.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [entrepreneurs, products, searchTerm, selectedCategory]);

  return (
    <main className="app-shell">
      <section className="app-screen mb-16">
        <header className="flex items-center justify-between mb-8">
          <img src={LogoConsumer} alt="PickU" className="w-16 " />

          <button
            type="button"
            onClick={() => navigate("/consumer/cart")}
            className="flex items-center justify-center"
          >
            <ShoppingCartIcon className="w-6 h-6" />
          </button>
        </header>

        <section className="mb-4">
          <p className="text-lg font-light">Welcome back, {consumerName}!</p>
          <h2 className="app-title text-2xl">How's your {timeOfDay}?</h2>
        </section>
        <img
          src={BannerConsumerHome}
          alt="Explore what's new"
          className="w-full mb-6 rounded-lg shadow-sm"
        />

        {/*search input*/}
        <div className="relative mb-2">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />

          <input
            type="text"
            placeholder="Search for a business..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border-2 border-black/25 bg-black/5  focus:bg-black/0 py-4 pl-12 pr-4 text-sm font-light outline-none transition-all duration-500 placeholder:text-black focus:border-orange focus:shadow-[0_0_0_3px_rgba(255,112,45,0.12)]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 -mx-4 px-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-light whitespace-nowrap transition-all duration-300 border ${
                  isActive
                    ? "bg-orange text-white border-orange "
                    : "bg-black/5 text-black/70 border-transparent hover:bg-black/10"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4 pt-2">Open Businesses</h2>

          {loading && <Loader message="Searching for Picks..." />}

          {!loading && filteredEntrepreneurs.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl px-8 py-16 text-center">
              <img
                src={Muffy}
                alt="Explore what's new"
                className="w-full mb-6"
              />
              <p className="text-[18px] font-medium">No businesses found...</p>
              <p className="mt-2 text-[16px] leading-tight font-light text-black/60">
                Try asking muffy what's wrong.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {filteredEntrepreneurs.map((entrepreneur) => (
              <article
                key={entrepreneur.id}
                onClick={() =>
                  navigate(`/consumer/business/${entrepreneur.id}`)
                }
                className="app-card cursor-pointer p-3 transition-all bg-white duration-500 hover:border-orange hover:shadow-[0_12px_30px_rgba(255,112,45,0.10)] active:scale-95"
              >
                <img
                  src={entrepreneur.img}
                  alt={entrepreneur.name}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />

                <div className="flex items-center gap-2 ">
                  <h3 className="text-lg font-medium">{entrepreneur.name}</h3>
                  <CheckIcon className="w-6 h-6" />
                </div>

                <p className="mb-6 line-clamp-2 text-sm font-light text-black/50">
                  {entrepreneur.description}
                </p>

                <div className="flex items-end justify-between">
                  <p className="text-sm font-light">
                    By: {entrepreneur.owner_name ?? "Student"}
                  </p>

                  <span className="rounded-full bg-orange/6 border border-orange px-4 py-1 font-light text-sm text-orange">
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
