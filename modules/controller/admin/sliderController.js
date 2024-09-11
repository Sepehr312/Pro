const Slide = require("../../models/slide");
const fs = require("fs");
const path = require("path");

module.exports.getSlider = async (req, res) => {
  const slideFieldData = await Slide.find();
  res.render("admin/pages/slider", {
    slideFieldData,
  });
};
module.exports.uploadFile = async (req, res) => {
  return res.json({
    success: true,
    data: req.files[0].filename,
  });
};
module.exports.saveOrUpdateSlider = async (req, res) => {
  try {
    const slidesArray = req.body;

    for (let i = 0; i < slidesArray.length; i++) {
      let slide = slidesArray[i];

      if (!slide.id || slide.id === "") {
        const newSlide = new Slide({
          image: slide.image,
          title: slide.title,
          description: slide.description,
        });
        await newSlide.save();
      } else {
        await Slide.findByIdAndUpdate(
          slide.id,
          {
            image: slide.image,
            title: slide.title,
            description: slide.description,
          },
          { new: true, upsert: true }
        );
      }
    }
    return res.json({
      success: true,
    });
    // res.redirect("/admin/slider");
  } catch (err) {
    console.log(err);
  }
};
module.exports.deleteSlide = async (req, res) => {
  try {
    const id = req.body.id;

    if (id) {
      const slide = await Slide.findById(id);
      if (slide) {
        const imagePath = path.join(
          __dirname,
          "../../../uploads/slider/",
          slide.image
        );
        fs.unlinkSync(imagePath, (err) => {
          if (err) {
            console.error("Error:", err);
          }
        });
        await Slide.findByIdAndDelete(id);
      }
    }
    return res.json({
      success: true,
    });
    // res.redirect("/admin/slider");
  } catch (err) {
    console.log(err);
  }
};
