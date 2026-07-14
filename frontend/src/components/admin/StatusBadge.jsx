const COLORS = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Shipped: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Delivered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Cancelled: "bg-navy-100 text-navy-500 dark:bg-navy-800 dark:text-navy-400",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${COLORS[status] || COLORS.Cancelled}`}>
      {status}
    </span>
  );
}
