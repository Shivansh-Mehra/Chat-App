import {Router} from 'express';
const router = Router();
import { checkUser } from '../middleware/auth.checkUser.js';
import { createGroup,getGroupMessages,sendGroupMessage,getGroups } from '../controllers/group.controller.js';

router.post('/create',checkUser,createGroup);
router.get('/:groupId/messages',checkUser, getGroupMessages);
router.post('/:groupId/message',checkUser, sendGroupMessage);
router.get('/get',checkUser,getGroups);

export default router;