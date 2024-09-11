const express = require("express");
const router = express.Router();

const mainController = require("../../controller/web/mainController");

router.get("/", (req, res) => {
    mainController.getMain(req, res);
});

module.exports = router;
