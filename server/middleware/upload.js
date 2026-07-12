import multer from "multer";
import cloudinary from "../config/cloudinary.js";

// Files are held in memory (not written to disk) — required for
// serverless environments where the filesystem isn't reliably writable,
// and simpler since we stream straight to Cloudinary anyway.
const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed."), false);
};

// For prescriptions: images OR PDF, max 5MB, per the SRS.
const prescriptionFileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, PNG, or PDF files are allowed."), false);
};

export const uploadProductImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 6);

export const uploadBannerImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export const uploadPrescriptionFile = multer({
  storage,
  fileFilter: prescriptionFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB, per SRS
}).single("prescriptionFile");

/**
 * Uploads a single in-memory file buffer to Cloudinary and resolves
 * with the resulting secure URL. `resource_type: "auto"` lets Cloudinary
 * correctly handle PDFs as well as images (used for prescriptions).
 */
export function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
