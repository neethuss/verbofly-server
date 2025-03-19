import { Schema, model, Document, Types } from "mongoose";
import { ICountry } from "./countryModel";

interface ILanguage extends Document{
  languageName : string;
  countries : (Types.ObjectId | ICountry)[];
  isBlocked : boolean
} 

const LanguageSchma = new Schema<ILanguage>({
  languageName : {type : String, required: true},
  countries : [{type: Schema.Types.ObjectId, ref:'Country', required: true}],
  isBlocked : {type : Boolean, default : false}
})

const Language = model<ILanguage>('Language',LanguageSchma)

export {ILanguage, Language}