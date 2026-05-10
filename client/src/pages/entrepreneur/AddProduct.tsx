import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAxios } from "../../providers/AxiosProvider";
import { createProduct } from "../../services/product.service";
import { uploadProductImage } from "../../services/storage.service";

import Logo from "../../assets/logo entrepeneur color.svg";
import ArrowIcon from "../../assets/arrow.svg?react";
import UploadImageIcon from "../../assets/upload image.svg?react";

const AddProduct = () => {
  const axios = useAxios();
  const navigate = useNavigate();

  const entrepreneurId = import.meta.env.VITE_TEMP_ENTREPRENEUR_ID;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  //handle image upload
  const handleImageUpload = (file?: File) => {
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  //form validation
  const validateForm = () => {
    if (!entrepreneurId) return "Missing entrepreneur id.";

    if (!name.trim()) {
      return "Product name is required.";
    }

    if (!price || Number(price) <= 0) {
      return "Product price is required.";
    }

    if (!imageFile) {
      return "Product photo is required.";
    }

    if (!description.trim()) {
      return "Product details are required.";
    }

    return "";
  };

  //create product
  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setCreating(true);
      setError("");

      //upload image to supabase storage
      const imageUrl = await uploadProductImage(imageFile as File);

      //create product in database
      await createProduct(axios, {
        entrepreneur_id: entrepreneurId,
        name: name.trim(),
        price: Number(price),
        description: description.trim(),

        //temporary category
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
    <main className="min-h-screen flex justify-center text-black">
      <section className="w-full max-w-[430px] min-h-screen px-13 pt-16 pb-10">

        <img src={Logo} alt="PickU" className="w-[72px] mb-10" />

        <button
          type="button"
          onClick={() => navigate("/entrepreneur/products")}
          className="mb-2 flex items-center gap-2 text-[17px] font-regular"
        >
          <ArrowIcon className="w-4 h-4" />

          <span>Products</span>
        </button>

        <h2 className="mb-8 text-[28px] font-semibold">
          Create new product
        </h2>

        {error && (
          <p className="mb-4 rounded-[10px] border border-maroon px-4 py-3 text-[14px] text-maroon">
            {error}
          </p>
        )}

        <div className="mb-5 grid grid-cols-[1fr_120px] gap-4">
          {/* product name */}
          <label className="flex flex-col gap-2 text-[15px]">
            Product name

            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="h-[56px] w-[190px] rounded-[10px] border border-maroon bg-transparent px-4 outline-none"
            />
          </label>

          {/* product price */}
          <label className="flex flex-col gap-2 text-[15px]">
            Product price

            <input
              required
              type="number"
              min="1"
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="h-[56px] rounded-[10px] border border-maroon bg-transparent px-4 outline-none"
            />
          </label>
        </div>

        {/* upload image */}
        <label className="mb-6 flex flex-col gap-2 text-[15px]">
          Upload photo

          <input
            required
            id="product-image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files?.[0])}
            className="hidden"
          />

          <label
            htmlFor="product-image"
            className="relative flex h-[170px] cursor-pointer items-center justify-center overflow-hidden rounded-[18px] border-2 border-dashed border-maroon/30 bg-maroon/5"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <UploadImageIcon className="h-16 w-16 text-maroon" />
            )}
          </label>
        </label>

        {/* description */}
        <label className="flex flex-col gap-2 text-[15px]">
          Product details

          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter details"
            className="h-[126px] resize-none rounded-[10px] border border-maroon bg-transparent px-4 py-4 outline-none"
          />
        </label>

        {/* button */}
        <button
          type="button"
          disabled={creating}
          onClick={handleSubmit}
          className={`mt-26 h-[58px] w-full rounded-[10px] text-[16px] text-white ${
            creating ? "cursor-not-allowed bg-maroon/50" : "bg-maroon"
          }`}
        >
          {creating ? "Creating..." : "Create new product"}
        </button>
      </section>
    </main>
  );
};

export default AddProduct;