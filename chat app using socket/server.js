const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = new Map();

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('User with ID', socket.id, 'connected');

    io.emit('users-count', users.size);

    socket.on('new-user-joined', (username) => {
        users.set(socket.id, username);
        io.emit('users-count', users.size);
        io.emit('user-joined', username);
    });

    socket.on('send-message', (message) => {
        const username = users.get(socket.id);
        io.emit('receive-message', { username, message });
    });

    socket.on('disconnect', () => {
        console.log('User with ID', socket.id, 'disconnected');
    });
});

server.listen(4000, () => {
    console.log('Chat server is running on http://localhost:4000');
});