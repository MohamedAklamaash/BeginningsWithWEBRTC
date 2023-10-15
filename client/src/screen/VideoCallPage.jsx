import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../services/p2p";
import "../index.css";
const VideoCallPage = () => {
  const [SocketId, setSocketId] = useState(null);
  const [myStream, setmyStream] = useState("");
  const [remoteStream, setremoteStream] = useState("");
  const socket = useSocket();
  const handleNewPersonInRoom = useCallback(({ email, id }) => {
    console.log(`${email} joined this room`);
    setSocketId(id);
  }, []);
  const handleCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: SocketId, offer });
    setmyStream(stream);
  }, [socket, SocketId]);
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setmyStream(stream);
      setSocketId(from);
      const answerCall = await peer.getAnswer(offer);
      console.log(answerCall);
      socket.emit("call:accepted", { to: from, ans: answerCall });
    },
    [socket]
  );

  const sendStream = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  },[myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("call accepted");
    },
    [sendStream]
  );

  const handleNegotiationNeeded = async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: SocketId });
  };
  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remotestream = ev.streams;
      setremoteStream(remotestream[0]);
    });
  }, []);

  const handleNegotiationIncoming = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans });
  }, []);
  const handleNegofinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);
  useEffect(() => {
    socket.on("room", handleNewPersonInRoom);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call_accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationIncoming);
    socket.on("peer:nego:final", handleNegofinal);
    return () => {
      socket.off("room", handleNewPersonInRoom);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call_accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegotiationIncoming);
      socket.off("peer:nego:final", handleNegofinal);
    };
  }, [
    socket,
    handleIncomingCall,
    handleNewPersonInRoom,
    handleIncomingCall,
    handleCallAccepted,
    handleNegofinal,
  ]);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Room Page</h1>
      <h1>{SocketId ? "Connected" : "No on in this room"}</h1>
      {SocketId ? <button onClick={sendStream}>Send Stream</button> : ""}
      <h1> {SocketId ? <button onClick={handleCall}>Call</button> : ""}</h1>
      <div className="videoCall">
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
        {remoteStream && (
          <>
            <h1>Remote Stream</h1>
            {console.log("RemoteStream:", remoteStream)}
            <ReactPlayer
              height="200px"
              width="300px"
              url={remoteStream}
              playing={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
