import {Schema, model, Document, Types} from 'mongoose'
import { ICountry } from '../Admin/countryModel';
import { ILanguage } from '../Admin/languageModel';

interface IUser extends Document{
  username : string;
  email : string;
  provider?: string;

  password? : string;
  isBlocked : boolean;
  country : Types.ObjectId | ICountry | null
  nativeLanguage : Types.ObjectId | ILanguage | null
  knownLanguages : (Types.ObjectId | ILanguage)[]
  languagesToLearn : (Types.ObjectId | ILanguage)[]
  profilePhoto : string,
  bio : string
  sentRequests: Types.ObjectId[]; 
  receivedRequests: Types.ObjectId[]; 
  connections: Types.ObjectId[]; 
  isSubscribed :boolean;
  expirationDate : Date | null
}

const UserSchema = new Schema<IUser>({
  username : {type : String, required : true},
  email : {type : String, required : true},
  provider:{type:String},
  password : {type : String, required : true},
  isBlocked : {type : Boolean, default : false},
  country : {type : Schema.Types.ObjectId, ref : 'Country', default : null},
  nativeLanguage : {type : Schema.Types.ObjectId, ref : 'Language', default : null},
  knownLanguages : [{type : Schema.Types.ObjectId, ref : 'Language', default : null}],
  languagesToLearn : [{type : Schema.Types.ObjectId, ref : 'Language', default : null}],
  profilePhoto : {type : String, default : null},
  bio : {type : String, default : null},
  sentRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  receivedRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  connections: [{ type: Schema.Types.ObjectId, ref: 'User' }] ,
  isSubscribed: {type:Boolean, default:false},
  expirationDate:{type:Date, default:null},
})

const User = model<IUser>('User',UserSchema)

export {User, IUser}