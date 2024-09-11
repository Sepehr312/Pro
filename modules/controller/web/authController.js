const joi = require("joi");
const Slide = require("../../models/slide");
const Category = require("../../models/category");
const Deal = require("../../models/deal");
const Information = require("../../models/information");
const Users = require("../../models/users");

module.exports.getAuthForm = async (req, res) => {
  try {
    const slider = await Slide.find();
    const category = await Category.find();
    const deal = await Deal.find();
    const information = await Information.find();

    res.render("frontEnd/pages/auth", {
      message: req.flash("message"),
      errors: req.flash("errors"),
      slider,
      category,
      deal,
      information,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.registrationFormValidation = async (req, res, next) => {
  try {
    const schema = joi.object({
      firstName: joi.string().min(3).required().messages({
        "string.empty": "فیلد نام الزامی است.",
        "string.min": "نام حداقل باید 3 کاراکتر داشته باشد.",
        "any.required": "وارد کردن نام اجباری است.",
      }),
      lastName: joi.string().min(3).required().messages({
        "string.empty": "فیلد نام خانوادگی الزامی است.",
        "string.min": "نام خانوادگی حداقل باید 3 کاراکتر داشته باشد.",
        "any.required": "وارد کردن نام خانوادگی اجباری است.",
      }),
      phone: joi
        .string()
        .length(11)
        .pattern(/^09[0-9]{9}$/)
        .required()
        .messages({
          "string.empty": "فیلد شماره تلفن الزامی است.",
          "string.pattern.base":
            "شماره تلفن باید با 09 شروع شده و 11 رقم باشد.",
          "any.required": "وارد کردن شماره تلفن اجباری است.",
        }),
      email: joi.string().email().required().messages({
        "string.empty": "فیلد ایمیل الزامی است.",
        "string.email": "آدرس ایمیل نامعتبر است.",
        "any.required": "وارد کردن ایمیل اجباری است.",
      }),
      password: joi.string().min(6).required().messages({
        "string.empty": "فیلد رمز عبور الزامی است.",
        "string.min": "رمز عبور حداقل باید 6 کاراکتر داشته باشد.",
        "any.required": "وارد کردن رمز عبور اجباری است.",
      }),
      repeatPassword: joi
        .string()
        .valid(joi.ref("password"))
        .required()
        .messages({
          "any.only": "رمز عبور و تکرار آن مطابقت ندارند.",
          "string.empty": "فیلد تکرار رمز عبور الزامی است.",
          "any.required": "تکرار رمز عبور اجباری است.",
        }),
    });

    const result = await schema.validate(req.body, { abortEarly: false });
    const errors = result.error?.details;

    if (result.error) {
      req.flash("errors", errors);
      req.flash("fieldData", req.body);
      return res.redirect("/auth");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.sortUserData = async (req, res, next) => {
  try {
    console.log(req.body);

    const newUsers = new Users({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
    });
    await newUsers.save();

    req.flash("message", "ثبت نام با موفقیت انجام شد");
    res.redirect("/auth");
  } catch (err) {
    console.log(err);
  }
};
