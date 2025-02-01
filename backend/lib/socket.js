import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import User from '../models/user.model.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: ['http://localhost:5173']
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
    console.log('connected',socket.id);
    
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    
    (async () => {
        try {
            const user = await User.findById(userId);
            if (user && user.groups) {
                user.groups.forEach(groupId => {
                    io.emit("join-group",groupId);
                });
            }
        } catch (error) {
            console.error("Error fetching user groups:", error);
        }
    })();

    socket.on("join-group",groupId => { //this is not getting called correctly, fix later.
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    // socket.on("leave-group",id => {
    //     socket.leave(id);
    //     console.log(`Socket ${socket.id} left group ${id}`);
    // });

    socket.on("sendGroupMessage",({groupId,message}) => {
        io.to(groupId).emit("receiveGroupMessage",message);
    });

    socket.on('disconnect',() => {
        console.log('disconnected',socket.id);
        delete userSocketMap[userId];
        socket.leaveAll();
        io.emit("getOnlineUsers",Object.keys(userSocketMap)); //make sure "whatever is here matches the frontend"
    })
})

export {io,app,server};