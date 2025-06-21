const express = require('express')
const app = express();
const port = 3000
const routes = require('./routes')
const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.uri;
const cors = require('cors');
app.use(cors());
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New socket connection');

  socket.on('joinRoom', (answerId) => {
    socket.join(answerId);
  });

  socket.on('sendMessage', ({ AnswerId, sender, text }) => {
    io.to(AnswerId).emit('receiveMessage', { AnswerId, sender, text });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



app.get('/',(req,res)=>{
    res.send('Hi guys!')
});

mongoose.connect(uri)
.then(()=>console.log("MongoDB connected successfully!"))
.catch((err)=>console.log(err));

app.use(express.json());
app.use('/api',routes)

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})