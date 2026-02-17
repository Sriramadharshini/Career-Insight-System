const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
  api_key: { type: String },
  type_key: {
    type: String,
    enum: ["OpenAI", "ClaudeAI"],
  }
});

module.exports = mongoose.model('Api_', apiSchema);