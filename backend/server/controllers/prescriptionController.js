import Prescription from "../models/Prescription.js";

// GET /api/admin/prescriptions?status=pending
export async function getPrescriptions(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const prescriptions = await Prescription.find(filter)
      .sort("-createdAt")
      .populate("order", "orderId customerName")
      .populate("user", "name phone");
    res.json(prescriptions);
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/prescriptions/:id/approve
export async function approvePrescription(req, res, next) {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status: "approved", reviewedAt: new Date() },
      { new: true }
    );
    if (!prescription) return res.status(404).json({ message: "Prescription not found." });
    res.json(prescription);
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/prescriptions/:id/reject  { reviewNote }
export async function rejectPrescription(req, res, next) {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", reviewedAt: new Date(), reviewNote: req.body.reviewNote || "" },
      { new: true }
    );
    if (!prescription) return res.status(404).json({ message: "Prescription not found." });
    res.json(prescription);
  } catch (err) {
    next(err);
  }
}
