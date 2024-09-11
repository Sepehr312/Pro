const express = require("express");
const router = express.Router();

const sliderController = require("../../controller/admin/sliderController");
const { uploadSlideImage } = require("../../middlewares/uploadedMiddleware");

router.get("/", sliderController.getSlider);
router.post(
  "/slideruploadimage",
  uploadSlideImage.any(),
  sliderController.uploadFile
);
router.post(
  "/updateslides",
  uploadSlideImage.any(),
  sliderController.saveOrUpdateSlider
);
router.post(
  "/deleteslide",
  uploadSlideImage.any(),
  sliderController.deleteSlide
);

module.exports = router;
