import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { fetchCustomers } from "../../services/adminCustomerService";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers(search).then(setCustomers).catch((err) => console.error(err));
  }, [search]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-lg font-medium text-navy-900 dark:text-navy-50">Customers</p>
        <div className="flex items-center gap-2 rounded border border-navy-200 px-2 py-1.5 text-xs dark:border-navy-700">
          <IconSearch size={14} className="text-navy-400" />
          <input placeholder="Search customers" value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none dark:text-navy-100" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-navy-100 dark:border-navy-700">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-navy-100 text-navy-400 dark:border-navy-700">
              <th className="p-2.5 font-normal">Name</th>
              <th className="p-2.5 font-normal">Email</th>
              <th className="p-2.5 font-normal">Phone</th>
              <th className="p-2.5 font-normal">Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b border-navy-50 last:border-0 dark:border-navy-800">
                <td className="p-2.5 text-navy-700 dark:text-navy-100">{c.name}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{c.email}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{c.phone || "-"}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{c.orderCount}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-center text-navy-400">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
