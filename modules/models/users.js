const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true, unique: true, match: /^09[0-9]{9}$/ },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" }, 
});

userSchema.plugin(timestamps);

module.exports = mongoose.model("Users", userSchema);
