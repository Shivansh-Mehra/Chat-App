import {Router} from 'express';
const router = Router();
import { createGroup,getGroupMessages,sendGroupMessage } from '../controllers/group.controller.js';

router.post('/create',createGroup);
router.get('/:groupId/messages', getGroupMessages);
router.post('/:groupId/message', sendGroupMessage);

export default router;