import SubscriptionService from "../../services/Admin/subscriptonService";
import { Request, Response } from "express";

class SubscriptionController {

  private subscriptionService: SubscriptionService

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService
  }

  async getSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const { search = '', page = 1, limit = 10 } = req.query
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this.subscriptionService.findAll(pageNum, limitNum, search as string);
      res.status(200).json(result);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

}

export default SubscriptionController