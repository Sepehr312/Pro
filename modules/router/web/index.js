const express = require("express");
const router = express.Router();


const main=require("./main")
const auth=require("./auth")

router.use((req, res, next) => {
    req.app.set('layout',  "frontEnd/layouts/mainLayout.ejs");
    next();
  });

router.use("/",main)
router.use("/auth",auth)

module.exports = router;   