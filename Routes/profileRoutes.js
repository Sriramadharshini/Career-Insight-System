const express = require('express');
const router = express.Router();
const ProfileController = require('../Controllers/profileController');
const authorization = require('../middleware/authorization');
router.post('/create', async (req, res) => {
  try {
    const profileData = req.body;
    console.log('Profile request body:', profileData);

    const result = await ProfileController.create(profileData);

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
    console.log('List all profiles');
    const result = await ProfileController.listAllProfiles();
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

router.delete('/delete', async (req, res) => {
  try {
    const { EmailAddress } = req.body;
    console.log('Delete profile id:', EmailAddress);

    const result = await ProfileController.delete(EmailAddress);

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
module.exports = router;
