const multer = require("multer");
const mkdirp = require("mkdirp");
const path = require("path");
function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
const productsImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = path.join(__dirname, "../../uploads/products");
    mkdirp.sync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    let extension = path.extname(file.originalname);
    cb(null, Date.now() + makeid(30) + extension.toLowerCase());
  },
});

const slideImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = path.join(__dirname, "../../uploads/slider");
    mkdirp.sync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    let extension = path.extname(file.originalname);
    cb(null, Date.now() + makeid(30) + extension.toLowerCase());
  },
});

const categotyImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = path.join(__dirname, "../../uploads/category");
    mkdirp.sync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    let extension = path.extname(file.originalname);
    cb(null, Date.now() + makeid(30) + extension.toLowerCase());
  },
});

const dealImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = path.join(__dirname, "../../uploads/deal");
    mkdirp.sync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    let extension = path.extname(file.originalname);
    cb(null, Date.now() + makeid(30) + extension.toLowerCase());
  },
});

const uploadProductsImage = multer({
  storage: productsImageStorage,
});
const uploadSlideImage = multer({
  storage: slideImageStorage,
});
const uploadCategotyImage = multer({
  storage: categotyImageStorage,
});
const uploadDealImage = multer({
  storage: dealImageStorage,
});

//EXPORT
module.exports = {
  uploadProductsImage,
  uploadSlideImage,
  uploadCategotyImage,
  uploadDealImage,
};
