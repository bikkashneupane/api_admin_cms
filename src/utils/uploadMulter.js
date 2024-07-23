// import multer from "multer";

// const imgFolderPath = "public/img/product";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let error = null;
//     //
//     cb(error, imgFolderPath);
//   },
//   filename: (req, file, cb) => {
//     let error = "";
//     // make a unique name
//     const fullFileName = Date.now() + "-" + file.originalname;
//     cb(error, fullFileName);
//   },
// });

// const limits = {
//   fileSize: 10 * 1024 * 1024, // limit fileseize to 10 MB
// };

// // const fileFilter =

// const multerUpload = multer({ storage, limits });

// export default multerUpload;

import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// configure cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "vikiasmy-watches",
    allowed_formats: ["jpg", "png", "gif", "webp"],
  },
});

// multer upload
const multerUpload = multer({ storage });

export default multerUpload;
