// main file
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Redis = require("ioredis");
require("dotenv").config();
const app = express();
const { handleMessage } = require("./controller/messageController");
const { handleJoinRoom, handleLeaveRoom } = require("./controller/roomController");

const pub = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

const sub = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
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
    handleMessage(socket, pub, io);
    handleJoinRoom(socket, sub);
    handleLeaveRoom(socket);
});

sub.on('message', (channel, message) => {
    console.log(`Received message on channel ${channel}: ${message}`);
});

server.listen(process.env.PORT, () => {
    console.log(`server is running on port : ${process.env.PORT}`);
});
