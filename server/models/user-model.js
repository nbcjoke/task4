const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: Boolean, required: true },
  registrationTime: { type: String, required: true },
  lastOnline: { type: String, required: true },
});

module.exports = model("User", UserSchema);
