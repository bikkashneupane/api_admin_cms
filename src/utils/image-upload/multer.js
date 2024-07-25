import multer from "multer";

// directory to save uploaded images
const imgFolderPath = "public/img/product";

// define storage location and filename for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imgFolderPath);
  },
  filename: (req, file, cb) => {
    // make a unique name
    const fullFileName = Date.now() + "-" + file.originalname;
    cb(null, fullFileName);
  },
});

// Initialize Multer with the storage configuration and file filter
const multerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // limit fileseize to 10 MB
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

export default multerUpload;
