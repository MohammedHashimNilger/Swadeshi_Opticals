import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { fetchAdminProducts, deleteProduct } from "../../services/adminProductService";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetchAdminProducts({}).then((data) => setProducts(data.products)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteProduct(id);
    load();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-lg font-medium text-navy-900 dark:text-navy-50">Products</p>
        <Link to="/admin/products/new" className="flex items-center gap-1.5 rounded-lg bg-navy-800 px-3 py-2 text-xs font-medium text-white dark:bg-navy-600">
          <IconPlus size={14} /> Add product
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-navy-100 dark:border-navy-700">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-navy-100 text-navy-400 dark:border-navy-700">
              <th className="p-2.5 font-normal">Name</th>
              <th className="p-2.5 font-normal">Price</th>
              <th className="p-2.5 font-normal">Stock</th>
              <th className="p-2.5 font-normal">Status</th>
              <th className="p-2.5 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-navy-50 last:border-0 dark:border-navy-800">
                <td className="p-2.5 text-navy-700 dark:text-navy-100">{p.name}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{formatCurrency(p.price)}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{p.stock}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{p.isActive ? "Active" : "Hidden"}</td>
                <td className="p-2.5">
                  <div className="flex gap-3">
                    <Link to={`/admin/products/${p.slug}/edit`}><IconEdit size={14} className="text-navy-400" /></Link>
                    <button onClick={() => handleDelete(p._id, p.name)}><IconTrash size={14} className="text-navy-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && products.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-navy-400">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
