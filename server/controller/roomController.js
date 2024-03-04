function handleJoinRoom(socket, sub) {
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
}

function handleLeaveRoom(socket) {
    socket.on("leave_room", (room) => {
        socket.leave(room);
    });
}

module.exports = { handleJoinRoom, handleLeaveRoom };
