import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads/documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const filefilter = (req, file, cb) => {
  if (file.minetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF file are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFiter: filefilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485768,
  },
});
export default upload;
