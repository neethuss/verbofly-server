import { Request, Response } from 'express';
import ChatService from '../../services/User/chatService';
import MessageService from '../../services/User/messageService';
import { ObjectId } from 'mongodb';
import { CustomRequest } from "../../middlewares/authenticationMiddleware";


class ChatController {
  private chatService: ChatService;
  private messageService: MessageService;

  constructor(chatService: ChatService, messageService: MessageService) {
    this.chatService = chatService;
    this.messageService = messageService;
  }

  async getOrCreateChat(req: Request, res: Response): Promise<void> {
    try {
      // console.log('getOrCreatechat')
      const { user1Id, user2Id } = req.params;
      // console.log(user1Id, user2Id,'para')
      const user1ObjectId = new ObjectId(user1Id);
      const user2ObjectId = new ObjectId(user2Id);
      // console.log(user1ObjectId, user2ObjectId,'obj')
      const chat = await this.chatService.getOrCreateChat(user1ObjectId, user2ObjectId);
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching or creating chat' });
    }
  }

  async getChatMessages(req: Request, res: Response): Promise<void> {
    try {
      // console.log('getChatMessages')
      const { chatId } = req.params;
      // console.log(chatId,'chatId')
      const chatObjectId = new ObjectId(chatId)
      const messages = await this.messageService.getMessagesByChatId(chatObjectId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages' });
    }
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, senderId, messageText } = req.body;
      if (!messageText || messageText.trim() === "") {
        res.status(400).json({ message: "Message text cannot be empty" });
        return;
      }
  
      const newMessage = await this.messageService.createMessage(chatId, senderId, messageText);
      await this.chatService.updateChatTimestamp(chatId);
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ message: "Error sending message" });
    }
  }


  async saveImage(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, senderId, fileUrl } = req.body
      console.log(fileUrl,'file url back')
      if (fileUrl) {
        const newMessage = await this.messageService.createImageMessage(chatId, senderId, fileUrl);
        await this.chatService.updateChatTimestamp(chatId);
        res.status(201).json(newMessage);
      } else {
        res.status(400).json({ message: "Image URL is invalid" });
      }
    } catch (error) {
      console.error('Error in sendImage:', error);
      res.status(500).json({ message: "Error sending image", error });
    }
  }


  async saveAudio(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, senderId, fileUrl } = req.body
      console.log(fileUrl,'file url back')
      if (fileUrl) {
        const newMessage = await this.messageService.createAudioMessage(chatId, senderId, fileUrl);
        await this.chatService.updateChatTimestamp(chatId);
        res.status(201).json(newMessage);
      } else {
        res.status(400).json({ message: "Image URL is invalid" });
      }
    } catch (error) {
      console.error('Error in sendImage:', error);
      res.status(500).json({ message: "Error sending audio", error });
    }
  }

  async saveCall(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, senderId, call } = req.body
      if (call) {
        const newMessage = await this.messageService.createCallMessage(chatId, senderId, call);
        await this.chatService.updateChatTimestamp(chatId);
        res.status(201).json(newMessage);
      } else {
        res.status(400).json({ message: "Image URL is invalid" });
      }
    } catch (error) {
      console.error('Error in sendImage:', error);
      res.status(500).json({ message: "Error sending audio", error });
    }
  }



  

  async sendImage(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
  
      const { chatId, senderId } = req.body;
      const fileUrl = (req.file as any).location;
  
      console.log('File URL:', fileUrl); 
      console.log('Chat ID:', chatId, 'Sender ID:', senderId);
  
      if (fileUrl) {
       
        res.status(201).json(fileUrl);
      } else {
        res.status(400).json({ message: "Image URL is invalid" });
      }
    } catch (error) {
      console.error('Error in sendImage:', error);
      res.status(500).json({ message: "Error sending image", error });
    }
  }
  

  async getUserChats(req: Request, res: Response): Promise<void> {
    // console.log('getUserChats')
    try {
      const { userId } = req.params;
      const userObjectId = new ObjectId(userId);
      const chats = await this.chatService.getUserChats(userObjectId);
      // console.log(chats,'getUserChats controller return' )
      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user chats' });
    }
  }

  async markAsRead(req:Request, res:Response):Promise<void>{
    try {
      // console.log('marking as read')
      const { chatId, userId } = req.body;
      try {
        const messages = await this.messageService.markAsRead(chatId, userId)
        res.status(200).json(messages)
      } catch (error) {
        res.status(500).json({ message: 'Error fetching user chats' });
      }
    } catch (error) {
      
    }
  }


}

export default ChatController;