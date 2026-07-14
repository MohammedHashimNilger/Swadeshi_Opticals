import express from "express";
import {
  getPrescriptions,
  approvePrescription,
  rejectPrescription,
} from "../controllers/prescriptionController.js";
import { adminProtect } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", adminProtect, getPrescriptions);
router.put("/:id/approve", adminProtect, approvePrescription);
router.put("/:id/reject", adminProtect, rejectPrescription);

export default router;
