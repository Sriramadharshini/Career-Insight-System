const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const auth = new authController();

router.post('/register', async (req, res) => {
try {
    const result = await auth.register(req.body);
    res.status(201).json({
    message: 'User registered successfully',
    data: result
    });
} catch (error) {
    res.status(400).json({
    error: error.message
    });
}
});


router.post('/login', async (req, res) => {
try {
    console.log('Login request body', req.body);

    const result = await auth.login(req.body);

    res.status(200).json({
    message: 'Login successful',
    token: result.token,
    user: {
        id: result.user._id,
        Fullname: result.user.Fullname,
        EmailAddress: result.user.EmailAddress,
        PhoneNumber: result.user.PhoneNumber
    }
    });

} catch (error) {
    res.status(401).json({
    error: 'Login failed',
    error_details: error.message
    });
}
});

module.exports = router;