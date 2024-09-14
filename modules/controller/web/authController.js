const joi = require("joi");
const bcrypt = require("bcryptjs");
const passport = require("passport");
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
    let fieldDatas = req.flash("fieldData");
    if (fieldDatas && fieldDatas.length) {
      fieldDatas = fieldDatas[0];
    }

    res.render("frontEnd/pages/auth", {
      message: req.flash("message"),
      errors: req.flash("errors"),
      slider,
      category,
      deal,
      information,
      auth: fieldDatas,
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
    const password = await bcrypt.hash(req.body.password, 10);
    const newUsers = new Users({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: password,
      role: "user",
    });

    await newUsers
      .save()
      .then(() => {
        req.flash("message", "ثبت نام با موفقیت انجام شد");
        return res.redirect("/auth");
      })
      .catch((err) => {
        if (err.code === 11000) {
          const errors = [];
          if (err.keyValue.phone) {
            errors.push({ message: "شماره تلفن وارد شده قبلاً ثبت شده است." });
          }
          if (err.keyValue.email) {
            errors.push({ message: "ایمیل وارد شده قبلاً ثبت شده است." });
          }
          req.flash("errors", errors);
          req.flash("fieldData", req.body);
          return res.redirect("/auth");
        }
        req.flash("errors", [
          { message: "خطایی رخ داد، لطفاً مجدداً تلاش کنید." },
        ]);
        return res.redirect("/auth");
      });
  } catch (err) {
    console.log(err);
  }
};

//LOGIN
module.exports.loginFormValidation = async (req, res, next) => {
  try {
    const schema = joi.object({
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
module.exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/auth');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      if (user.role === 'admin') {
        return res.redirect('/admin');
      } else if (user.role === 'user') {
        return res.redirect('/');
      } else {
        req.flash("errors", [{ message: "اکانتی برای این ایمیل وجود ندارد لطفا ثبت نام کنید." }]);
        return res.redirect('/auth');
      }
    });
  })(req, res, next);
}; 
