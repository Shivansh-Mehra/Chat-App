import express from 'express';
import {Router} from 'express';
const router = Router();

router.post('/create',createGroup);
router.get('/:groupId/messages', getGroupMessages);
router.post('/:groupId/message', sendGroupMessage);

export default router;