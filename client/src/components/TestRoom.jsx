import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TestRoom = (props) => {
    const { id } = useParams();
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const socket = props.socket;
    const navigate = useNavigate();

    socket.on("joined_room", (id) => {
        console.log(`socket id : ${id} joined the room `);
    });

    useEffect(() => {
        socket.on("take_message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
        return () => {
            socket.off("take_message");
        };
    }, [socket]);

    const sendMessage = () => {
        console.log(msg);
        socket.emit("message", msg, id);
        setMsg(""); // Clear the input field after sending the message
    };

    const handleChange = (e) => {
        setMsg(e.target.value);
    };

    const leaveRoom = async (id) => {
        await socket.emit("leave_room", id);
        navigate("/");
    };

    return (
        <div >
            Hi testroom with name: {id}
            <button onClick={() => leaveRoom(id)}>Leave</button>
            <div>
                <label>Message : </label>
                <input
                    placeholder='message'
                    type='text'
                    value={msg}
                    onChange={handleChange}
                />
                <button onClick={sendMessage}>Send</button>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TestRoom;
