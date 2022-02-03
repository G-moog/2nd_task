const mongoose = require("mongoose");

const WriteSchema = new mongoose.Schema({
  title: String,
  nickname: String,
  content: String,
});
WriteSchema.virtual("WriteId").get(function () {
  return this._id.toHexString();
});
WriteSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Write", WriteSchema);