import express from 'express';
const messageRouter = express.Router();
import {getSidebarUsers,getMessages,sendMessage} from '../controllers/message.controller.js';
import {checkUser} from '../middleware/auth.checkUser.js';
import multer from 'multer';
import { storage } from '../lib/cloudinary.js';

const upload = multer({storage});

messageRouter.route('/users')
                .get(checkUser,getSidebarUsers);

messageRouter.route('/:id')
                .get(checkUser,getMessages);

messageRouter.route('/send/:id')
                .post(checkUser,upload.single('image'),sendMessage);

export default messageRouter;