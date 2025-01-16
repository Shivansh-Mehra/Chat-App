import wrapAsyncHandler from '../lib/wrapAsyncHandler.js'
import User from '../models/user.model.js';
export const loginForm = (req,res) => {
    res.send("login here");
} 

//logic -> if logged in and wanna log into another account, logout first then login.

export const loginLogic = (req,res) => {
    if(req.isAuthenticated()) {
        res.status(201).json({
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            profilePic: req.user.profilePic,
        });
    }
    res.send("login logic here");
}

export const signupForm = (req,res) => {
    res.send("signup here");
} 
export const signupLogic = wrapAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const { path, filename } = req.file || {path: "",filename: ""};
    let profilePic = { url: "", filename: "" };
    if (path) profilePic = { url: path, filename };
    if (!username || !email || !password) {
        res.status(400).send("All fields are required");
        return;
    }
    if (password && password.length < 6) {
        res.status(400).send("password must be at least 6 characters long");
        return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).send("Email already exists");
        return;
    }
    const user = new User({ username, email, profilePic });
    const newUser = await User.register(user, password);
    if (newUser) {
        await new Promise((resolve, reject) => {
            req.login(newUser, err => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    } else {
        res.send("error");
    }
});

export const logout = (req,res) => {
    if(!req.isAuthenticated()) {
        return res.status(400).send("You are not logged in");
    }
    req.logout(err => {
        if(err) {
            console.error(err);
            res.status(500).send("error while logging in!"); //create an error template while doing frontend
        }
        else res.redirect('/');
    });
}

export const updateForm = (req,res) => {
    res.send("update here");
}

export const updateProfile = wrapAsyncHandler(async(req,res) => {
    const {path,filename} = req.file;
    if(!path || !filename) {
        res.status(400).send("Please upload an image");
        return;
    }
    const profilePic = { url: path, filename };
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { profilePic });
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic
        });
    } catch(err) {
        res.status(500).send("error while updating profile");
    }
});

export const checkStatus = (req,res) => {
    if(req.isAuthenticated()) {
        res.send(req.user);
    } else {
        res.status(401).send("You are not logged in");
    }
}