const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Profile = require('../Models/userprofile');

class Authorization {

async register(userData) {
    try {
    const existingEmail = await User.findOne({
        
        EmailAddress: userData.EmailAddress
        
    });

    if (existingEmail) {
        throw new Error('Email already exists');
    }
    const existingPhone = await User.findOne({
        
        PhoneNumber: userData.PhoneNumber
        
    });

    if (existingPhone) {
        throw new Error('Phone number already exists');
    }

    const result = await User({
        Fullname: userData.Fullname,
        EmailAddress: userData.EmailAddress,
        PhoneNumber: userData.PhoneNumber,
        Password: await bcrypt.hash(userData.Password, 10)
    }).save();

    await Profile({
        Fullname: userData.Fullname,
        EmailAddress: userData.EmailAddress,
        PhoneNumber: userData.PhoneNumber
    }).save();

    return result;

    } catch (error) {
    throw new Error(error.message);
    }
}

async login(loginData) {
    try {
    const user = await User.findOne({
        EmailAddress: loginData.EmailAddress
    });

    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(loginData.Password, user.Password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign(
        { userId: user._id, email: user.EmailAddress },
        process.env.jwt_secret,
        { expiresIn: '1h' }
    );

    return { token, user };

    } catch (error) {
    throw new Error(error.message);
    }
}
}
module.exports = Authorization;
