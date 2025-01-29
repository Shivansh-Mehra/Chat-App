import wrapAsyncHandler from "../lib/wrapAsyncHandler.js";
import Message from "../models/message.model.js";
import Group from "../models/group.model.js";

export const createGroup = wrapAsyncHandler(async (req, res) => {
    const { name, members } = req.body;
    if (!name || !members) {
        res.status(400).send("Name and members are required");
        return;
    }
    try {
        const group = new Group({ name, members });
        await group.save();
        res.status(200).json(group);
    } catch (err) {
        res.status(500).send("Error creating group");
    }
});

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
    console.log("body: ");
    console.log(req.body);
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
        const msg = new Message({senderId: req.user._id,groupId: id,message: text,image});
        await msg.save();
        res.status(200).json(msg);
    } catch(err) {
        res.status(500).send("Error sending message");
    }
});

export const getGroups = wrapAsyncHandler (async (req,res) => {
    try {
        console.log(req.user._id);
        const groups = await Group.find({members: {$in: [req.user._id]}});
        console.log(groups);
        res.status(200).json(groups);
    } catch(err) {
        res.status(500).send("Error fetching groups");
    }
})