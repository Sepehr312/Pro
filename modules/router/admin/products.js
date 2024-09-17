const express = require("express");
const router = express.Router();

const productsController = require("../../controller/admin/productsController");
const { uploadProductsImage } = require("../../middlewares/uploadedMiddleware");
const { ensureAuthenticated, ensureAdmin } = require("../../middlewares/auth");

router.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  productsController.getProducts
);
router.get(
  "/addproducts",
  ensureAuthenticated,
  ensureAdmin,
  productsController.getAddProductsForm
);
router.post(
  "/uploderproductsimage",
  ensureAuthenticated,
  ensureAdmin,
  uploadProductsImage.single('image'),
  productsController.uploadFile
);
router.post(
  "/deleteproductsimage",
  ensureAuthenticated,
  ensureAdmin,
  uploadProductsImage.any(),
  productsController.deleteFile
);
router.post(
  "/addedproducts",
  ensureAuthenticated,
  ensureAdmin,
  productsController.addedproducts
);
router.post(
  "/deleteproducts",
  ensureAuthenticated,
  ensureAdmin,
  productsController.deleteproducts
);
 
module.exports = router;
