const { number } = require("joi");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const schema = mongoose.Schema;

const dealSchema = new schema({
  image: { type: String, require },
  title: { type: String, require },
  description: { type: String, require },
  days: { type: Number, require },
  hours: { type: Number, require },
  minutes: { type: Number, require },
  seconds: { type: Number, require },
  btnURL: { type: String, require },
});
dealSchema.plugin(timestamps);

module.exports = mongoose.model("Deal", dealSchema);
