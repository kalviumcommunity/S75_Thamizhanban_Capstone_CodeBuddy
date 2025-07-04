const mongoose = require('mongoose');

const signup = new mongoose.Schema({
  email:{
      type:String,
      required:true,
      unique:true
  },
  password:{
      type:String,
      required:true,
      unique:true
  }
})

const login = new mongoose.Schema({
  email:{
      type:String,
      required:true,
      unique:true,
  },
  password:{
      type:String,
      required:true,
      unique:true
  }
});

const Login = mongoose.model('Login',login)
const Signup = mongoose.model('Signup',signup)

module.exports = {Signup,Login};