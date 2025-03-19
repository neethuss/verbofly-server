import { Types } from "mongoose";
import { IQuiz } from "../../models/Admin/quizModel";
interface QuizRepository{
  createQuiz(quiz : IQuiz) : Promise<IQuiz>
  findByName(name:string) : Promise<IQuiz | null>
  findAll(page:number, limit:number, search:string) : Promise<{quizzes : IQuiz[], total:number}>
  findByLanguageAndCategory(languageName : Types.ObjectId, categoryName : Types.ObjectId) : Promise<IQuiz | null>
  // findById(id : string) : Promise<ILesson | null>
  // findLessonsByLanguageId(languageId: string): Promise<any[]>;
  // update(id:string, language:Partial<ILesson>) : Promise<ILesson | null>
}

export default QuizRepository