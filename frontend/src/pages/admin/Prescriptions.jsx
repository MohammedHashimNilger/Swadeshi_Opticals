import { useEffect, useState } from "react";
import { fetchPrescriptions, approvePrescription, rejectPrescription } from "../../services/adminPrescriptionService";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");

  function load() {
    fetchPrescriptions(statusFilter ? { status: statusFilter } : {}).then(setPrescriptions).catch((err) => console.error(err));
  }

  useEffect(load, [statusFilter]);

  async function handleApprove(id) {
    await approvePrescription(id);
    load();
  }
  async function handleReject(id) {
    const reviewNote = window.prompt("Reason for rejection:") || "";
    await rejectPrescription(id, reviewNote);
    load();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-lg font-medium text-navy-900 dark:text-navy-50">Prescriptions</p>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-navy-200 px-2 py-1.5 text-xs dark:border-navy-700 dark:bg-navy-800">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-navy-100 dark:border-navy-700">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-navy-100 text-navy-400 dark:border-navy-700">
              <th className="p-2.5 font-normal">Order</th>
              <th className="p-2.5 font-normal">Customer</th>
              <th className="p-2.5 font-normal">Method</th>
              <th className="p-2.5 font-normal">Status</th>
              <th className="p-2.5 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p._id} className="border-b border-navy-50 last:border-0 dark:border-navy-800">
                <td className="p-2.5 text-navy-700 dark:text-navy-100">{p.order?.orderId}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{p.user?.name}</td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">
                  {p.method === "file" ? (
                    <a href={p.fileUrl} target="_blank" rel="noreferrer" className="underline">View file</a>
                  ) : (
                    <span title={p.note}>Note</span>
                  )}
                </td>
                <td className="p-2.5 text-navy-500 dark:text-navy-300">{p.status}</td>
                <td className="p-2.5">
                  {p.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(p._id)} className="rounded border border-navy-300 px-2 py-1 dark:border-navy-600">Approve</button>
                      <button onClick={() => handleReject(p._id)} className="rounded border border-navy-300 px-2 py-1 dark:border-navy-600">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {prescriptions.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-navy-400">No prescriptions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
