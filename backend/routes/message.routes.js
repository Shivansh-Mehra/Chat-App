import express from 'express';
const messageRouter = express.Router();
import {getSidebarUsers} from '../controllers/message.controller.js';

messageRouter.route('/users')
                .get(getSidebarUsers);

export default messageRouter;