const express = require("express");
const router = express.Router();

const home=require("./home")
const products=require("./products")
const slider=require("./slider")
const category=require("./category")
const deal=require("./deal")
const information=require("./information")

router.use((req, res, next) => {
    req.app.set("layout", "admin/layouts/dashboardLayout.ejs");
    next();
  });
  
router.use("/dashboard",home)
router.use("/products",products)
router.use("/slider",slider)
router.use("/category",category)
router.use("/deal",deal)
router.use("/information",information)

module.exports = router;