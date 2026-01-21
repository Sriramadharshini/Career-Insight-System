const Profile = require('../Models/userprofile');

class ProfileController {

  async create(profileData) {
    try {
      const result = await Profile(profileData).save();
      console.log('Profile created:', result);
      return result;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new Error('Failed to create profile');
    }
  }

async listAllProfiles() {
    try {
      const result = await Profile.find();
      console.log('Profiles list:', result);
      return result;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Failed to fetch profiles');
    }
  }
  async deleteProfile(profileId) {
    try {
      const result = await Profile.findByIdAndDelete(profileId);
      console.log('Deleted profile:', result);
      return result;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw new Error('Failed to delete profile');
    }
  }

}
module.exports = new ProfileController();
