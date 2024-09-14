const express = require("express");
const router = express.Router();

const dealController = require("../../controller/admin/dealController");
const { uploadDealImage } = require("../../middlewares/uploadedMiddleware");
const { ensureAuthenticated, ensureAdmin } = require("../../middlewares/auth");

//SHOW
router.get("/", ensureAuthenticated, ensureAdmin, dealController.getDeal);

//ADD
router.get(
  "/adddeal",
  ensureAuthenticated,
  ensureAdmin,
  dealController.getForm
);
router.post(
  "/sortedeal",
  ensureAuthenticated,
  ensureAdmin,
  uploadDealImage.any(),
  dealController.addDealFormValidatoin,
  dealController.sorteDeal
);

//DELETE
router.post(
  "/deletedeal",
  ensureAuthenticated,
  ensureAdmin,
  uploadDealImage.any(),
  dealController.deleteDeal
);

//UPDATE
router.get(
  "/updatedeal",
  ensureAuthenticated,
  ensureAdmin,
  dealController.getUpdateForm
);
router.post(
  "/updateddeal",
  ensureAuthenticated,
  ensureAdmin,
  uploadDealImage.any(),
  dealController.updateDealFormValidatoin,
  dealController.updateDeal
);

module.exports = router;
