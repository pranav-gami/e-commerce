import multer from "multer";
import path from "path";

//STORAGE OBJECT
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";
    if (req.originalUrl.includes("/user")) {
      folder = "users";
    } else if (req.originalUrl.includes("/products")) {
      folder = "products";
    } else if (req.originalUrl.includes("/category")) {
      folder = "categories";
    }
    cb(null, `public/assets/media/${folder}`);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

//FILE FILTER
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only JPG images are allowed"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
