import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-navy-100 p-3.5 dark:border-navy-800">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-navy-50 dark:bg-navy-800">
        {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-navy-700 dark:text-navy-200">{item.name}</p>
        <p className="mt-0.5 text-sm font-medium text-navy-900 dark:text-navy-50">
          {formatCurrency(item.price)}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-navy-200 px-3 py-1.5 text-xs dark:border-navy-700">
        <button
          aria-label="Decrease quantity"
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          className="text-navy-400 transition hover:text-navy-800 dark:hover:text-navy-100"
        >
          <IconMinus size={12} />
        </button>
        <span className="w-3 text-center text-navy-700 dark:text-navy-100">{item.quantity}</span>
        <button
          aria-label="Increase quantity"
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="text-navy-400 transition hover:text-navy-800 dark:hover:text-navy-100"
        >
          <IconPlus size={12} />
        </button>
      </div>

      <button
        aria-label="Remove item"
        onClick={() => onRemove(item.productId)}
        className="text-navy-300 transition hover:text-red-500"
      >
        <IconTrash size={17} />
      </button>
    </div>
  );
}
