const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const schema = mongoose.Schema;

const productSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
});
productSchema.plugin(timestamps);

module.exports = mongoose.model("Product", productSchema);
