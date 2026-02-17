const Profile = require('../Models/userprofile');
const User = require('../Models/User');


class ProfileController {

  async create(req) {
    try {
      const emailFromToken = req.email;
      const profileData = req.body;

      // ✅ First check user
      const user = await User.findOne({ EmailAddress: emailFromToken });

      if (!user) {
        throw new Error('User not found');
      }

      const mergedData = {
        created_by: emailFromToken,   // ✅ REQUIRED FIELD
        career_level: profileData.career_level,

        personal_information: {
          ...profileData.personal_information,
          Fullname: user.Fullname,
          EmailAddress: user.EmailAddress,
          PhoneNumber: user.PhoneNumber
        },

        skills: profileData.skills,
        education: profileData.education,
        experience: profileData.experience,
        internships: profileData.internships,
        projects: profileData.projects,
        certifications: profileData.certifications
      };

      const result = await Profile.findOneAndUpdate(
        { created_by: emailFromToken },  
        { $set: mergedData },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      console.log("Profile Saved", result);
      return result;

    } catch (error) {
      console.error("Profile save error", error);
      throw error;
    }
  }

async listAllProfiles(email) {
    try {
      const result = await Profile.findOne({EmailAddress:email});
      console.log('Profiles list:', result);
      return result;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Failed to fetch profiles');
    }
  }

  async delete(email) {
    try {
      const result = await Profile.findOneAndDelete({EmailAddress:email});
      console.log('Deleted profile:', result);
      return result;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw new Error('Failed to delete profile');
    }
  }
}
module.exports = new ProfileController();
