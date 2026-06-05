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

import ArrowIcon from "../../../assets/arrow.svg?react";
import UploadImageIcon from "../../../assets/upload image.svg?react";

const EditProduct = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { id } = useParams();

  // Validation form state
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
        nextAvailability,
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

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

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
      <main className="app-shell">
        <section className="app-screen pb-16">
          <header className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/entrepreneur/products")}
              className=" flex items-center gap-2 font-light text-[17px] text-black/70 hover:text-black transition-colors"
            >
              <ArrowIcon className="w-4 h-4" />
              <span>Products</span>
            </button>
            <button
              type="button"
              disabled={updatingAvailability}
              onClick={handleToggleAvailability}
              className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-70 ${
                isAvailable ? "bg-blue " : "bg-blue/50"
              }`}
            >
              {isAvailable ? "Available" : "Hidden"}
            </button>
          </header>

          <h2 className="text-2xl font-semibold mb-6">Edit product</h2>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-50 px-4 py-3">
              <p className="font-medium text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="flex flex-col gap-2 text-black">
                Product name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  className="app-field text-sm w-full px-4 py-3 rounded-xl border border-black/10 bg-white font-light focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all"
                />
              </label>

              <label className="flex flex-col gap-2 text-black">
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

            <label className="flex flex-col gap-2 font-medium text-black">
              Product details
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product details, ingredients, etc."
                className="app-field text-sm w-full px-4 py-3 h-32 resize-none rounded-xl border border-black/10 bg-white font-light focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all"
              />
            </label>

            {/* Bloque de Acciones: Guardar y Eliminar unificados en diseño */}
            <div className="mt-2 flex flex-col gap-4">
              <button
                type="button"
                disabled={saving}
                onClick={handleSubmit}
                className={`app-action w-full rounded-xl py-4 text-base font-medium text-white transition-all ${
                  saving
                    ? "bg-maroon/50 cursor-not-allowed"
                    : "bg-maroon hover:bg-maroon/90 active:scale-[0.98]"
                }`}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="w-full rounded-xl py-4 text-base font-medium border border-maroon text-maroon bg-white hover:bg-maroon/5 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete product"}
              </button>
            </div>
          </div>
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
