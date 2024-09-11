const express = require("express");
const router = express.Router();
const informationController = require("../../controller/admin/informationController");

router.get("/", informationController.getInformation);
router.get("/addinformation", informationController.getForm);
router.post(
  "/sortinformation",
  informationController.addInformationFormValidation,
  informationController.sortInformation
);
router.post("/deleteinformation", informationController.deleteInformation);
router.get("/updateinformation", informationController.getUpdateForm);
router.post(
  "/updatedinformation",
  informationController.updateInformationFormValidation,
  informationController.updateInformation
);

module.exports = router;