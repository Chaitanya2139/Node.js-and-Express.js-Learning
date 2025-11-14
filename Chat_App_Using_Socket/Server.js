const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const path = require('path');
const server = http.createServer(app);
const io = new Server(server);
// Serve static files (use absolute path to avoid cwd issues)
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

const users = new Map();

io.on('connection',(socket)=>{
    console.log("User With ID ",socket.id," Connected");

    io.emit('users-count',users.size);

    socket.on('new-user-joined',(username)=>{
        users.set(socket.id,username);
        io.emit('users-count',users.size);
    });

    socket.on('send-message',(message)=>{
        const username = users.get(socket.id);
        io.emit('receive-message',{username,message});
    });

    socket.on('start-typing',()=>{
        const username = users.get(socket.id);
        socket.broadcast.emit('user-typing',username);
    });

    socket.on('stop-typing',()=>{
        socket.broadcast.emit('user-stop-typing');
    });


    // Client notifies server that a specific user stopped typing.
    // Broadcast this to other clients so they can update their UI.
    socket.on('user-stop-typing', (username) => {
        socket.broadcast.emit('user-stop-typing', username);
    });

    


    socket.on('disconnect',()=>{
        console.log("User With ID ",socket.id," Disonnected");
        users.delete(socket.id);
        io.emit('users-count',users.size);
    });
});

server.listen(4000,()=>{
    console.log("Server is running on port 4000");
});

