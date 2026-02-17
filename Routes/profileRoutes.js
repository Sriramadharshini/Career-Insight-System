const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const ProfileController = require('../Controllers/profileController');
const Profile = require('../Models/userprofile');
const authorization = require('../middleware/authorization');

router.post('/create',authorization, async (req, res) => {
  try {
    const email = req.email;
    const name = req.name;
    const phone = req.phone;
    console.log('Create profile request body:', req.body);
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ created_by: email });
    if (existingProfile) {
      return res.status(400).json({
        error: "Profile already exists"
      });
    }

    const profileData = {
      created_by: email,
      career_level: req.body.career_level,
      personal_information: {
        ...req.body.personal_information,
        Fullname: name,
        EmailAddress: email,
        PhoneNumber: phone
      },
      skills: req.body.skills,
      education: req.body.education,
      experience: req.body.experience,
      internships: req.body.internships,
      projects: req.body.projects,
      certifications: req.body.certifications
    };
    console.log('Profile request body:', profileData);

    const result = await ProfileController.create(req);

    res.status(201).json({
      message: 'Profile created successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      error_details: error.message
    });
  }
});

router.get('/list', authorization, async (req, res) => {
  try{
    const email= req.email;
    console.log('List all profiles');
    const result = await ProfileController.listAllProfiles(email);
    res.status(200).json({
      message: 'Profiles fetched successfully',
      data: result
    });
  }catch(error){
    res.status(500).json({
      error: 'Internal server error',
      error_details: error.message
    });
  }
})



router.post('/delete',authorization, async (req, res) => {
  try {
    const email= req.email;
    console.log('Delete profile');

    const result = await ProfileController.delete(email);

    res.status(200).json({
      message: 'Profile deleted successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      error_details: error.message
    });
  }
});

router.post('/logout', authorization, async (req, res) => {
  try {
    const result = await Authorization.logout(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Logout failed',
      error_details: error.message
    });
  }
});
module.exports = router;


