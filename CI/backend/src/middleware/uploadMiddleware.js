import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.resolve("uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const sanitizedName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${sanitizedName}`);
  }
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
      return cb(null, true);
    }

    return cb(new Error("Only pdf, doc, docx, and txt files are allowed"));
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
