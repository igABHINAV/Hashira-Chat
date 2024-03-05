import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Room = (props) => {
  const socket = props.socket;
  const [room, setRoom] = useState(""); // Corrected to setRoom instead of setroom
  const navigate = useNavigate();

  const joinRoom = async () => {
    await socket.emit("join_room", room);
    console.log(`event of join room emmited`);
    navigate(`/room/${room}`);
  };



  return (
    <div>
      
      <input type='text' placeholder='Enter your room name' value={room} onChange={(e) => setRoom(e.target.value)} /> {/* Corrected to setRoom instead of setroom */}
      <button onClick={joinRoom}>Enter</button>
    </div>
  );
};

export default Room;
