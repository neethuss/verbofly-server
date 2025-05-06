import { Response } from 'express'

import { CustomRequest } from "../../middlewares/authenticationMiddleware";

import ConnectionService from "../../services/User/connectionService";
import UserService from '../../services/User/userService';


class ConnectionController {
  private connectionService: ConnectionService
  private userService: UserService

  constructor(connectionService: ConnectionService, userService:UserService) {
    this.connectionService = connectionService,
    this.userService = userService

  }


  async sendConnectionRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const email = req.user
      const user = await this.userService.findByEmail(email as string)
      const senderId = user?._id as string
      const { receiverId } = req.body;

      if (!senderId || !receiverId) {
        res.status(400).json({ message: 'Missing sender or receiver ID' });
        return;
      }

      const result = await this.connectionService.sendConnectionRequest(senderId, receiverId);
      const connectionStatus = 'Accept'
      const final = { result, connectionStatus }
      if (result) {
        res.status(200).json({ message: 'Connection request sent', final });
      } else {
        res.status(404).json({ message: 'Sender or receiver not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }


  async cancelConnectionRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const email = req.user
      const user = await this.userService.findByEmail(email as string)
      const senderId = user?._id as string
      const { cancelId } = req.body;

      if (!senderId || !cancelId) {
        res.status(400).json({ message: 'Missing sender or receiver ID' });
        return;
      }

      const result = await this.connectionService.cancelConnectionRequest(senderId, cancelId);
      const connectionStatus = 'Requested'
      const final = { result, connectionStatus }
      if (result) {
        res.status(200).json({ message: 'Connection request sent', final });
      } else {
        res.status(404).json({ message: 'Sender or receiver not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }


  async rejectConnectionRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const email = req.user
      const user = await this.userService.findByEmail(email as string)
      const senderId = user?._id as string
      const { rejectId } = req.body;
      if (!senderId || !rejectId) {
        res.status(400).json({ message: 'Missing sender or receiver ID' });
        return;
      }

      const result = await this.connectionService.rejectConnectionRequest(senderId, rejectId);
      const connectionStatus = 'Requested'
      const final = { result, connectionStatus }
      if (result) {
        res.status(200).json({ message: 'Connection request sent', final });
      } else {
        res.status(404).json({ message: 'Sender or receiver not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }

  async acceptConnectionRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const email = req.user
      const user = await this.userService.findByEmail(email as string)
      const senderId = user?._id as string
      const { acceptId } = req.body;
      if (!senderId || !acceptId) {
        res.status(400).json({ message: 'Missing sender or receiver ID' });
        return;
      }
      const result = await this.connectionService.acceptConnectionRequest(senderId, acceptId);
      const connectionStatus = 'Requested'
      const final = { result, connectionStatus }
      if (result) {
        res.status(200).json({ message: 'Connection request sent', final });
      } else {
        res.status(404).json({ message: 'Sender or receiver not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }

   async getNativeSpeakers(req: CustomRequest, res: Response): Promise<void> {
      try {
        const { search = '', page = 1, limit = 10, filterCountry, filterLanguage } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
  
        if (req.user) {
          const email = req.user;
          const user = await this.userService.findByEmail(email);
          const userId = user?._id as string;
  
          const result = await this.connectionService.findNativeSpeakers(
            userId,
            pageNum,
            limitNum,
            search as string,
            filterLanguage as string,
            filterCountry as string
          );
          res.status(200).json(result);
        } else {
          res.status(401).json({ message: 'Unauthorized' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected server error' });
      }
    }



}

export default ConnectionController