const { Queue } = require('bullmq');
const queue = new Queue('messages');

async function produceMessage(msg, id, socketId) {
    const data = JSON.stringify({ message: msg, room: id, socket: socketId });
    await queue.add('message', { data });
    console.log(`message produced !`)
}

module.exports = { produceMessage };
