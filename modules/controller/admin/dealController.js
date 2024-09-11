const joi = require("joi");
const path = require("path");
const fs = require("fs");
const Deal = require("../../models/deal");

module.exports.getDeal = async (req, res) => {
  try {
    const dealData = await Deal.find();
    res.render("admin/pages/deal", {
      message: req.flash("message"),
      errors: req.flash("errors"),
      dealData,
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
    res.render("admin/pages/newdeal", {
      errors: req.flash("errors"),
      message: req.flash("message"),
      deal: fieldDatas,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.addDealFormValidatoin = async (req, res, next) => {
  try {
    const schema = joi.object({
      title: joi.string().min(2).required().messages({
        "string.base": "عنوان باید یک متن باشد.",
        "string.empty": "عنوان نمی‌تواند خالی باشد.",
        "string.min": "عنوان باید حداقل ۲ کاراکتر داشته باشد.",
        "any.required": "عنوان الزامی است.",
      }),
      description: joi.string().min(10).required().messages({
        "string.base": "توضیحات باید یک متن باشد.",
        "string.empty": "توضیحات نمی‌تواند خالی باشد.",
        "string.min": "توضیحات باید حداقل ۱۰ کاراکتر داشته باشد.",
        "any.required": "توضیحات الزامی است.",
      }),
      days: joi.number().required().messages({
        "number.base": "مقداری برای روز باید وارد شده باشد.",
        "any.required": "وارد کردن روز الزامی است.",
        "any.empty": "روز نمی‌تواند خالی باشد.",
      }),
      hours: joi.number().required().messages({
        "number.base": "مقداری برای ساعت‌ باید وارد شده باشد.",
        "any.required": "وارد کردن ساعت‌ الزامی است.",
        "any.empty": "ساعت‌ نمی‌تواند خالی باشد.",
      }),
      minutes: joi.number().required().messages({
        "number.base": "مقداری برای دقیقه باید وارد شده باشد.",
        "any.required": "وارد کردن دقیقه الزامی است.",
        "any.empty": "دقیقه نمی‌تواند خالی باشد.",
      }),
      seconds: joi.number().required().messages({
        "number.base": "مقداری برای ثانیه باید وارد شده باشد.",
        "any.required": "وارد کردن ثانیه الزامی است.",
        "any.empty": "ثانیه نمی‌تواند خالی باشد.",
      }),
      btnURL: joi.string().required().messages({
        "string.base": "آدرس URL باید یک متن باشد.",
        "string.empty": "آدرس URL نمی‌تواند خالی باشد.",
        "any.required": "وارد کردن آدرس URL الزامی است.",
      }),
    });

    const result = await schema.validate(
      {
        title: req.body.title,
        description: req.body.description,
        days: req.body.days,
        hours: req.body.hours,
        minutes: req.body.minutes,
        seconds: req.body.seconds,
        btnURL: req.body.btnURL,
      },
      { abortEarly: false }
    );
    const errors = result.error?.details;
    if (result.error) {
      req.flash("errors", errors);
      req.flash("fieldData", req.body);
      res.redirect("/admin/deal/adddeal");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.sorteDeal = async (req, res, next) => {
  try {
    let image = "";
    if (req.files) {
      image = req.files.filter((a) => a.fieldname === "image");
      if (image.length) {
        image = image[0].filename;
      }
    }
    const deal = await Deal.findOne();
    console.log("deal", deal);
    if (deal) {
      const imagePath = path.join(
        __dirname,
        "../../../uploads/deal/",
        deal.image
      );
      await Deal.findOneAndDelete();
      fs.unlinkSync(imagePath, (err) => {
        if (err) {
          console.error("Error:", err);
        }
      });
    }
    const newDeal = new Deal({
      image: image,
      title: req.body.title,
      description: req.body.description,
      days: req.body.days,
      hours: req.body.hours,
      minutes: req.body.minutes,
      seconds: req.body.seconds,
      btnURL: req.body.btnURL,
    });
    const savedDeal = await newDeal.save();
    req.flash("message", "معامله روز با موفقیت افزوده شد");
    res.redirect("/admin/deal");
  } catch (err) {
    console.log(err);
  }
};
//DELETE
module.exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findOne();
    if (deal) {
      const imagePath = path.join(
        __dirname,
        "../../../uploads/deal/",
        deal.image
      );
      fs.unlinkSync(imagePath, (err) => {
        if (err) {
          console.log("Error:", err);
        } else {
          console.log("Successful");
        }
      });
    }
    const deleted = await Deal.findOneAndDelete();
    if (deleted) {
      req.flash("message", "حذف با موفقیت انجام شد");
      res.redirect("/admin/deal/adddeal");
    } else {
      req.flash("errors", "حذف انجام نشد");
      res.redirect("/admin/deal");
    }
  } catch (err) {
    console.log(err);
  }
};
//UPDATE
module.exports.getUpdateForm = async (req, res) => {
  try {
    let deal = req.flash("fieldData");
    if (deal && deal.length) {
      deal = deal[0];
    } else {
      deal = await Deal.findOne();
    }
    res.render("admin/pages/updatedeal", {
      errors: req.flash("errors"),
      deal,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.updateDealFormValidatoin = async (req, res, next) => {
  try {
    const schema = joi.object({
      title: joi.string().min(2).required().messages({
        "string.base": "عنوان باید یک متن باشد.",
        "string.empty": "عنوان نمی‌تواند خالی باشد.",
        "string.min": "عنوان باید حداقل ۲ کاراکتر داشته باشد.",
        "any.required": "عنوان الزامی است.",
      }),
      description: joi.string().min(10).required().messages({
        "string.base": "توضیحات باید یک متن باشد.",
        "string.empty": "توضیحات نمی‌تواند خالی باشد.",
        "string.min": "توضیحات باید حداقل ۱۰ کاراکتر داشته باشد.",
        "any.required": "توضیحات الزامی است.",
      }),
      days: joi.number().required().messages({
        "number.base": "مقداری برای روز باید وارد شده باشد.",
        "any.required": "وارد کردن روز الزامی است.",
        "any.empty": "روز نمی‌تواند خالی باشد.",
      }),
      hours: joi.number().required().messages({
        "number.base": "مقداری برای ساعت‌ باید وارد شده باشد.",
        "any.required": "وارد کردن ساعت‌ الزامی است.",
        "any.empty": "ساعت‌ نمی‌تواند خالی باشد.",
      }),
      minutes: joi.number().required().messages({
        "number.base": "مقداری برای دقیقه باید وارد شده باشد.",
        "any.required": "وارد کردن دقیقه الزامی است.",
        "any.empty": "دقیقه نمی‌تواند خالی باشد.",
      }),
      seconds: joi.number().required().messages({
        "number.base": "مقداری برای ثانیه باید وارد شده باشد.",
        "any.required": "وارد کردن ثانیه الزامی است.",
        "any.empty": "ثانیه نمی‌تواند خالی باشد.",
      }),
      btnURL: joi.string().required().messages({
        "string.base": "آدرس URL باید یک متن باشد.",
        "string.empty": "آدرس URL نمی‌تواند خالی باشد.",
        "any.required": "وارد کردن آدرس URL الزامی است.",
      }),
    });

    const result = await schema.validate(
      {
        title: req.body.title,
        description: req.body.description,
        days: req.body.days,
        hours: req.body.hours,
        minutes: req.body.minutes,
        seconds: req.body.seconds,
        btnURL: req.body.btnURL,
      },
      { abortEarly: false }
    );
    const errors = result.error?.details;
    if (result.error) {
      req.flash("errors", errors);
      req.flash("fieldData", req.body);
      res.redirect("/admin/deal/updatedeal");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.updateDeal = async (req, res, next) => {
  try {
    const lastImage = req.body.lastImage;
    const { _id, title, description, days, hours, minutes, seconds, btnURL } =
      req.body;
    let newImage = lastImage;

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.filter(
        (a) => a.fieldname === "newImage"
      );
      if (uploadedImages.length > 0) {
        newImage = uploadedImages[0].filename;
        const imagePath = __dirname + "/../../../uploads/deal/" + lastImage;
        try {
          if (lastImage) {
            fs.unlinkSync(imagePath, (err) => {
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
      description,
      days,
      hours,
      minutes,
      seconds,
      btnURL,
    };

    const updateDeal = await Deal.findByIdAndUpdate(_id, updateData);

    req.flash("message", "دسته بندی با موفقیت به‌روزرسانی شد");
    res.redirect("/admin/deal");
  } catch (err) {
    console.log(err);
  }
};
