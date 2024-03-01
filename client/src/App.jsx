import Page from "./components/Page"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { io } from 'socket.io-client';
import TestRoom from "./components/TestRoom";
import Room from "./components/Room";

const socket = io("http://localhost:5000");
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/page" element={<Page socket={socket} />} />
          <Route path="/room/:id" element={<TestRoom socket={socket}/>} />
          <Route path="/"  element={<Room socket={socket}/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
