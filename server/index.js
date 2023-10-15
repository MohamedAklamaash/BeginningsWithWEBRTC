const express = require("express");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "https://akla-video-call-app.vercel.app",
  })
);
const {Server} = require("socket.io");
const dotenv = require("dotenv").config();
const http = require("node:http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://akla-video-call-app.vercel.app",
    methods: ["GET", "POST"],
  },
});
app.route("/",(req,res)=>{
    return res.send("Backend of Video call app");
})
const emailIdToSocket = new Map();
const SocketIdToEmailId = new Map();

io.on("connection",(socket)=>{
    socket.on("room",(data)=>{
        const {email,room} = data;
        emailIdToSocket.set(email,socket.id);
        SocketIdToEmailId.set(socket.id,email);
        io.to(room).emit("room",{email,id:socket.id});
        socket.join(room);
        io.to(socket.id).emit("room",data);
    });

    socket.on("user:call",({to,offer})=>{
        console.log("User calling");
        io.to(to).emit("incoming:call",{from:socket.id,offer});
    });
    
    socket.on("call:accepted",({to,ans})=>{
        console.log("Call accepted");
        io.to(to).emit("call_accepted", { from:socket.id,ans});
    });

    socket.on("peer:nego:needed",({offer,to})=>{
        io.to(to).emit("peer:nego:needed",{from:socket.id,offer});
    });

    socket.on("peer:nego:done",({to,ans})=>{
        io.to(to).emit("peer:nego:final",{from:to,ans});
    });
})

server.listen(process.env.PORT,()=>{
    console.log("Server is running on 8001");
})