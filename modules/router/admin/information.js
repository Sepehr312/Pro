const express = require("express");
const router = express.Router();

const informationController = require("../../controller/admin/informationController");
const { ensureAuthenticated, ensureAdmin } = require("../../middlewares/auth");

router.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  informationController.getInformation
);
router.get(
  "/addinformation",
  ensureAuthenticated,
  ensureAdmin,
  informationController.getForm
);
router.post(
  "/sortinformation",
  ensureAuthenticated,
  ensureAdmin,
  informationController.addInformationFormValidation,
  informationController.sortInformation
);
router.post(
  "/deleteinformation",
  ensureAuthenticated,
  ensureAdmin,
  informationController.deleteInformation
);
router.get(
  "/updateinformation",
  ensureAuthenticated,
  ensureAdmin,
  informationController.getUpdateForm
);
router.post(
  "/updatedinformation",
  ensureAuthenticated,
  ensureAdmin,
  informationController.updateInformationFormValidation,
  informationController.updateInformation
);

module.exports = router;
