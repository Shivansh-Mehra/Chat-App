const express = require('express');
const {Router} = express;
const router = Router();
const User = require('../models/User');
const passport = require('passport');

router.post('/register',async (req,res) => {
    const {username,email,password} = req.body;
    const user = new User({username,email});
    const newUser = await User.register(user,password);
    req.login(newUser,err => {
        if(err) return err;
    })
});

router.post('/login',passport.authenticate('local',{failureFlash : true , failureRedirect : '/users/login'}),async (req,res) => {
    res.redirect('/');
})

module.exports = router;