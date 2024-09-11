const Slide = require("../../models/slide");
const Category = require("../../models/category");
const Deal = require("../../models/deal");
const Information = require("../../models/information");

module.exports.getMain = async (req, res) => {
  const slider = await Slide.find();
  const category = await Category.find();
  const deal = await Deal.find();
  const information = await Information.find();

  res.render("frontEnd/pages/firstPage", {
    slider,
    category,
    deal,
    information,
  });
};
