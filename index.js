require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const profileRoutes = require('./Routes/profileRoutes');
const authRoutes = require('./Routes/authRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/profile',profileRoutes);
app.use('/auth',authRoutes);
app.get('/',(req,res)=>{
    res.send("API running");
    
});
const PORT = process.env.PORT || 4000;
app.listen(PORT,async()=>{
    console.log(`server running on port ${PORT}`);

    try{
        await mongoose.connect(process.env.MONGO_URI,{

        });
        console.log('MongoDB connected');
    
    }catch(error){
        console.error('Error connecting to MongoDB:',error);
    }
});

