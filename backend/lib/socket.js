import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: ['http://localhost:5173']
    }
})
//store online users

const userSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection",(socket) => {
    console.log('connected',socket.id);
    
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("join-group",groupId => {
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on("leave-group",id => {
        socket.leave(id);
        console.log(`Socket ${socket.id} left group ${id}`);
    });

    socket.on("sendGroupMessage",({groupId,message}) => {
        io.to(groupId).emit("receiveGroupMessage",message);
});

    socket.on('disconnect',() => {
        console.log('disconnected',socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap)); //make sure "whatever is here matches the frontend"
    })
})

export {io,app,server};