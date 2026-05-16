import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAxios } from "../../../providers/AxiosProvider";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductAvailability,
} from "../../../services/product.service";
import { uploadProductImage } from "../../../services/storage.service";
import ConfirmModal from "../../../components/common/ConfirmModal";


import Logo from "../../../assets/logo entrepeneur color.svg";
import ArrowIcon from "../../../assets/arrow.svg?react";
import UploadImageIcon from "../../../assets/upload image.svg?react";

const EditProduct = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { id } = useParams();

  // validation form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currentImg, setCurrentImg] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const product = await getProductById(axios, id);

        setName(product.name);
        setPrice(String(product.price));
        setCurrentImg(product.img);
        setImagePreview(product.img);
        setDescription(product.description);
        setIsAvailable(product.is_available);
      } catch (error) {
        console.error("Error loading product:", error);
        setError("Could not load product.");
      }
    };

    loadProduct();
  }, [axios, id]);

  const handleImageUpload = (file?: File) => {
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!name.trim()) return "Product name is required.";
    if (!price || Number(price) <= 0) return "Product price is required.";
    if (!imagePreview) return "Product photo is required.";
    if (!description.trim()) return "Product details are required.";

    return "";
  };

  const handleToggleAvailability = async () => {
  if (!id || updatingAvailability) return;

  const nextAvailability = !isAvailable;

  try {
    setUpdatingAvailability(true);
    setError("");

    const updatedProduct = await updateProductAvailability(
      axios,
      id,
      nextAvailability
    );

    setIsAvailable(updatedProduct.is_available);
  } catch (error) {
    console.error("Error updating availability:", error);
    setError("Could not update product availability.");
  } finally {
    setUpdatingAvailability(false);
  }
};

  const handleSubmit = async () => {
    if (!id) return;

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const imageUrl = imageFile
        ? await uploadProductImage(imageFile)
        : currentImg;

      await updateProduct(axios, id, {
        name: name.trim(),
        price: Number(price),
        img: imageUrl,
        description: description.trim(),
      });

      navigate("/entrepreneur/products");
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  //only opens the modal
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  //actually deletes after confirmation
  const confirmDeleteProduct = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProduct(axios, id);
      navigate("/entrepreneur/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Could not delete product. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <main className="min-h-screen flex justify-center text-black">
        <section className="w-full max-w-[430px] min-h-screen px-13 pt-16">
          <header className="mb-7 flex items-center justify-between">
            <img src={Logo} alt="PickU" className="w-[72px]" />

            <button
              type="button"
              disabled={updatingAvailability}
              onClick={handleToggleAvailability}
              className={`flex min-h-[40px] min-w-[92px] items-center justify-center rounded-[10px] px-[18px] text-[14px] font-regular text-white transition-opacity disabled:opacity-70 ${
                isAvailable ? "bg-[#48aa00]" : "bg-[#9d9d9d]"
              }`}
            >
              {isAvailable ? "Available" : "Hidden"}
            </button>
          </header>

          <button
            type="button"
            onClick={() => navigate("/entrepreneur/products")}
            className="mb-2 flex items-center gap-2 text-[17px]"
          >
            <ArrowIcon className="w-4 h-4" />
            <span>Products</span>
          </button>

          <h2 className="mb-7 text-[28px] font-semibold">Edit product</h2>

          {error && (
            <p className="mb-4 rounded-[10px] border border-maroon px-4 py-3 text-[14px] text-maroon">
              {error}
            </p>
          )}

          {/* product name */}
          <div className="mb-5 grid grid-cols-[1fr_120px] gap-4">
            <label className="flex flex-col gap-2 text-[15px]">
              Product name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-[56px] rounded-[10px] border border-maroon bg-transparent px-4 outline-none"
              />
            </label>

            {/* product price */}
            <label className="flex flex-col gap-2 text-[15px]">
              Product price
              <input
                type="number"
                min="1"
                step="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-[56px] rounded-[10px] border border-maroon mr-2.5 bg-transparent px-4 outline-none"
              />
            </label>
          </div>

          {/* upload image */}
          <label className="mb-6 flex flex-col gap-2 text-[15px]">
            Upload photo

            <input
              id="edit-product-image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
              className="hidden"
            />

            <label
              htmlFor="edit-product-image"
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

          {/* product details */}
          <label className="flex flex-col gap-2 text-[15px]">
            Product details
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-[126px] resize-none rounded-[10px] border border-maroon bg-transparent px-4 py-4 outline-none"
            />
          </label>

          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className={`mt-12 h-[58px] w-full rounded-[10px] text-[16px] text-white ${
              saving ? "cursor-not-allowed bg-maroon/50" : "bg-maroon"
            }`}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="mt-4 h-[58px] w-full rounded-[10px] border border-maroon text-[16px] text-maroon disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete product"}
          </button>
        </section>
      </main>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete product?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteProduct}
      />
    </>
  );
};

export default EditProduct;