const express = require("express");
const router = express.Router();

const mainController = require("../../controller/web/mainController");
const { ensureUser, ensureAuthenticated } = require("../../middlewares/auth");

router.get("/",   
    (req, res) => {
    mainController.getMain(req, res);
});

module.exports = router;
