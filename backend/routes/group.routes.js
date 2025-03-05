import {Router} from 'express';
const router = Router();
import { checkUser } from '../middleware/auth.checkUser.js';
import { createGroup,getGroupMessages,sendGroupMessage,getGroups,getGroupMembers,addMember,leaveGroup } from '../controllers/group.controller.js';
import multer from 'multer';
import { storage } from '../lib/cloudinary.js';

const upload = multer({storage});


router.post('/create',checkUser,createGroup);
router.get('/:groupId/messages',checkUser, getGroupMessages);
router.post('/:groupId/message',checkUser,upload.single('image'), sendGroupMessage);
router.get('/get',checkUser,getGroups);
router.get('/:groupId/members',checkUser,getGroupMembers);
router.post('/:groupId/addMember',checkUser,addMember);
router.post('/:groupId/leave',checkUser,leaveGroup);

export default router;