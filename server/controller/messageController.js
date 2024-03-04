async function handleMessage(socket, pub, io) {
    socket.on("message", async (msg, id) => {
        const data = JSON.stringify({ message: msg, room: id, socket: socket.id });
        await pub.publish(id, msg);
        io.to(id).emit("take_message", msg);
        console.log(data);
    });
}

module.exports = { handleMessage };
