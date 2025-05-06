
import { Types } from "mongoose";
import { IQuiz } from "../../models/Admin/quizModel";
import QuizRepository from "../../repositories/Admin/quizRepository";

class QuizService{
  private quizRespository : QuizRepository

  constructor(quizRespository : QuizRepository){
    this.quizRespository = quizRespository
  }

  async createQuiz(quiz:IQuiz):Promise<IQuiz>{
    const newQuiz = await this.quizRespository.createQuiz(quiz)
    return newQuiz
  }

  async findByName(name : string) : Promise<IQuiz | null>{
    const quiz = await this.quizRespository.findByName(name)
    return quiz
  }

  async findAll(page:number, limit:number, search:string) : Promise<{quizzes:IQuiz[], total:number}>{
    const result = await this.quizRespository.findAll(page, limit, search)
    return result
  }

  async findByLanguageAndCategory(languageName : Types.ObjectId, categoryName: Types.ObjectId) : Promise<IQuiz | null>{
    const quiz = await this.quizRespository.findByLanguageAndCategory(languageName, categoryName)
    return quiz
  }

  async findById(id : string) : Promise<IQuiz | null>{
    const quiz = await this.quizRespository.findById(id)
    return quiz
  }

  // async getLessonsByLanguageId(languageId: string): Promise<any[]> {
  //   try {
  //     return await this.lessonRespository.findLessonsByLanguageId(languageId);
  //   } catch (error) {
  //     throw new Error('Error fetching lessons');
  //   }
  // }

  async updateQuiz(id : string, language : Partial<IQuiz>) : Promise<IQuiz | null>{
    const updatedQuiz = await this.quizRespository.update(id, language)
    return updatedQuiz
  }

}

export default QuizService