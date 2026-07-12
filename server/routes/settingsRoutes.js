import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { adminProtect } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", adminProtect, updateSettings);

export default router;
