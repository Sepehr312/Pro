const Slide = require("../../models/slide");
const Category = require("../../models/category");
const Deal = require("../../models/deal");
const Information = require("../../models/information");
const Product=require("../../models/product")
const Image=require("../../models/productImage")

module.exports.getMain = async (req, res) => {
  const slider = await Slide.find();
  const category = await Category.find();
  const deal = await Deal.find();
  const information = await Information.find();
  const product = await Product.find().populate("images");

  res.render("frontEnd/pages/products", {
    slider,
    category,
    deal,
    information,
    product
  });
};