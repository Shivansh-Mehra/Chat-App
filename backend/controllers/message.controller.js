import wrapAsyncHandler from '../lib/wrapAsyncHandler.js';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../lib/socket.js';
import redisClient from '../lib/client.js';

export const getSidebarUsers = wrapAsyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).send("You are not logged in");
        return;
    }
    const loggedInId = req.user._id;
    try {
const cachedUsers = await redisClient.get(`sidebarUsers:${loggedInId}`);
        if (cachedUsers) {
            return res.status(200).json(JSON.parse(cachedUsers));
        }
        const users = await User.find({ _id: { $ne: loggedInId } });
await redisClient.set(`sidebarUsers:${loggedInId}`, JSON.stringify(users), 'EX', 3600);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send("Error while fetching users");
    }
});

export const getMessages = wrapAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
const cachedMessages = await redisClient.get(`messages:${req.user._id}:${id}`);
        if (cachedMessages) {
            return res.status(200).json(JSON.parse(cachedMessages));
        }
        const messages = await Message.find({ $or: [{ senderId: req.user._id, receiverId: id }, { senderId: id, receiverId: req.user._id }] })
        .populate('senderId', 'username profilePic').sort({ createdAt: 1 });
await redisClient.set(`messages:${req.user._id}:${id}`, JSON.stringify(messages), 'EX', 3600);
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).send("Error while fetching messages");
    }
});

export const sendMessage = wrapAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const { path, filename } = req.file || {};
    if (!text && !path) {
        res.status(400).send("Message or image is required");
        return;
    }
    let image;
    if (path) {
        image = { url: path, filename };
    }
    if (!path) { 
       image = null;
    }
    try {
        let msg = await new Message({ senderId: req.user._id, receiverId: id, message: text, image });
        await msg.save();
        msg = await msg.populate('senderId', 'username profilePic');
        const receiverSocketId = getReceiverSocketId(id);        
        const senderSocketId = getReceiverSocketId(req.user._id);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", msg);        
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", msg);
        }

        await redisClient.del(`messages:${req.user._id}:${id}`);
        await redisClient.del(`messages:${id}:${req.user._id}`);

        res.status(200).json(msg);
    } catch (err) {
        res.status(500).send("Error sending message");
    }
});