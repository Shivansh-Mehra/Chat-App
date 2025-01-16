import wrapAsyncHandler from '../lib/wrapAsyncHandler.js'
import User from '../models/user.model.js';
import Message from '../models/message.model.js';

export const getSidebarUsers = wrapAsyncHandler(async (req,res) => {
    if(!req.isAuthenticated()) {
        res.status(401).send("You are not logged in");
        return;
    }
    const loggedInId = req.user._id;
    try {
        const users = await User.find({_id: {$ne: loggedInId}});
        res.status(200).json(users);
    } catch(err) {
        res.status(500).send("Error while fetching users");
    }
})

export const getMessages = wrapAsyncHandler(async (req,res) => {
    const {id} = req.params;
    try {
        const messages = await Message.find({$or: [{senderId: req.user._id,receiverId: id},{senderId: id,receiverId: req.user._id}]});
        res.status(200).json(messages);
    } catch (err) {
        res.status(200).send("Error while fetching messages");
    }
})

export const sendMessage = wrapAsyncHandler(async (req,res) => {
    const {id} = req.params;
    const {text,path,filename} = req.body;
    if(!text && !path) {
        // console.log("here");
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
        const msg = await new Message({senderId: req.user._id,receiverId: id,message: text,image});
        await msg.save();
        res.status(200).json(msg);
    } catch(err) {
        res.status(500).send("Error sending message");
    }
}
)