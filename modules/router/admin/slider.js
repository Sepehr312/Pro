const express = require("express");
const router = express.Router();

const sliderController = require("../../controller/admin/sliderController");
const { uploadSlideImage } = require("../../middlewares/uploadedMiddleware");
const { ensureAuthenticated, ensureAdmin } = require("../../middlewares/auth");

router.get("/", ensureAuthenticated, ensureAdmin, sliderController.getSlider);
router.post(
  "/slideruploadimage",
  ensureAuthenticated,
  ensureAdmin,
  uploadSlideImage.any(),
  sliderController.uploadFile
);
router.post(
  "/updateslides",
  ensureAuthenticated,
  ensureAdmin,
  uploadSlideImage.any(),
  sliderController.saveOrUpdateSlider
);
router.post(
  "/deleteslide",
  ensureAuthenticated,
  ensureAdmin,
  uploadSlideImage.any(),
  sliderController.deleteSlide
);

module.exports = router;
