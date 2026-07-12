import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories } from "../../services/categoryService";
import { fetchAdminProductBySlug, createProduct, updateProduct } from "../../services/adminProductService";

const GENDERS = ["Men", "Women", "Kids", "Unisex"];

const EMPTY_FORM = {
  name: "", slug: "", description: "", price: "", discountPrice: "", stock: "",
  prescriptionRequired: false,
  categories: [],
  specifications: { frameSize: "", frameMaterial: "", lensType: "", gender: "Unisex", brand: "", color: "", weight: "", dimensions: "" },
};

export default function ProductForm() {
  const { productId: slug } = useParams(); // route param is named productId but we pass the slug
  const isEditMode = !!slug;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [existingProductId, setExistingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories().then(setCategories).catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    fetchAdminProductBySlug(slug).then((product) => {
      setExistingProductId(product._id);
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: product.price,
        discountPrice: product.discountPrice || "",
        stock: product.stock,
        prescriptionRequired: product.prescriptionRequired,
        categories: product.categories.map((c) => c._id || c),
        specifications: { ...EMPTY_FORM.specifications, ...product.specifications },
      });
    }).catch((err) => console.error(err));
  }, [slug, isEditMode]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  function updateSpec(field, value) {
    setForm((prev) => ({ ...prev, specifications: { ...prev.specifications, [field]: value } }));
  }
  function toggleCategory(id) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("discountPrice", form.discountPrice || "");
      formData.append("stock", form.stock);
      formData.append("prescriptionRequired", form.prescriptionRequired);
      formData.append("categories", JSON.stringify(form.categories));
      formData.append("specifications", JSON.stringify(form.specifications));
      imageFiles.forEach((file) => formData.append("images", file));

      if (isEditMode) {
        await updateProduct(existingProductId, formData);
      } else {
        await createProduct(formData);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="mb-5 text-lg font-medium text-navy-900 dark:text-navy-50">
        {isEditMode ? "Edit product" : "Add product"}
      </p>

      <form onSubmit={handleSubmit} className="grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
        <input required placeholder="Product name" value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800 md:col-span-2" />

        <input required placeholder="Slug (url-friendly-name)" value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800 md:col-span-2" />

        <input required type="number" placeholder="Price" value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />

        <input type="number" placeholder="Discount price (optional)" value={form.discountPrice}
          onChange={(e) => updateField("discountPrice", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />

        <input required type="number" placeholder="Stock quantity" value={form.stock}
          onChange={(e) => updateField("stock", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />

        <label className="flex items-center gap-2 text-xs text-navy-600 dark:text-navy-300">
          <input type="checkbox" checked={form.prescriptionRequired}
            onChange={(e) => updateField("prescriptionRequired", e.target.checked)} />
          Prescription required
        </label>

        <textarea placeholder="Description" value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800 md:col-span-2" rows={3} />

        <div className="md:col-span-2">
          <p className="mb-1.5 text-xs font-medium text-navy-600 dark:text-navy-300">Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <label key={c._id} className="flex items-center gap-1.5 rounded border border-navy-200 px-2 py-1 text-xs dark:border-navy-700">
                <input type="checkbox" checked={form.categories.includes(c._id)} onChange={() => toggleCategory(c._id)} />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        <select value={form.specifications.gender} onChange={(e) => updateSpec("gender", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800">
          {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <input placeholder="Brand" value={form.specifications.brand} onChange={(e) => updateSpec("brand", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <input placeholder="Frame material" value={form.specifications.frameMaterial} onChange={(e) => updateSpec("frameMaterial", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <input placeholder="Frame size" value={form.specifications.frameSize} onChange={(e) => updateSpec("frameSize", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <input placeholder="Lens type" value={form.specifications.lensType} onChange={(e) => updateSpec("lensType", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <input placeholder="Color" value={form.specifications.color} onChange={(e) => updateSpec("color", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <input placeholder="Weight" value={form.specifications.weight} onChange={(e) => updateSpec("weight", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <input placeholder="Dimensions" value={form.specifications.dimensions} onChange={(e) => updateSpec("dimensions", e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />

        <div className="md:col-span-2">
          <p className="mb-1.5 text-xs font-medium text-navy-600 dark:text-navy-300">
            Product images {isEditMode && "(new images are added to existing ones)"}
          </p>
          <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files))}
            className="text-xs" />
        </div>

        {error && <p className="text-xs text-red-600 md:col-span-2">{error}</p>}

        <button type="submit" disabled={submitting}
          className="rounded-lg bg-navy-800 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-navy-600 md:col-span-2">
          {submitting ? "Saving..." : "Save product"}
        </button>
      </form>
    </div>
  );
}
