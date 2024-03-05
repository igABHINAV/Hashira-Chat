import React, { useEffect, useState } from 'react';


const Page = (props) => {
  const [msg, setMsg] = useState(""); // Initialize the state with an empty string
  const socket = props.socket;
  const sendMessage = () => {
    console.log(msg);
    socket.emit("message", msg); // No need to await here
  };

  const handleChange = (e) => {
    setMsg(e.target.value); // Update the state with the new value
  };

  return (
    <div>
      <label >Message : </label>
      <input 
        placeholder='message' 
        type='text' 
        value={msg} 
        onChange={handleChange} 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Page;
