const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: [
            "http://localhost:5173"
        ],
        methods: ["GET", "POST"],
    },
});

app.use(cors({
    origin: [
        "http://localhost:5173",
       
    ],
    methods: ["GET", "POST"],
    credentials: true, // Optional, if you need to include credentials
}));

let messages = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing messages to the new user
    socket.emit('previousMessages', messages);

    socket.on('chatMessage', (msg) => {
        messages.push(msg);
        io.emit('chatMessage', msg); // Broadcast the message to all users
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
