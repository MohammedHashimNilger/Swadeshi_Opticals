import { useEffect, useState } from "react";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { fetchAdminCategories, createCategory, deleteCategory } from "../../services/adminCategoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetchAdminCategories().then(setCategories).catch((err) => console.error(err));
  }
  useEffect(load, []);

  const topLevel = categories.filter((c) => !c.parentCategory);

  async function handleAdd(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCategory({ name, slug, parentCategory: parentCategory || null });
      setName(""); setSlug(""); setParentCategory("");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this category?")) return;
    await deleteCategory(id);
    load();
  }

  return (
    <div>
      <p className="mb-5 text-lg font-medium text-navy-900 dark:text-navy-50">Categories</p>

      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-navy-100 p-4 dark:border-navy-700">
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <input required placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <select value={parentCategory} onChange={(e) => setParentCategory(e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800">
          <option value="">Top-level category</option>
          {topLevel.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button type="submit" disabled={submitting}
          className="flex items-center gap-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-medium text-white disabled:opacity-60 dark:bg-navy-600">
          <IconPlus size={14} /> Add
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-navy-100 dark:border-navy-700">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-navy-100 text-navy-400 dark:border-navy-700">
              <th className="p-2.5 font-normal">Name</th>
              <th className="p-2.5 font-normal">Slug</th>
              <th className="p-2.5 font-normal">Parent</th>
              <th className="p-2.5 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-b border-navy-50 last:border-0 dark:border-navy-800">
                <td className="p-2.5 text-navy-700 dark:text-navy-100">{c.parentCategory ? "— " : ""}{c.name}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{c.slug}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">
                  {topLevel.find((p) => p._id === c.parentCategory)?.name || "-"}
                </td>
                <td className="p-2.5">
                  <button onClick={() => handleDelete(c._id)}><IconTrash size={14} className="text-navy-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
