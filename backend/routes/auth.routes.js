import express from 'express';
import {signupForm,logout,loginLogic,signupLogic, updateProfile,updateForm,checkStatus} from '../controllers/auth.controller.js'
import passport from 'passport';
import {checkUser} from '../middleware/auth.checkUser.js';
import multer from 'multer';
import { storage } from '../lib/cloudinary.js';
const authRouter = express.Router();

const upload = multer({storage});

authRouter.route('/login')
            .post(passport.authenticate('local'), loginLogic);
          
authRouter.route('/signup')
            .get(signupForm)
            .post(signupLogic);
authRouter.get('/logout',logout);

authRouter.route('/update-profile')
            .get(updateForm)
            .post(checkUser,upload.single('image'),updateProfile);

authRouter.route('/isLoggedIn')
            .get(checkStatus);

export default authRouter;