const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors())
const {Server} = require("socket.io");
const http = require("node:http");
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

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
        io.to(to).emit("incoming:call",{from:socket.id,offer});
    });
})

server.listen(8001,()=>{
    console.log("Server is running on 8001");
})