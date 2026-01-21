const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    Fullname: { type: String, required: true },
    EmailAddress: { type: String, required: true },
    PhoneNumber: { type: Number, required: true },
    Location: { type: String },
    ProfileVideoUrl: { type: String },
    LinkedinProfile: { type: String },
    GithubProfile: { type: String },
    Portfoliowebsite: { type: String },
    DateOfBirth: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
