import { useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { fetchAllBanners, createBanner, deleteBanner, updateBanner } from "../../services/adminBannerService";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetchAllBanners().then(setBanners).catch((err) => console.error(err));
  }
  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("linkUrl", linkUrl);
    if (startDate) formData.append("startDate", startDate);
    if (endDate) formData.append("endDate", endDate);
    try {
      await createBanner(formData);
      setTitle(""); setLinkUrl(""); setStartDate(""); setEndDate(""); setFile(null);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(banner) {
    const formData = new FormData();
    formData.append("isActive", !banner.isActive);
    await updateBanner(banner._id, formData);
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this banner?")) return;
    await deleteBanner(id);
    load();
  }

  return (
    <div>
      <p className="mb-5 text-lg font-medium text-navy-900 dark:text-navy-50">Banners</p>

      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-navy-100 p-4 dark:border-navy-700">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <input placeholder="Link URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
          className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        <div>
          <label className="mb-1 block text-[10px] text-navy-400">Start date (optional)</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        </div>
        <div>
          <label className="mb-1 block text-[10px] text-navy-400">End date (optional)</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="rounded border border-navy-200 px-3 py-2 text-sm dark:border-navy-700 dark:bg-navy-800" />
        </div>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-xs" />
        <button type="submit" disabled={submitting || !file}
          className="rounded-lg bg-navy-800 px-4 py-2 text-xs font-medium text-white disabled:opacity-60 dark:bg-navy-600">
          {submitting ? "Uploading..." : "Add banner"}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {banners.map((b) => (
          <div key={b._id} className="overflow-hidden rounded-lg border border-navy-100 dark:border-navy-700">
            <img src={b.imageUrl} alt={b.title} className="aspect-video w-full object-cover" />
            <div className="flex items-center justify-between p-2 text-xs">
              <label className="flex items-center gap-1.5 text-navy-500 dark:text-navy-300">
                <input type="checkbox" checked={b.isActive} onChange={() => toggleActive(b)} /> Active
              </label>
              <button onClick={() => handleDelete(b._id)}><IconTrash size={14} className="text-navy-400" /></button>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-xs text-navy-400">No banners yet.</p>}
      </div>
    </div>
  );
}
