const { Redis } = require("ioredis"); // Corrected import

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*"
    }
});

// const pub = new Redis({
//     username: "default",
//     password: "vDXpBEWVneZ0kPt8trR2zAAxdwzc8vmn",
//     host: "redis-13947.c264.ap-south-1-1.ec2.cloud.redislabs.com",
//     port: 13947,
//     lazyConnect: true,
//     keepAlive: 1000
// });

// pub.on("error", (err) => {
//     console.error("Redis connection error:", err);
// });

// const sub = new Redis({
//     username: "default",
//     password: "vDXpBEWVneZ0kPt8trR2zAAxdwzc8vmn",
//     host: "redis-13947.c264.ap-south-1-1.ec2.cloud.redislabs.com",
//     port: 13947,
//     lazyConnect: true,
//     keepAlive: 1000
// });

// sub.on("error", (err) => {
//     console.error("Redis connection error:", err);
// });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
    console.log(`new socket connected : ${socket.id}`);

    socket.on("message", async (msg, id) => {
        const data = JSON.stringify({ message: msg, room: id, socket: socket.id });
        // await pub.publish(id, data);
        io.to(id).emit("take_message", msg);
        console.log(data);
    });

    socket.on("join_room", async (room) => {
        console.log(`joining room`, room);
        socket.join(room);
        // await sub.subscribe(room);
        socket.broadcast.emit("joined_room", socket.id);
        console.log(`joined room`);
    });

    // sub.on("message", (room, msg) => {
    //     io.to(room).emit("take_message", JSON.parse(msg).message);
    // });

    socket.on("leave_room", (room) => {
        socket.leave(room);
    });
});

server.listen(5000, () => {
    console.log(`server is running on port : 5000`);
});
