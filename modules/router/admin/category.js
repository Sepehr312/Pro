const express = require("express");
const router = express.Router();

const categoryController = require("../../controller/admin/categoryController");
const { uploadCategotyImage } = require("../../middlewares/uploadedMiddleware");

//TABLE
router.get("/", categoryController.getCategory);

//ADD
router.get("/addcategory", categoryController.getForm);
router.post(
  "/sortecategory",
  uploadCategotyImage.any(),
  categoryController.addCategoryFormValidatoin,
  categoryController.sorteCategory
);
 
//DELETE
router.post(
  "/deletecategory",
  uploadCategotyImage.any(),
  categoryController.deletecategory
);

//UPDATE
router.get("/updatecategory", categoryController.getUpdateForm);
router.post(
  "/updatedcategory",
  uploadCategotyImage.any(),

  categoryController.addCategoryFormValidatoin,

  categoryController.updateCategory
);

module.exports = router;
