const mongoose = require("mongoose");

const TextsSchema = new mongoose.Schema({
  title: String,
  nickname: String,
  content: String,
});
TextsSchema.virtual("TextsId").get(function () {
  return this._id.toHexString();
});
TextsSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Texts", TextsSchema);