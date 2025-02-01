import wrapAsyncHandler from "../lib/wrapAsyncHandler.js";
import Message from "../models/message.model.js";
import Group from "../models/group.model.js";
import User from '../models/user.model.js';
import {io,getReceiverSocketId} from '../lib/socket.js'

export const createGroup = wrapAsyncHandler(async (req, res) => {
    const { name, members } = req.body;
    if (!name || !members) {
        res.status(400).send("Name and members are required");
        return;
    }
    try {
        const group = new Group({ name, members });
        await group.save();

        await User.updateMany(
            { _id: { $in: members } },
            { $push: { groups: group._id } }
        );

        for(let member of members) {
            const socketID = getReceiverSocketId(member);
            if(socketID) {
                io.to(socketID).emit("join-group",group._id);
            }
        }
    } catch (err) {
        res.status(500).send("Error creating group");
    }
});

export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Remove the group from all members' groups array
        await User.updateMany(
            { _id: { $in: group.members } },
            { $pull: { groups: groupId } }
        );

        // Delete the group from the database
        await Group.findByIdAndDelete(groupId);
        res.status(200).json({ message: "Group deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getGroupMessages = wrapAsyncHandler(async (req,res) => {
    const {groupId} = req.params;
    try {
        const messages = await Message.find({groupId}).populate('senderId','username profilePic').sort({createdAt: 1});
        res.status(200).json(messages);
    } catch(err) {
        res.status(500).send("Error while fetching messages");
    }
});

export const sendGroupMessage = wrapAsyncHandler(async (req,res) => {
    // console.log("in backend");
    const {groupId} = req.params;
    const id = groupId;
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
        // const msg = new Message({senderId: req.user._id,groupId: id,message: text,image});
        let msg = new Message({
            senderId: req.user._id,
            groupId,
            message: text,
            image
        });
        await msg.save();
        msg = await msg.populate('senderId', 'username profilePic');
        //add websocket code here
        io.to(id).emit("newGroupMessage",msg);
        res.status(200).json(msg);
    } catch(err) {
        res.status(500).send("Error sending message");
    }
});

export const getGroups = wrapAsyncHandler (async (req,res) => {
    try {
        // console.log(req.user._id);
        const groups = await Group.find({members: {$in: [req.user._id]}});
        // console.log(groups);
        res.status(200).json(groups);
    } catch(err) {
        res.status(500).send("Error fetching groups");
    }
})