const jsonwebtoken = require('jsonwebtoken');
async function generatePrefToken(user) {
    try{
        console.log('Generating pref token for user:', user);
        const token = jsonwebtoken.sign(
            {
                email: user.EmailAddress,
                fullname: user.Fullname
            },
            process.env.SECRET,
            { expiresIn: '2h' }
        );
        return {
            success: true,
            message: 'Token generated successfully',
            token,
        }
    }catch(error){
        console.error('Token generation error:', error);
        return {
            success: false,
            message: 'Token generation failed',
            error: error.message,

        };
    }
            }

module.exports = generatePrefToken;