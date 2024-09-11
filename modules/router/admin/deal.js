const express = require("express");
const router = express.Router();

const dealController = require("../../controller/admin/dealController");
const { uploadDealImage } = require("../../middlewares/uploadedMiddleware");

//SHOW
router.get("/", dealController.getDeal);

//ADD
router.get("/adddeal", dealController.getForm);
router.post(
  "/sortedeal",
  uploadDealImage.any(),
  dealController.addDealFormValidatoin,
  dealController.sorteDeal
);

//DELETE
router.post("/deletedeal", uploadDealImage.any(), dealController.deleteDeal);

//UPDATE
router.get("/updatedeal", dealController.getUpdateForm);
router.post(
  "/updateddeal",
  uploadDealImage.any(),
  dealController.updateDealFormValidatoin,
  dealController.updateDeal
);

module.exports = router;
