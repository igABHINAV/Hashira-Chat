const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Redis = require("ioredis");
const app = express();


const pub = new Redis({
    host: 'localhost',
    port: 6379,
});

const sub = new Redis({
    host: 'localhost',
    port: 6379,
});



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*"
    }
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());



io.on("connection", (socket) => {
    console.log(`new socket connected : ${socket.id}`);

    socket.on("message", async (msg, id) => {
        const data = JSON.stringify({ message: msg, room: id, socket: socket.id });
        await pub.publish(id, msg);
        io.to(id).emit("take_message", msg);
        console.log(data);
    });


    socket.on("join_room", async (room) => {
        console.log(`joining room`, room);
        socket.join(room);
        socket.broadcast.emit("joined_room", socket.id);

        sub.subscribe(room, (err, room) => {
            if (err) {
                console.error('Error subscribing to channel:', err);
            } else {
                console.log(`Subscribed to ${room} channels`);
            }
        });

        
        
        console.log(`joined room`);
    });
    

    

    socket.on("leave_room", (room) => {
        socket.leave(room);
    });
});
sub.on('message', (channel, message) => {
    console.log(`Received message on channel ${channel}: ${message}`);
});







server.listen(5000, () => {
    console.log(`server is running on port : 5000`);
});
