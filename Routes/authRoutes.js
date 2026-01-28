const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const auth = new authController();
const generatePrefToken = require('../middleware/preftoken');
const bodyParser = require('body-parser');

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
    console.log('Login successful for user:', result);
    const tokenResult = await generatePrefToken(result);
    if(
        !tokenResult){
        throw new Error('Token generation failed');
    }
    res.setHeader("token", `Bearer ${tokenResult.token}`);

    res.status(200).json({
    message: 'Login successful',
    token: tokenResult.token,
    data: result
    });

} catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({
    error: 'Login failed',
    error_details: error.message
    });
}
});

module.exports = router;



