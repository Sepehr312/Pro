const express = require("express");
const router = express.Router();

const { ensureAuthenticated, ensureAdmin } = require("../../middlewares/auth");

router.get("/",ensureAuthenticated,
    ensureAdmin,(req,res)=>{
    res.render("admin/pages/products")
});

module.exports = router;
