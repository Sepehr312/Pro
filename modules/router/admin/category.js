const express = require("express");
const router = express.Router();

const categoryController = require("../../controller/admin/categoryController");
const { uploadCategotyImage } = require("../../middlewares/uploadedMiddleware");
const { ensureAuthenticated, ensureAdmin } = require("../../middlewares/auth");

//TABLE
router.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.getCategory
);

//ADD
router.get(
  "/addcategory",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.getForm
);
router.post(
  "/sortecategory",
  ensureAuthenticated,
  ensureAdmin,
  uploadCategotyImage.any(),
  categoryController.addCategoryFormValidatoin,
  categoryController.sorteCategory
);

//DELETE
router.post(
  "/deletecategory",
  ensureAuthenticated,
  ensureAdmin,
  uploadCategotyImage.any(),
  categoryController.deletecategory
);

//UPDATE
router.get(
  "/updatecategory",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.getUpdateForm
);
router.post(
  "/updatedcategory",
  ensureAuthenticated,
  ensureAdmin,
  uploadCategotyImage.any(),
  categoryController.addCategoryFormValidatoin,
  categoryController.updateCategory
);

module.exports = router;
