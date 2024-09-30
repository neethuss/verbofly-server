
import { Types } from "mongoose";
import { IQuiz } from "../../models/Admin/quizModel";
import QuizRepository from "../../repositories/Admin/quizRepository";

class QuizService{
  private quizRespository : QuizRepository

  constructor(quizRespository : QuizRepository){
    this.quizRespository = quizRespository
  }

  async createQuiz(quiz:IQuiz):Promise<IQuiz>{
    console.log('createQuiz QuizService')
    const newQuiz = await this.quizRespository.createQuiz(quiz)
    return newQuiz
  }

  async findByName(name : string) : Promise<IQuiz | null>{
    console.log('findByName QuizService')
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

  // async findById(id : string) : Promise<ILesson | null>{
  //   console.log('le ser')
  //   const lesson = await this.lessonRespository.findById(id)
  //   return lesson
  // }

  // async getLessonsByLanguageId(languageId: string): Promise<any[]> {
  //   try {
  //     return await this.lessonRespository.findLessonsByLanguageId(languageId);
  //   } catch (error) {
  //     throw new Error('Error fetching lessons');
  //   }
  // }

  // async updateLesson(id : string, language : Partial<ILesson>) : Promise<ILesson | null>{
  //   const updatedLesson = await this.lessonRespository.update(id, language)
  //   return updatedLesson
  // }

}

export default QuizService