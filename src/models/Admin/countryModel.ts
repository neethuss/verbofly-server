
import { Schema, model, Document } from "mongoose";

interface ICountry extends Document{
  countryName : string,
  isBlocked : boolean
}

const CountrySchema = new Schema<ICountry>({
  countryName : {type: String, required : true},
  isBlocked : {type : Boolean, default : false}
})

const Country = model<ICountry>('Country', CountrySchema)

export {ICountry, Country}