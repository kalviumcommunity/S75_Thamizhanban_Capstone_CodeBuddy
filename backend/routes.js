const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const Signup = require('./model/UserScehma');
const {Questions,Answers} = require('./model/Questions')
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/auth')
require('dotenv').config();
const jwt = require('jsonwebtoken')


router.post('/test/signup', async (req,res)=>{

    try{
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({message:"All the data are required"});
        }
        const hashedPass = await bcrypt.hash(password,10);
        const newData = await Signup.create({ email:email,
            password:hashedPass})
        res.status(201).json({message:"Data created successfully!"
        });
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
});

router.get('/signup',async(req,res)=>{
    try{
        const data = await Signup.find();
        if(!data){
            return res.status(500).json({
                message:'Data not found'
            });
        }
        res.status(200).json(data);

    }
    catch(err){
        res.status(500).json({error:err.message})
    }
});

router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        const dataExist = await Signup.findOne({email});
        if(!dataExist){
            return res.status(404).json({message:"No users found on this email"});
        }
        
        const isPasswordValid = await bcrypt.compare(password,dataExist.password)
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid Password"});
        }

        const token = jwt.sign({id:dataExist._id,email:dataExist.email},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.status(200).json({message:"Login successfull!",token})

    }
    catch(err){
        res.status(500).json({error:err.message})
    }
});


router.get('/allQuestions',authMiddleware,async(req,res)=>{
    try{
        const data = await Questions.find();
        if(!data){
            return res.status(400).json({message:"Data not found"});
        }
        res.status(200).json(data);
    }
    catch(err){
        console.log("error:",err);
    }
});

router.put('/updateQuestion/:id',authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { question, tagline, category } = req.body;

    const allowedCategories = ['Python', 'Java', 'DSA', 'C++', 'JavaScript', 'SQL', 'Others'];

    try {
       
        if (category && !allowedCategories.includes(category)) {
            return res.status(400).json({ message: 'Invalid category selected' });
        }

        
        const existing = await Questions.findById(id);
        if (!existing) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if (existing.posted_by !== req.user.email) {
            return res.status(403).json({ message: 'Unauthorized to update this question' });
        }

    
        const updatedQuestion = await Questions.findByIdAndUpdate(
            id,
            { question, tagline, category });

        res.status(200).json({ message: 'Question updated successfully', updatedQuestion });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




router.post('/postQuestion',authMiddleware, async (req,res)=>{
    const {question,tagline,category} = req.body;
    try{
    if(!question){
        return res.status(400).json({
            message:"Question not found!"
        });
    };
    const allowedCategories = ['Python', 'Java', 'DSA', 'C++', 'JavaScript', 'SQL', 'Others'];
    if (!allowedCategories.includes(category)) {
  return res.status(400).json({ message: 'Invalid category selected' });
}
    const newData = await Questions.create({
        question,tagline,category,posted_by:req.user.email
    });
    res.status(200).json({message:"Question added",newData})
}
catch(err){
    return res.status(500).json({error:err.message});
}
})





module.exports = router;