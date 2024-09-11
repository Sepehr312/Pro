const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const schema = mongoose.Schema;

const slideSchema = new schema({
  image: { type: String, required: true },
  title: { type: String },
  description: { type: String },
});
slideSchema.plugin(timestamps);

module.exports = mongoose.model("Slide", slideSchema);
