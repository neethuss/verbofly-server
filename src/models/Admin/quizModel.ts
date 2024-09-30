import { Schema, model, Document, Types } from "mongoose";
import { ICategory } from "./categoryModel";
import { ILanguage } from "./languageModel";

interface IQuizOtpion {
  option: string
}

interface IQuizQuestion {
  question: string
  options: IQuizOtpion[]
  correctAnswer: string
}

interface IQuiz extends Document {
  name: string;
  languageName: Types.ObjectId | ILanguage | null
  categoryName: Types.ObjectId | ICategory | null
  questions: IQuizQuestion[]
}

const QuizSchema = new Schema<IQuiz>({
  name: { type: String, required: true },
  languageName: { type: Schema.Types.ObjectId, ref: 'Language', required: true },
  categoryName: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  questions: [{ question: { type: String, required: true }, options: [{ option: { type: String, required: true }, }], correctAnswer:{type:String, required:true} }]
});

const Quiz = model<IQuiz>("Quiz", QuizSchema);

export { IQuiz, Quiz };
