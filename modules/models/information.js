const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const schema = mongoose.Schema;

const InformationSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^09[0-9]{9}$/,
  },
  telegram: {
    type: String,
    maxlength: 100,
  },
  linkedin: {
    type: String,
    maxlength: 100,
  },
  instagram: {
    type: String,
    maxlength: 100,
  },
  twitter: {
    type: String,
    maxlength: 100,
  },
  facebook: {
    type: String,
    maxlength: 100,
  },
  about: {
    type: String,
    required: true,
    maxlength: 500,
  },
});
InformationSchema.plugin(timestamps);

module.exports = mongoose.model("Information", InformationSchema);
