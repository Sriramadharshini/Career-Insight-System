const express = require('express');
const routes = express.Router();
const authController = require('../Controllers/authController');
const auth = new authController();
routes.post('/register',async(req,res)=>{
    try{
        const userData = req.body;
        console.log('Register request body:',userData);
        const result = await auth.register(userData);
        res.status(200).json({
            message:'User registered successfully',
            data:result
        });
    }catch(error){
        res.status(500).json({
            error:'Internal server error',
            error_details:error.message
        })
    }
        });
    
routes.post('/login',async(req,res)=>{
            try{
                const loginData = req.body;
                console.log('Login request body',loginData);
                const result = await auth.login(loginData);
                res.status(200).json({
                    message:'User logged in successfully',
                    data:result
                });
            }catch(error){
                res.status(400).json({
                    error:'Login failed',
                    error_details:error.message
                })
            }
        });
module.exports = routes;
