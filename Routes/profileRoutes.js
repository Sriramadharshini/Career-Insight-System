const express = require('express');
const router = express.Router();
const ProfileController = require('../Controllers/profileController');
const authorization = require('../middleware/authorization');
router.post('/create',authorization, async (req, res) => {
  try {
    const profileData = req.body;
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



module.exports = router;
