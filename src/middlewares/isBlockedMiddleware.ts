import { CustomRequest } from "./authenticationMiddleware";
import { Request, Response, NextFunction } from 'express';
import UserService from "../services/User/userService";
import UserRepositoryImplementation from "../repositories/implementation/User/userRepositoryImplementation";

const userRepositoryImplementation = new UserRepositoryImplementation()

const userService = new UserService(userRepositoryImplementation)


const isBlockedMiddleware = async(req:CustomRequest, res:Response, next:NextFunction)=>{
  try {
    const email = req.user
    const user = await userService.findByEmail(email as string)
    if(user?.isBlocked){
      res.status(403).json({ message:"Your account is blocked" })
      return
    }else{
      next()
    }
  } catch (error) {
    res.status(500).json({message:'Error while checking user is blocked or not'})
  }
}

export default isBlockedMiddleware