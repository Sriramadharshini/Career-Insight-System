const Profile = require('../Models/userprofile');
const User = require('../Models/User');
class ProfileController {

async create(req){
  try{
    const emailFromToken = req.email;
    const profileData = req.body;
    
    const user = await User.findOne({EmailAddress:emailFromToken});
    
    const mergedData = {
      ...profileData,
      EmailAddress : user.EmailAddress,
      PhoneNumber :user.PhoneNumber,
      Fullname :user.Fullname
    };

    const result = await Profile.findOneAndUpdate(
      {EmailAddress:emailFromToken},
      {$set:mergedData},
      {
        new:true,
        upsert:true,
        runValidators:true
      }
      
    );
    if(!user){
      throw new Error('User not found')
    };

    console.log("Profile Saved",result);
    return result;
  } catch(error){
    console.error("Profile save error",error);
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
      const result = await Profile.findByIdAndDelete(email);
      console.log('Deleted profile:', result);
      return result;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw new Error('Failed to delete profile');
    }
  }
}
module.exports = new ProfileController();
