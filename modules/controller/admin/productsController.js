const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const Product = require("../../models/product");
const Image = require("../../models/productImage");
const Category = require("../../models/category");

module.exports.getProducts = async (req, res) => {
  const { category } = req.query;
  let query = {};

  if (category) {
    query.category = category;
  }

  const product = await Product.find(query).populate("images");
  const categories = await Category.find();
  res.render("admin/pages/products", { product, categories });
};
//IMAGE
module.exports.uploadFile = (req, res) => {
  res.json({
    success: true,
    data: req.file.filename,
    message: "Image uploaded successfully",
    filePath: req.file.path,
  });
};
module.exports.deleteFile = async (req, res) => {
  const { filePath } = req.body;
  const fullFilePath = path.join(
    __dirname,
    "../../../uploads/products/",
    filePath
  );

  try {
    await fs.promises.access(fullFilePath, fs.constants.F_OK);
  } catch (accessErr) {
    console.error("فایل موجود نیست یا دسترسی به آن ممکن نیست:", accessErr);
    return res.status(404).json({ success: false, message: "فایل پیدا نشد" });
  }
  try {
    await fs.promises.unlink(fullFilePath);
    return res
      .status(200)
      .json({ success: true, message: "فایل با موفقیت حذف شد!" });
  } catch (unlinkErr) {
    console.error("خطا در حذف فایل:", unlinkErr);
    return res
      .status(500)
      .json({ success: false, message: "حذف فایل با شکست مواجه شد." });
  }
};
//ADD
module.exports.getAddProductsForm = async (req, res) => {
  const category = await Category.find();
  res.render("admin/pages/newProducts", { category });
};
module.exports.addedproducts = async (req, res) => {
  const { name, description, price, category, images } = req.body;

  try {
    // ذخیره تصاویر و گرفتن IDs آن‌ها
    const imageIds = await Promise.all(
      images.map(async (filename) => {
        const image = new Image({ filename });
        await image.save();
        return image._id;
      })
    );

    // ساخت یک محصول جدید
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images: imageIds, // ارجاع به تصاویر
    });

    // ذخیره محصول در دیتابیس
    const product = await newProduct.save();
    res.status(201).json({
      success: true,
      data: product,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({
      success: false,
      message: "Error saving product",
    });
  }
};
//DELETE
module.exports.deleteproducts = async (req, res) => {
    console.log(req.body);
    try {
    const id = req.body;
    console.log(id);
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "id محصول ارسال نشده است." });
    }
    const product = await Product.findById(id).populate("images");
    if (product) {
      if (product.images && product.images.length > 0) {
        product.images.forEach(async (image) => {
          const imagePath = path.join(
            __dirname,
            "../../../uploads/products/",
            image.filename
          );
          try {
            fs.unlinkSync(imagePath);
            console.log(`Image ${image.filename} deleted successfully`);
            await Image.findByIdAndDelete(image._id);
          } catch (err) {
            console.error("Error deleting image:", err);
          }
        });
      }

      await Product.findByIdAndDelete(id);
      return res.json({ success: true, message: "محصول با موفقیت حذف شد!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "محصول یافت نشد." });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "خطایی در حذف محصول به وجود امده است." });
  } 
};
