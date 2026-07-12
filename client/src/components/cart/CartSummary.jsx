import { formatCurrency } from "../../utils/formatCurrency";

export default function CartSummary({
  subtotal,
  deliveryCharge,
  onCheckout,
  buttonLabel = "Proceed to checkout",
}) {
  const total = subtotal + deliveryCharge;

  return (
    <div className="h-fit rounded-2xl border border-navy-100 p-5 dark:border-navy-800">
      <p className="mb-4 font-display text-base font-medium text-navy-900 dark:text-navy-50">
        Order summary
      </p>

      <div className="flex justify-between text-xs text-navy-500 dark:text-navy-400">
        <span>Subtotal</span>
        <span className="text-navy-700 dark:text-navy-200">
          {formatCurrency(subtotal)}
        </span>
      </div>
      <div className="mt-2 flex justify-between text-xs text-navy-500 dark:text-navy-400">
        <span>Delivery</span>
        <span className="text-navy-700 dark:text-navy-200">
          {formatCurrency(deliveryCharge)}
        </span>
      </div>
      <div className="mt-3 flex justify-between border-t border-navy-100 pt-3 text-sm font-medium text-navy-900 dark:border-navy-800 dark:text-navy-50">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      {onCheckout && (
        <button
          onClick={onCheckout}
          className="mt-5 w-full rounded-full bg-navy-900 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 dark:bg-navy-300 dark:text-navy-900 dark:hover:bg-navy-400"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
