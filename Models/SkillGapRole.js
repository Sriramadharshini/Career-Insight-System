const mongoose = require('mongoose');

const SkillGapRoleSchema = new mongoose.Schema({
  created_by: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SkillGapRole', SkillGapRoleSchema);
