const express = require("express");
const router = express.Router();

const authController = require("../../controller/web/authController");

router.get("/", authController.getAuthForm);
router.post(
  "/signup",
  authController.registrationFormValidation,
  authController.sortUserData
);
router.post(
    "/login",
    authController.sortUserData
  );

module.exports = router;
