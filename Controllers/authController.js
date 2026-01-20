const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class Authorization{
    async register(userData){
        try{
            const result = await User(
                {
                    Fullname:userData.Fullname,
                    EmailAddress:userData.EmailAddress,
                    PhoneNumber:userData.PhoneNumber,
                    Password:await bcrypt.hash(userData.Password,10)
                }
            ).save();
            console.log('user registered:',result);
            return result;
}catch(error){
    console.error('Error registering user:',error);
    throw new Error('Failed to register user');
}
    }

async login(loginData) {
    try {
        const user = await User.findOne({
            EmailAddress: loginData.EmailAddress
        });
        if(!user){
            throw new Error('User not found');
        }
        if(user.Password !== loginData.Password){
            throw new Error('Invalid password');
        }
         const token = jwt.sign(
            {userId:user._id,email:user.EmailAddress},
            process.env.jwt_secret,
            {expiresIn:'1h'}
         );
         return({token,user});
        }catch(error){
            console.log('Error logging in user:',error);
            throw error;
        }
    }
    }
module.exports = Authorization;


