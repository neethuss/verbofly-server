import { Schema, model, Document, Types } from "mongoose";
import { ICategory } from "./categoryModel";
import { ILanguage } from "./languageModel";

interface ILesson extends Document {
  title: string;
  description: string;
  content: string;
  languageName: Types.ObjectId | ILanguage | null;
  categoryName: Types.ObjectId | ICategory | null;
  isBlocked: boolean;
  createdAt:Date
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: {type : String, required : true},
  languageName: { type: Schema.Types.ObjectId, ref: "Language", required: true },
  categoryName: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  isBlocked: { type: Boolean, default: false },
  createdAt:{type:Date, default:Date.now}
});

const Lesson = model<ILesson>("Lesson", LessonSchema);

export { ILesson, Lesson };
