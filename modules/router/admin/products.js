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
  productsController.addedProducts
);
router.post(
  "/updateproducts",
  ensureAuthenticated,
  ensureAdmin,
  productsController.getUpdateProducts
);
router.post(
  "/updatedProduct",
  ensureAuthenticated,
  ensureAdmin,
  productsController.updatedProduct
);
router.post(
  "/deleteproducts",
  ensureAuthenticated,
  ensureAdmin,
  productsController.deleteProducts
);

module.exports = router;
