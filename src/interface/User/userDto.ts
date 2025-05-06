export interface SignupDTO {
  email: string;
  username: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  username?: string;
  knownLanguages?: string[];
  learningLanguages?: string[];
  country?: string;
  nativeLanguage?: string;
  profilePhoto?: string;
  bio?:string
}

export interface UpdateSubscriptionDTO {
  email: string;
  orderId: string;
}

