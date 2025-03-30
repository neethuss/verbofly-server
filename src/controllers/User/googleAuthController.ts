import { Request, Response } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import GoogleAuthService from "../../services/User/googleAuthService";

dotenv.config();

class AuthController {
  private googleAuthService: GoogleAuthService;

  constructor(googleAuthService: GoogleAuthService) {
    this.googleAuthService = googleAuthService;

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          callbackURL: "https://api.verbofly.life/googleauth/auth/callback/google",
          passReqToCallback: true,
        },
        async (_req: any, accessToken: string, refreshToken: string, profile: Profile, done) => {
          try {
            console.log("Profile received from Google:", profile.id);
            console.log("Profile emails:", profile.emails);
            
            const { user, token } = await this.googleAuthService.authenticateGoogleUser(profile);
            return done(null, { user, token });
          } catch (error) {
            console.error("Error in Google strategy callback:", error);
            return done(error as Error, false);
          }
        }
      )
    );

    // These are needed if using sessions
    passport.serializeUser((data: any, done) => {
      console.log("Serializing user:", data?.user?.id || "unknown");
      done(null, data);
    });
    
    passport.deserializeUser((data: any, done) => {
      console.log("Deserializing user");
      done(null, data);
    });
  }

  // Method to initiate Google authentication
  googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

  // Callback method after Google authentication
  googleAuthCallback = (req: Request, res: Response) => {
    try {
      console.log("User received in callback:", req.user); // Debugging
      
      // At this point req.user should be defined because passport middleware ran first
      const userData = req.user as { user: any, token: string } | undefined;
      
      if (!userData || !userData.token) {
        console.log("Authentication failed: Invalid user data");
        return res.redirect("https://verbofly.life/login?error=Authentication failed");
      }
  
      // Set cookie and redirect to frontend with token
      res.cookie("token", userData.token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });


      
      return res.redirect(`https://verbofly.life/dashboard?token=${userData.token}`);
    } catch (error) {
      console.error("Error in googleAuthCallback:", error);
      return res.redirect("https://verbofly.life/login?error=Server error");
    }
  };
}

export default AuthController;