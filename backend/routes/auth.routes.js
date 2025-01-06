import express from 'express';
import {signupForm,loginForm,logout,loginLogic,signupLogic} from '../controllers/auth.controller.js'
import passport from 'passport';
const authRouter = express.Router();

authRouter.route('/login')
            .get(loginForm)
            .post(passport.authenticate('local',{failureRedirect: '/removeme'}),loginLogic);
          
authRouter.route('/signup')
            .get(signupForm)
            .post(signupLogic);
authRouter.get('/logout',logout);

export default authRouter;