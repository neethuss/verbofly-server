import { Router } from "express";

const router = Router()

import SubscriptionController from "../../controllers/Admin/subscriptionController";
import SubscriptionService from "../../services/Admin/subscriptonService";
import SubscriptionRepositoryImplementation from "../../repositories/implementation/Admin/subscriptionRepositoryImplementation";


const subscriptionRepositoryImplementation = new SubscriptionRepositoryImplementation()
const subscriptionService = new SubscriptionService(subscriptionRepositoryImplementation)
const subscriptionController = new SubscriptionController(subscriptionService)

import authenticationMiddleware from "../../middlewares/authenticationMiddleware";


router.get('/subscriptions', authenticationMiddleware, (req, res) => subscriptionController.getSubscriptions(req,res))



export default router