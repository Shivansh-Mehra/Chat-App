import express from 'express';
import {signupForm,loginForm,logout,loginLogic,signupLogic, updateProfile,updateForm} from '../controllers/auth.controller.js'
import passport from 'passport';
import { checkUser } from '../middleware/auth.checkUser.js';
import multer from 'multer';
import { storage } from '../lib/cloudinary.js';
const authRouter = express.Router();

const upload = multer({storage});

authRouter.route('/login')
            .get(loginForm)
            .post(passport.authenticate('local',{failureRedirect: '/removeme'}),loginLogic);
          
authRouter.route('/signup')
            .get(signupForm)
            .post(upload.single('image'),signupLogic);
authRouter.get('/logout',logout);

authRouter.route('/update-profile')
            .get(updateForm)
            .post(checkUser,upload.single('image'),updateProfile);

export default authRouter;