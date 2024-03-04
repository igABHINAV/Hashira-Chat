const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { Server } = require('socket.io');

// Initialize Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

// Initialize Socket.IO server
const io = new Server({
  cors: {
    methods: ["GET", "POST"],
    origin: "*"
  }
});

// Create a BullMQ worker to consume messages
const worker = new Worker('messages', async (job) => {
  try {
    // Publish message to Redis channel
    const dataa = JSON.parse(job.data.data);
    await redisClient.publish(dataa.room, dataa.message);

    // Emit message to Socket.IO room
    console.log(`room : ${dataa.room} and message : ${dataa.message}`);
    io.to(dataa.room).emit('take_message', dataa.message);
      
    console.log(`Message successfully processed`);
  } catch (error) {
    console.error(`Error processing message: ${error}`);
  }
}, {
  connection: redisClient
});

// Handle worker errors
worker.on('error', (error) => {
  console.error(`Worker error: ${error}`);
});

// Handle worker completed jobs
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

// Handle worker failed jobs
worker.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed with error: ${error}`);
});
