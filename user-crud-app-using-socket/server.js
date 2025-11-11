const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const path = require('path');

app.use(express.json());
// Serve static files from absolute path to avoid cwd-relative issues.
app.use(express.static(path.join(__dirname, 'public')));

// Ensure GET / returns the index file (explicit route avoids 404 when
// static lookup fails due to cwd/path issues).
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Debug endpoint: return the CSP header value that the server sets and
// request headers so you can inspect what's actually being returned to the
// browser. Open http://localhost:4000/__csp__ in your browser or curl it.
app.get('/__csp__', (req, res) => {
    // res.getHeader is available on the Node response object
    const serverCsp = res.getHeader('Content-Security-Policy') || null;
    res.json({
        serverCsp,
        requestHeaders: req.headers,
    });
});

let users = [
    {id: 1, name: 'Amit', email:'amit@gmail.com'},
    {id: 2, name: 'Suman', email:'suman@gmail.com'},
]

io.on('connection', (socket) => {
    console.log('User with ID', socket.id, 'connected');

    io.emit('users', users);

    socket.on('add-user', (user) => {
        const newUser = {
            id: users.length + 1,
            name: user.name,
            email: user.email,
        };
        users.push(newUser);
        io.emit('users', users);
    });

    socket.on('delete-user', (id) => {
        users = users.filter((user) => user.id !== id);
        io.emit('users', users);
    });

    socket.on('update-user', (user) => {
        const updatedUser = users.find((u) => u.id === user.id);
        if (updatedUser) {
            updatedUser.name = user.name;
            updatedUser.email = user.email;
        }
        io.emit('users', users);
    });

    socket.on('update-user-email', (user) => {
        const updatedUser = users.find((u) => u.id === user.id);
        if (updatedUser) {
            updatedUser.email = user.email;
        }
        io.emit('users', users);
    }); 

    socket.on('update-user-name', (user) => {
        const updatedUser = users.find((u) => u.id === user.id);
        if (updatedUser) {
            updatedUser.name = user.name;
        }
        io.emit('users', users);
    });
        

    socket.on('disconnect', () => {
        console.log('User with ID', socket.id, 'disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});