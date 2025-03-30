import express from 'express';
import passport from 'passport';
import GoogleAuthRepositoryImplementation from '../../repositories/implementation/User/googleAuthRepositoryImplementation';
import AuthController from '../../controllers/User/googleAuthController';
import GoogleAuthService from '../../services/User/googleAuthService';

const router = express.Router();
const googleAuthRepositoryImplementation = new GoogleAuthRepositoryImplementation()
const googleAuthService = new GoogleAuthService(googleAuthRepositoryImplementation);
const authController = new AuthController(googleAuthService);

// Route to initiate Google OAuth
router.get('/auth/google', authController.googleAuth);

// Google OAuth callback route - THIS IS THE IMPORTANT PART
router.get(
  '/auth/callback/google',
  passport.authenticate('google', { 
    failureRedirect: 'https://verbofly.life/login?error=Authentication failed',
    session: false  // Important: don't rely on session if using tokens
  }),
  authController.googleAuthCallback
);

export default router;