import { getNextSequence } from "../models/Counter.js";

export async function generateOrderId() {
  const seq = await getNextSequence("orderId");
  return `SWO-${String(seq).padStart(5, "0")}`;
}
