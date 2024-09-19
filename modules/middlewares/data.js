const Slide = require("../models/slide");
const Category = require("../models/category");
const Deal = require("../models//deal");
const Information = require("../models/information");
const Product = require("../models/product");

module.exports = async (req, res, next) => {
  try {
    // دریافت داده‌ها از دیتابیس
    const slider = await Slide.find();
    const category = await Category.find();
    const deal = await Deal.find();
    const information = await Information.find();
    const product = await Product.find().populate("images");

    res.locals.slider = slider;
    res.locals.category = category;
    res.locals.deal = deal;
    res.locals.information = information;
    res.locals.product = product;
    next();
  } catch (error) {
    console.error("Error fetching data:", error);
    next(error);
  }
};
