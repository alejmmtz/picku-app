import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoConsumer from "../../assets/logo consumer.png";
import ShoppingCartIcon from "../../assets/shopping cart consumer.svg?react";
import BannerConsumerHome from "../../assets/Banner consumer home.png";
import CheckIcon from "../../assets/check icon.svg?react";
import SearchIcon from "../../assets/Search.svg?react";

import { useAxios } from "../../providers/AxiosProvider";
import { getEntrepreneurs } from "../../services/entrepreneur.service"
import type { Entrepreneur } from "../../types/entrepreneur.types";
import { filterEntrepreneurs } from "../../utils/filterEntrepreneurs"

const ConsumerHome = () => {
  const axios = useAxios();
  const navigate = useNavigate();

  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntrepreneurs = async () => {
      try {
        const data = await getEntrepreneurs(axios);
        setEntrepreneurs(data.filter((entrepreneur) => entrepreneur.is_active));
      } catch (error) {
        console.error("Error loading entrepreneurs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEntrepreneurs();
  }, [axios]);

  const filteredEntrepreneurs = useMemo(() => {
    return filterEntrepreneurs(entrepreneurs, searchTerm);
  }, [entrepreneurs, searchTerm]);

  return (
    <main className="min-h-screen flex justify-center bg-background font-sofia text-black">
      <section className="w-full max-w-[430px] min-h-screen px-7 pt-16 pb-10">
        <header className="flex items-center justify-between mb-7">
          <img src={LogoConsumer} alt="PickU" className="w-[72px]" />

          <button
            type="button"
            onClick={() => navigate("/consumer/cart")}
            className="w-9 h-9 flex items-center justify-center"
          >
            <ShoppingCartIcon className="w-6 h-6" />
          </button>
        </header>

        <section className="mb-5">
          <p className="text-[16px] mb-1 font-light">Welcome back, Jorgi!</p>
          <h2 className="text-[27px] font-bold leading-tight">
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
        className="
        w-full
        h-[54px]
        rounded-[10px]
        border
        border-[#DCD6D3]
        bg-transparent
        pl-11
        pr-5
        text-[13px]
        outline-none
        placeholder:text-[#9B928E]
        focus:border-orange
        "
    />
    </div>

        <img
          src={BannerConsumerHome}
          alt="Explore what's new"
          className="w-full mb-6"
        />

    {/*loader*/}
        <section>
          <h2 className="text-[20px] font-regular mb-4">Open business</h2>

          {loading && (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-orange/20 border-t-orange mt-30"/>
        </div>
        )}

        {!loading && filteredEntrepreneurs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[16px] px-10 mt-30 py-10 text-center">
            <p className="text-[18px] font-medium">No open businesses yet :(</p>
            <p className="mt-2 text-[16px] leading-tight font-light text-[#7A716D]">
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
                className="rounded-[13px] border border-[#DCD6D3] p-3 cursor-pointer transition-all duration-200 hover:border-orange hover:shadow-[0_12px_30px_rgba(255,112,45,0.10)] active:scale-[0.100]"
              >
                <img
                  src={entrepreneur.img}
                  alt={entrepreneur.name}
                  className="w-full h-[106px] object-cover rounded-[10px] mb-3"
                />

                <div className="flex items-center gap-1 mb-1">
                  <h3 className="text-[17px] font-medium">
                    {entrepreneur.name}
                  </h3>
                  <CheckIcon className="w-6 h-6" />
                </div>

                <p className="text-[15px] font-light ext-[#707070] mb-4 line-clamp-1">
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
    </main>
  );
};

export default ConsumerHome;