import mongoose from "mongoose";

// Generic atomic counter — used to generate sequential, human-readable
// order IDs (SWO-00001, SWO-00002...) without race conditions, which a
// simple "count existing orders + 1" approach would have under
// concurrent requests.
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

export async function getNextSequence(counterName) {
  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
}
