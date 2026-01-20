const express = require('express');
const router = express.Router();
const ProfileController = require('../Controllers/profileController');
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


router.get('/profile', async (req, res) => {
  try {
    const profileData = req.body;
    console.log('List all profiles');

    const result = await ProfileController.listAll(profileData);

    res.status(200).json({
      message: 'Profiles fetched successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      error_details: error.message
    });
  }
});

router.delete('/profile', async (req, res) => {
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
