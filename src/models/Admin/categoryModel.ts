
import { Schema, model, Document } from "mongoose";

interface ICategory extends Document{
  categoryName : string,
  isBlocked : boolean
}

const CategorySchema = new Schema<ICategory>({
  categoryName : {type: String, required : true},
  isBlocked : {type : Boolean, default : false}
})

const Category = model<ICategory>('Category', CategorySchema)

export {ICategory, Category}