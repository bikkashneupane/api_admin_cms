import multer from "multer";

const imgFolderPath = "public/img/product";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = null;
    //
    cb(error, imgFolderPath);
  },
  filename: (req, file, cb) => {
    let error = "";
    // make a unique name
    const fullFileName = Date.now() + "-" + file.originalname;
    cb(error, fullFileName);
  },
});

const limits = {
  fileSize: 10 * 1024 * 1024, // limit fileseize to 10 MB
};

// const fileFilter =

const multerUpload = multer({ storage, limits });

export default multerUpload;
