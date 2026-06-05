import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAxios } from "../../../providers/AxiosProvider";
import { getCurrentEntrepreneur } from "../../../services/entrepreneur.service";
import { createProduct } from "../../../services/product.service";
import { uploadProductImage } from "../../../services/storage.service";

import ArrowIcon from "../../../assets/arrow.svg?react";
import UploadImageIcon from "../../../assets/upload image.svg?react";

const AddProduct = () => {
  const api = useAxios();
  const navigate = useNavigate();

  const [entrepreneurId, setEntrepreneurId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [loadingEntrepreneur, setLoadingEntrepreneur] = useState(true);

  useEffect(() => {
    const loadEntrepreneur = async () => {
      try {
        const entrepreneur = await getCurrentEntrepreneur(api);
        setEntrepreneurId(entrepreneur.id);
      } catch (error) {
        console.error("Error loading entrepreneur profile:", error);

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate("/entrepreneur/onboarding", { replace: true });
        } else {
          setError("Could not load your business profile.");
        }
      } finally {
        setLoadingEntrepreneur(false);
      }
    };

    void loadEntrepreneur();
  }, [api, navigate]);

  const handleImageUpload = (file?: File) => {
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!entrepreneurId) return "Complete your business profile first.";
    if (!name.trim()) return "Product name is required.";
    if (!price || Number(price) <= 0) return "Product price is required.";
    if (!imageFile) return "Product photo is required.";
    if (!description.trim()) return "Product details are required.";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setCreating(true);
      setError("");

      const imageUrl = await uploadProductImage(imageFile as File);

      await createProduct(api, {
        entrepreneur_id: entrepreneurId as string,
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        // Temporary category
        category: "General",
        img: imageUrl,
      });

      navigate("/entrepreneur/products");
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Could not create product. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="app-screen pb-16">
        <header className="flex flex-col items-start mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 font-light text-[17px]"
          >
            <ArrowIcon className="w-4 h-4" />
            <span>Go back</span>
          </button>
        </header>

        <h2 className="text-2xl font-semibold mb-6">Create new product</h2>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-50 px-4 py-3">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-2  text-black">
              Product name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className="app-field text-sm w-full px-4 py-3 rounded-xl border border-black/10 bg-white font-light focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all"
              />
            </label>

            <label className="flex flex-col gap-2  text-black">
              Price
              <input
                required
                type="number"
                min="1"
                step="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Make it fair!"
                className="app-field text-sm w-full px-4 py-3 rounded-xl border border-black/10 bg-white font-light focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all"
              />
            </label>
          </div>

          <label className="flex flex-col gap-4 text-black">
            Upload photo
            <input
              id="edit-product-image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
              className="hidden"
            />
            <div
              className="relative flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-maroon bg-white/25 transition-all duration-300 hover:border-maroon/60"
              onClick={() =>
                document.getElementById("edit-product-image")?.click()
              }
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-maroon">
                  <UploadImageIcon className="h-10 w-10" />
                  <span className="text-sm font-light">Tap to upload</span>
                </div>
              )}
            </div>
          </label>

          <label className="flex flex-col gap-2  font-medium text-black">
            Product details
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product details, ingredients, etc."
              className="app-field text-sm w-full px-4 py-3 h-32 resize-none rounded-xl border border-black/10 bg-white font-light focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all"
            />
          </label>

          <button
            type="button"
            disabled={creating || loadingEntrepreneur}
            onClick={handleSubmit}
            className={`app-action mt-2 w-full rounded-xl py-4 text-base font-medium text-white transition-all ${
              creating || loadingEntrepreneur
                ? "bg-maroon/50 cursor-not-allowed"
                : "bg-maroon hover:bg-maroon/90 active:scale-[0.98]"
            }`}
          >
            {loadingEntrepreneur
              ? "Loading..."
              : creating
                ? "Creating..."
                : "Create new product"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default AddProduct;
