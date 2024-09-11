const joi = require("joi");
const path = require("path");
const fs = require("fs");
const Category = require("../../models/category");
const category = require("../../models/category");

module.exports.getCategory = async (req, res) => {
  try {
    const categoryData = await Category.find().sort({ title: 1 });
    res.render("admin/pages/category", {
      message: req.flash("message"),
      errors: req.flash("errors"),
      categoryData,
    });
  } catch (err) {
    console.log(err);
  }
};

//ADD
module.exports.getForm = (req, res) => {
  try {
    let fieldDatas = req.flash("fieldData");
    if (fieldDatas && fieldDatas.length) {
      fieldDatas = fieldDatas[0];
    }
    res.render("admin/pages/newCategory", {
      errors: req.flash("errors"),
      category: fieldDatas,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.addCategoryFormValidatoin = async (req, res, next) => {
  try {
    const schema = joi.object({
      title: joi.string().min(2).required().messages({
        "string.base": "عنوان باید یک رشته متنی باشد.",
        "string.empty": "عنوان نمی‌تواند خالی باشد.",
        "string.min": "عنوان باید حداقل ۲ کاراکتر داشته باشد.",
        "any.required": "عنوان الزامی است.",
      }),
      btnURL: joi.string().required().messages({
        "string.base": "آدرس URL باید یک رشته متنی باشد.",
        "string.empty": "آدرس URL نمی‌تواند خالی باشد.",
        "any.required": "وارد کردن آدرس URL الزامی است.",
      }),
    });

    const result = await schema.validate(
      {
        title: req.body.title,
        btnURL: req.body.btnURL,
      },
      { abortEarly: false }
    );
    const errors = result.error?.details;
    if (result.error) {
      req.flash("errors", errors);
      req.flash("fieldData", req.body);
      res.redirect("/admin/category/addcategory");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.sorteCategory = async (req, res, next) => {
  try {
    let image = "";
    if (req.files) {
      image = req.files.filter((a) => a.fieldname === "image");
      if (image.length) {
        image = image[0].filename;
      }
    }
    const newCategory = new Category({
      image: image,
      title: req.body.title,
      btnURL: req.body.btnURL,
    });
    const savedCategory = await newCategory.save();
    req.flash("message", "دسته بندی با موفقیت افزوده شد");
    res.redirect("/admin/category");
  } catch (err) {
    console.log(err);
  }
};
//DELETE
module.exports.deletecategory = async (req, res) => {
  try {
    const id = req.body.id;

    if (id) {
      const category = await Category.findById(id);
      if (category) {
        const imagePath = path.join(
          __dirname,
          "../../../uploads/category/",
          category.image
        );
        await Category.findByIdAndDelete(id);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error:", err);
          }
        });
      }
      req.flash("message", "دسته بندی با موفقیت حذف شد");
    } else {
      req.flash("errors", "دسته بندی حذف نشد");
    }
    res.redirect("/admin/category");
  } catch (err) {
    console.log(err);
  }
};
//UPDATE
module.exports.getUpdateForm = async (req, res) => {
  try {
    const id = req.query._id;
    let category = req.flash("fieldDatas");
    if (category && category.length) {
      category = category[0];
    } else {
      category = await Category.findById(id);
    }
    const fieldData = await Category.find();
    res.render("admin/pages/updatecategory", {
      errors: req.flash("errors"),
      category,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.updateCategoryFormValidatoin = async (req, res, next) => {
  try {
    const schema = joi.object({
      title: joi.string().min(2).required().messages({
        "string.base": "عنوان باید یک رشته متنی باشد.",
        "string.empty": "عنوان نمی‌تواند خالی باشد.",
        "string.min": "عنوان باید حداقل ۲ کاراکتر داشته باشد.",
        "any.required": "عنوان الزامی است.",
      }),
      btnURL: joi.string().required().messages({
        "string.base": "آدرس URL باید یک رشته متنی باشد.",
        "string.empty": "آدرس URL نمی‌تواند خالی باشد.",
        "any.required": "وارد کردن آدرس URL الزامی است.",
      }),
    });

    const result = await schema.validate(
      {
        title: req.body.title,
        btnURL: req.body.btnURL,
      },
      { abortEarly: false }
    );
    const errors = result.error?.details;
    if (result.error) {
      req.flash("errors", errors);
      req.flash("fieldData", req.body);
      res.redirect("/admin/category/updatecategory");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.updateCategory = async (req, res, next) => {
  try {
    const lastImage = req.body.lastImage;
    const { _id, title, btnURL } = req.body;
    let newImage = lastImage;

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.filter(
        (a) => a.fieldname === "newImage"
      );
      if (uploadedImages.length > 0) {
        newImage = uploadedImages[0].filename;
        const imagePath = __dirname + "/../../../uploads/category/" + lastImage;
        try {
          if (lastImage) {
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error("Error:", err);
              }
            });
          }
        } catch (err) {
          console.error(`Error deleting file: ${err.message}`);
        }
      }
    }

    const updateData = {
      image: newImage,
      title,
      btnURL,
    };

    const updateCategory = await Category.findByIdAndUpdate(_id, updateData);

    req.flash("message", "دسته بندی با موفقیت به‌روزرسانی شد");
    res.redirect("/admin/category");
  } catch (err) {
    console.log(err);
  }
};
