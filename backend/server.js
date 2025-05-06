const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const uri = process.env.uri;
const routes = require('./routes')
app.get('/',(req,res)=>{
    res.send('Hello');
})


mongoose.connect(uri)
.then(()=>console.log("MongoDB connected successfully!"))
.catch((err)=>console.log(err));


app.use(express.json())
app.use('/api',routes)

app.listen(PORT,()=>{
    console.log(`This server is running in : http://localhost:${PORT}`)
});