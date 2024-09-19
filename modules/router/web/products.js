const express = require("express");
const router = express.Router();

const productsController = require("../../controller/web/productsController");

router.get("/", productsController.getMain);

module.exports = router;
