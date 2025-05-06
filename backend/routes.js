const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const {Signup,Login} = require('./model/UserScehma');
const {Questions,Answers} = require('./model/Questions')




router.post('test/signup', async (req,res)=>{

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

       
        res.status(200).json({message:"Login successfull!"})

    }
    catch(err){
        res.status(500).json({error:err.message})
    }
});


module.exports = router;