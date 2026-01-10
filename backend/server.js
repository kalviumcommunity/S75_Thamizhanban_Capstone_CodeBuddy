require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;


// CORS setup for local + Netlify

app.use(cors({
  origin: ['http://localhost:5173', 'https://codebudd.netlify.app'],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected');
  socket.on('joinRoom', (answerId) => socket.join(answerId));
  socket.on('sendMessage', (msg) => io.to(msg.AnswerId).emit('receiveMessage', msg));
  socket.on('disconnect', () => console.log('Socket disconnected'));
});

const uri = process.env.uri;
if (!uri) {
  console.error("MongoDB URI not set in .env file!");
  process.exit(1);
}
mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use(express.json());
app.use('/api', routes);
app.use('/api/ai', require('./chatbot'));

app.get('/', (req, res) => res.send('Hi guys!'));

server.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
