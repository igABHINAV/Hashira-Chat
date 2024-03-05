const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Redis = require("ioredis");
require("dotenv").config();
const app = express();
const { handleMessage } = require("./controller/messageController");
const { handleJoinRoom, handleLeaveRoom } = require("./controller/roomController");

const { availableParallelism } = require("node:os");
const cluster = require("node:cluster");
const { createAdapter} = require('@socket.io/cluster-adapter');



if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    // create one worker per available core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({
            PORT: parseInt(process.env.PORT) 
        });
    }

    // set up the adapter on the primary thread
    return setupPrimary();
}


//Creating pub/sub and server
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
    },
    adapter: createAdapter()
});

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//Websocket connection handlers
io.on("connection", (socket) => {
    console.log(`new socket connected : ${socket.id}`);
    handleMessage(socket, pub, io);
    handleJoinRoom(socket, sub);
    handleLeaveRoom(socket);
});

sub.on('message', (channel, message) => {
    console.log(`Received message on channel ${channel}: ${message}`);
});

const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });


