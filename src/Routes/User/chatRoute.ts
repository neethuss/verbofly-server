import { Router } from "express";
import ChatController from "../../controllers/User/chatController";
import ChatService from "../../services/User/chatService";
import MessageService from "../../services/User/messageService";
import ChatRepositoryImplementation from "../../repositories/implementation/User/chatRepositoryImplementation";
import MessageRepositoryImplementation from "../../repositories/implementation/User/messageRepositoryImplementation";
import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import upload from "../../middlewares/uploadMiddleware";

const router = Router();

const chatRepositoryImplementation = new ChatRepositoryImplementation();
const messageRepositoryImplementation = new MessageRepositoryImplementation();
const chatService = new ChatService(chatRepositoryImplementation);
const messageService = new MessageService(messageRepositoryImplementation);
const chatController = new ChatController(chatService, messageService);

router.get('/chats/:userId/getuserchats', (req,res)=> chatController.getUserChats(req,res))
router.get('/:user1Id/:user2Id',  (req, res) => chatController.getOrCreateChat(req, res));
router.get('/message/:chatId/messages',  (req, res) => chatController.getChatMessages(req, res));
router.post('/message', (req, res) => chatController.sendMessage(req, res));
router.post('/image',(req,res)=>chatController.saveImage(req,res))
router.post('/upload', upload.single('file'), (req,res)=>chatController.sendImage(req,res))
router.post('/audio',(req,res)=>chatController.saveAudio(req,res))
router.post('/call',(req,res)=>chatController.saveCall(req,res))
router.post('/markAsRead', (req,res)=> chatController.markAsRead(req,res))
export default router;