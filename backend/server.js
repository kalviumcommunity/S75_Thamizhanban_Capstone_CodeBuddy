const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT;
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('Hello');
})

app.listen(PORT,()=>{
    console.log(`This server is running in : http://localhost:${PORT}`)
});