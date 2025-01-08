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
