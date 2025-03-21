import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import User from '../models/user.model.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: process.env.NODE_ENV === "development" ? ['http://localhost:5173'] : ["http://localhost:80"]
    }
})
//store online users

const userSocketMap = {};
const groupSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export function getGroupSocketId(groupId) {
    return groupSocketMap[groupId];
}


io.on("connection",(socket) => {
    
    const userId = socket.handshake.query.userId;
    if(!userId || userId === "undefined") {
        // socket.disconnect();
        console.log(socket.handshake.query);
        console.log("jjnca");
        return;
    }
    if(userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    
    (async () => {
        try {
            let user;
            if(userId) user = await User.findById(userId);
            if (user && user.groups) {
                user.groups.forEach(groupId => {
                    io.emit("join-group",groupId);
                });
            }
        } catch (error) {
            console.error("Error fetching user groups:", error);
        }
    })();

    socket.on("join-group",groupId => { 
        socket.join(groupId);
    });

    socket.on("sendGroupMessage",({groupId,message}) => {
        io.to(groupId).emit("receiveGroupMessage",message);
    });

    socket.on('disconnect',() => {
        delete userSocketMap[userId];
        socket.leaveAll();
        io.emit("getOnlineUsers",Object.keys(userSocketMap)); //make sure "whatever is here matches the frontend"
    })
})

export {io,app,server};