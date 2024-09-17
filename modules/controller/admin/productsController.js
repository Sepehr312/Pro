const fs = require("fs");
const Category = require("../../models/category");
module.exports.getProducts = (req, res) => {
  res.render("admin/pages/products");
};
module.exports.getAddProductsForm = async (req, res) => {
  const category = await Category.find();
  res.render("admin/pages/newProducts", { category });
};
module.exports.uploadFile = (req, res) => {
  console.log(req.file);
  res.json({
    success: true, 
    data: req.file.filename,
    message: "Image uploaded successfully",
    filePath: req.file.path,
  });
};
module.exports.deleteFile = (req, res) => {
  const { filePath } = req.body;
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting file" });
    }
    res.json({ message: "File deleted successfully" });
  });
};
