import { Router } from "express";
import UserService from "../../services/User/userService";


import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import ConnectionRepositoryImplementation from "../../repositories/implementation/User/connectionRepositoryImplementation";
import ConnectionService from "../../services/User/connectionService";
import ConnectionController from "../../controllers/User/connectionController";
import UserRepositoryImplementation from "../../repositories/implementation/User/userRepositoryImplementation";


const connectionRepositoryImplementation = new ConnectionRepositoryImplementation()
const userRepositoryImplementation = new UserRepositoryImplementation()
const connectionService = new ConnectionService(connectionRepositoryImplementation)
const userService = new UserService(userRepositoryImplementation)
const connectionController = new ConnectionController(connectionService, userService)




const router = Router()


router.patch('/sendConnection', authenticationMiddleware, (req, res) => connectionController.sendConnectionRequest(req, res))
router.patch('/cancelConnection', authenticationMiddleware, (req, res) => connectionController.cancelConnectionRequest(req, res))
router.patch('/rejectConnection', authenticationMiddleware, (req, res) => connectionController.rejectConnectionRequest(req, res))
router.patch('/acceptConnection', authenticationMiddleware, (req, res) => connectionController.acceptConnectionRequest(req, res))

router.get('/native/speakers', authenticationMiddleware, (req, res) => connectionController.getNativeSpeakers(req, res));


export default router