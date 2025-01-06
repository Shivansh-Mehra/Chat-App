import { response } from 'express';
import User from '../models/user.model.js';
export const loginForm = (req,res) => {
    res.send("login here");
} 

//logic -> if logged in and wanna log into another account, logout first then login.

export const loginLogic = (req,res) => {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send("login logic here");
}

export const signupForm = (req,res) => {
    res.send("signup here");
} 

export const signupLogic = async (req,res) => {
    const {username,email,password,profilePic} = req.body;
    if(!username || !email || !password) {
        res.status(400).send("All fields are required");
        return;
    }
    if(password && password.length < 6) {
        res.status(400).send("password must be atleast 6 characters long");
        return;
    }
    const user = await new User({username,email,profilePic});
    const newUser = await User.register(user,password);
    if(newUser) {
        req.login(newUser,err => {
            if(err) {
                console.error(err);
            }
        })
        res.redirect('/');
    } else {
        res.send("error");
    }
}

export const logout = (req,res) => {
    if(!req.isAuthenticated()) {
        return res.redirect('/removeme');
    }
    req.logout(err => {
        if(err) {
            console.error(err);
            res.redirect('/removeme');
        }
        else res.redirect('/');
    });
}