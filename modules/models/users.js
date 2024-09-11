const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, match: /^09[0-9]{9}$/ },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
userSchema.plugin(timestamps);

module.exports = mongoose.model("Users", userSchema);
 