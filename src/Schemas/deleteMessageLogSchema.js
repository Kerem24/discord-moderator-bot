const { Schema, model } = require("mongoose");
const clc = require("cli-color");

let deleteMsgLogSchema = new Schema({
  Guild: {
    type: String,
    required: true,
    unique: true, // Her sunucu için yalnızca bir tane kayıt olmalı
  },
  Channel: {
    type: String,
    required: true,
  },
});

module.exports = model("DeleteMsgLog", deleteMsgLogSchema);
