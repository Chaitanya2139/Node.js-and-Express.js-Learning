const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let stopwatch = {
    running: false,
    startTime: null,
    elapsedTime: 0
};

let broadcastInterval = null;

// Function to broadcast current time to all clients
function broadcastTime() {
    let currentTime = stopwatch.elapsedTime;
    if (stopwatch.running) {
        currentTime = Date.now() - stopwatch.startTime;
    }
    io.emit('time', currentTime);
}

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Send current time immediately when client connects
    let currentTime = stopwatch.elapsedTime;
    if (stopwatch.running) {
        currentTime = Date.now() - stopwatch.startTime;
    }
    socket.emit('time', currentTime);
    socket.emit('status', stopwatch.running ? 'started' : 'stopped');

    socket.on('start', () => {
        if (!stopwatch.running) {
            stopwatch.running = true;
            stopwatch.startTime = Date.now() - stopwatch.elapsedTime;
            io.emit('status', 'started');
            
            // Start broadcasting time every 10ms to all clients
            if (!broadcastInterval) {
                broadcastInterval = setInterval(broadcastTime, 10);
            }
        }
    });

    socket.on('stop', () => {
        if (stopwatch.running) {
            stopwatch.running = false;
            stopwatch.elapsedTime = Date.now() - stopwatch.startTime;
            io.emit('status', 'stopped');
            
            // Stop broadcasting
            if (broadcastInterval) {
                clearInterval(broadcastInterval);
                broadcastInterval = null;
            }
            
            // Send final time
            broadcastTime();
        }
    });

    socket.on('reset', () => {
        stopwatch.running = false;
        stopwatch.startTime = null;
        stopwatch.elapsedTime = 0;
        
        // Stop broadcasting
        if (broadcastInterval) {
            clearInterval(broadcastInterval);
            broadcastInterval = null;
        }
        
        io.emit('status', 'reset');
        io.emit('time', 0);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    });


const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
