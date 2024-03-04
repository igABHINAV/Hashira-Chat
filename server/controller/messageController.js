const { produceMessage } = require("../queue/messages/producer");


async function handleMessage(socket, pub, io) {
    socket.on("message", async (msg, id) => {
        try {
            
            console.log(`Message sent to room ${id}: ${msg}`);
            await pub.publish(id, msg);
            io.to(id).emit('take_message', msg);
            await produceMessage(msg, id, socket.id);
        } catch (error) {
            console.error("Error producing message:", error);
        }
    });
}

module.exports = { handleMessage };
