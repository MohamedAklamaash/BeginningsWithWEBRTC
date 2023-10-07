import React,{useEffect,useCallback,useState} from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from "react-player";
const VideoCallPage = () => {
  const [SocketId, setSocketId] = useState(null);
  const [myStream, setmyStream] = useState("")
  const socket = useSocket();
  const handleNewPersonInRoom = useCallback(({email,id})=>{
    console.log(`${email} joined this room`)
    setSocketId(id);
  },[])
  const handleCall = useCallback(async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true});
    setmyStream(stream);
  },[]);
  useEffect(()=>{
    socket.on("room",handleNewPersonInRoom);
    return(()=>{
      socket.off("room", handleNewPersonInRoom);
    })
  })
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Room Page</h1>
      <h1>{SocketId ? "Connected" : "No on in this room"}</h1>
      <h1> {SocketId ? <button onClick={handleCall}>Call</button> : ""}</h1>
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            height="200px"
            width="300px"
            url={myStream}
            playing={true}
          />
        </>
      )}
    </div>
  );
}

export default VideoCallPage;