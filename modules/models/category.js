const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const schema = mongoose.Schema;

const categorySchema = new schema({
  image: { type: String, require },
  title: { type: String, require },
  btnURL: { type: String, require },
});
categorySchema.plugin(timestamps);

module.exports = mongoose.model("Category", categorySchema);
