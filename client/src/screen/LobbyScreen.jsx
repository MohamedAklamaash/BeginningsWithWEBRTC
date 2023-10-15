import React, { useState, useCallback, useEffect } from "react";
import "../index.css";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";
const LobbyScreen = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [room, setroom] = useState(0);
  const socket = useSocket();
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      socket.emit("room", { email, room });
    },
    [email, room, socket]
  );
  const handleRoomJoin = useCallback((data)=>{
    const {email,room} = data;
    navigate(`https://akla-video-call-app.vercel.app/room/${room}`);
  },[navigate])
  useEffect(() => {
    socket.on("room", handleRoomJoin);
    return(()=>{
      socket.off("room",handleRoomJoin);
    })
  }, [socket,handleRoomJoin]);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Lobby Screen</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="text">Enter Your Email ID:</label>
        <input
          type="text"
          id="text"
          placeholder="123@gmail.com"
          onChange={(event) => setemail(event.target.value)}
        />
        <br />
        <label htmlFor="room">Join Room:</label>
        <input
          type="number"
          id="room"
          placeholder="10"
          onChange={(event) => setroom(event.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LobbyScreen;
