import wrapAsyncHandler from "../lib/wrapAsyncHandler";
import User from "../models/user.model";
import Message from "../models/message.model";
import { getReceiverSocketId, io } from "../lib/socket";
import Group from "../models/group.model";

export const createGroup = wrapAsyncHandler(async (req, res) => {
    const { name, members } = req.body;
    if (!name || !members) {
        res.status(400).send("Name and members are required");
        return;
    }
    try {
        const group = await new Group({ name, members });
        await group.save();
        res.status(200).json(group);
    } catch (err) {
        res.status(500).send("Error creating group");
    }
});

export const getGroupMessages = wrapAsyncHandler(async (req,res) => {
    const {id} = req.params;
    try {
        const messages = await Message.find({groupId: id}).populate('senderId','username profilePic').sort({createdAt: 1});
        res.status(200).json(messages);
    } catch(err) {
        res.status(500).send("Error while fetching messages");
    }
});

export const sendGroupMessage = wrapAsyncHandler(async (req,res) => {
    const {id} = req.parans;
    const {text} = req.body;
    const {path,filename} = req.file || {};
    if(!text && !path) {
        res.status(400).send("Message or image is required");
        return;
    }
    let image;
    if(path) {
        image = {url: path,filename};
    }
    if(!path) {
        image = null;
    }
    try {
        const msg = await new Message({senderId: req.user._id,groupId: id,message: text,image});
        await msg.save();
        res.status(200).json(msg);
    } catch(err) {
        res.status(500).send("Error sending message");
    }
});