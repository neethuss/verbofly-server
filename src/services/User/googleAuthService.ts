import jwt from "jsonwebtoken";
import GoogleAuthRepository from "../../repositories/User/googleAuthRepository";
import {User, IUser } from "../../models/User/userModel";

class GoogleAuthService {

  private googleAuthRepository : GoogleAuthRepository
  
    constructor(googleAuthRepository : GoogleAuthRepository){
      this.googleAuthRepository = googleAuthRepository
    }
  
    async authenticateGoogleUser(profile: any): Promise<{ user: IUser; token: string }> {
      // Extract email from profile.emails array
      const email = profile.emails && profile.emails.length > 0 
        ? profile.emails[0].value 
        : null;
        
      if (!email) {
        throw new Error("No email found in Google profile");
      }
      
      let user = await this.googleAuthRepository.findByEmail(email);
    
      if (!user) {
        // Create new user
        const newUser = new User({
          email: email,
          username: profile.displayName || `user_${profile.id}`,
          provider: "google",
          // For Google auth users, either set a random password or modify your schema
          // to make password optional when provider is "google"
          password: Math.random().toString(36).slice(-10), // Random password
          isBlocked: false,
          country: null,
          nativeLanguage: null,
          knownLanguages: [],
          languagesToLearn: [],
          profilePhoto: profile.photos?.[0]?.value || "",
          bio: "",
          sentRequests: [],
          receivedRequests: [],
          connections: [],
          isSubscribed: false,
          expirationDate: null
        });
    
        user = await this.googleAuthRepository.createUser(newUser);
      }
    
      // Generate JWT Token
      const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string, { expiresIn: "1h" });
    
      return { user, token };
    }
    
    
}

export default GoogleAuthService