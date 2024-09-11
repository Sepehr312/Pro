const joi = require("joi");
const Information = require("../../models/information");

//SHOWDATE
module.exports.getInformation = async (req, res) => {
  try {
    let informationDatas = [];
    const informationData = await Information.findOne();
    if (informationData) {
      informationDatas = [informationData];
    }
    console.log(informationDatas);
    res.render("admin/pages/information", {
      message: req.flash("message"),
      errors: req.flash("errors"),
      informationData: informationDatas,
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
    res.render("admin/pages/newInformation", {
      errors: req.flash("errors"),
      information:fieldDatas,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.addInformationFormValidation = async (req, res, next) => {
  try {
    const schema = joi.object({
      phone: joi.number().min(10).required().messages({
        "string.empty": "فیلد شماره تلفن الزامی است.",
        'number.base': 'مقداری برای شماره تلفن باید وارد شده باشد.',
        "string.min": "شماره تلفن حداقل باید 10 کاراکتر داشته باشد.",
        "any.required": "وارد کردن شماره تلفن اجباری است.",
      }),
      telegram: joi.string().uri().allow("").messages({
        "string.uri": "لینک تلگرام باید یک URL معتبر باشد.",
      }),
      linkedin: joi.string().uri().allow("").messages({
        "string.uri": "لینک لینکدین باید یک URL معتبر باشد.",
      }),
      instagram: joi.string().uri().allow("").messages({
        "string.uri": "لینک اینستاگرام باید یک URL معتبر باشد.",
      }),
      twitter: joi.string().uri().allow("").messages({
        "string.uri": "لینک توییتر باید یک URL معتبر باشد.",
      }),
      facebook: joi.string().uri().allow("").messages({
        "string.uri": "لینک فیسبوک باید یک URL معتبر باشد.",
      }),
      about: joi.string().min(10).required().messages({
        "string.empty": "فیلد درباره ما الزامی است.",
        "string.base": "درباره ما باید یک رشته باشد.",
        "string.min": "درباره ما باید حداقل 10 کاراکتر باشد.",
        "any.required": "درباره ما اجباری است.",
      }),
    });

    const result = await schema.validate(req.body, { abortEarly: false });
    const errors = result.error?.details;

    if (result.error) {
      req.flash("errors", errors);
      req.flash("fieldData", req.body);
      return res.redirect("/admin/information/addinformation");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.sortInformation = async (req, res, next) => {
  try {
    const existingInformation = await Information.findOne();
    if (existingInformation) {
      await Information.findByIdAndDelete(existingInformation._id);
    }

    const newInformation = new Information({
      phone: req.body.phone,
      telegram: req.body.telegram,
      linkedin: req.body.linkedin,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      facebook: req.body.facebook,
      about: req.body.about,
    });

    await newInformation.save();

    req.flash("message", "اطلاعات با موفقیت ذخیره شد");
    res.redirect("/admin/information");
  } catch (err) {
    console.log(err);
  }
};

//DELETE
module.exports.deleteInformation = async (req, res) => {
  try {
    const deletedInformation = await Information.findOneAndDelete();
    if (deletedInformation) {
      req.flash("message", "اطلاعات با موفقیت حذف شدند");
      res.redirect("/admin/information/addinformation");
    } else {
      req.flash("errors", "مشکلی در حذف اطلاعات به وجود آمده است");
      res.redirect("/admin/information");
    }
  } catch (err) {
    console.log(err);
  }
};

//UPDATE
module.exports.getUpdateForm = async (req, res) => {
  try {
    let information = req.flash("fieldData");
    if (information && information.length) {
      information = information[0];
    } else {
      information = await Information.findOne();
    }
    res.render("admin/pages/updateinformation", {
      errors: req.flash("errors"),
      information,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.updateInformationFormValidation = async (req, res, next) => {
  try {
    const schema = joi.object({
      phone: joi.number().min(10).required().messages({
        "string.empty": "فیلد شماره تلفن الزامی است.",
        'number.base': 'مقداری برای شماره تلفن باید وارد شده باشد.',
        "string.min": "شماره تلفن حداقل باید 10 کاراکتر داشته باشد.",
        "any.required": "وارد کردن شماره تلفن اجباری است.",
      }),
      telegram: joi.string().uri().allow("").messages({
        "string.uri": "لینک تلگرام باید یک URL معتبر باشد.",
      }),
      linkedin: joi.string().uri().allow("").messages({
        "string.uri": "لینک لینکدین باید یک URL معتبر باشد.",
      }),
      instagram: joi.string().uri().allow("").messages({
        "string.uri": "لینک اینستاگرام باید یک URL معتبر باشد.",
      }),
      twitter: joi.string().uri().allow("").messages({
        "string.uri": "لینک توییتر باید یک URL معتبر باشد.",
      }),
      facebook: joi.string().uri().allow("").messages({
        "string.uri": "لینک فیسبوک باید یک URL معتبر باشد.",
      }),
      about: joi.string().min(10).required().messages({
        "string.empty": "فیلد درباره ما الزامی است.",
        "string.base": "درباره ما باید یک رشته باشد.",
        "string.min": "درباره ما باید حداقل 10 کاراکتر باشد.",
        "any.required": "درباره ما اجباری است.",
      }),
    });

    const result = await schema.validate(req.body, { abortEarly: false });
    const errors = result.error?.details;

    if (result.error) {
      req.flash("errors", errors);
      req.flash("fieldData", req.body);
      return res.redirect("/admin/information/updateinformation");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.updateInformation = async (req, res) => {
  try {
    const { phone, telegram, linkedin, instagram, twitter, facebook, about } =
      req.body;

    const updateData = {
      phone,
      telegram,
      linkedin,
      instagram,
      twitter,
      facebook,
      about,
    };

    await Information.findOneAndUpdate({}, updateData, {
      upsert: true,
      new: true,
    });

    req.flash("message", "اطلاعات با موفقیت به‌روزرسانی شد");
    res.redirect("/admin/information");
  } catch (err) {
    console.log(err);
  }
};
