import { Types } from "mongoose";
import { ILesson } from "../../models/Admin/lessonModel";
import LessonRepository from "../../repositories/Admin/lessonRespository";

class LessonService{
  private lessonRespository : LessonRepository

  constructor(lessonRepository : LessonRepository){
    this.lessonRespository = lessonRepository
  }

  async createLesson(lesson:ILesson):Promise<ILesson>{
    console.log('le ser')
    const newLesson = await this.lessonRespository.createLesson(lesson)
    return newLesson
  }

  async findByTitle(title : string) : Promise<ILesson | null>{
    const lesson = await this.lessonRespository.findByTitle(title)
    return lesson
  }

  async findAll(page:number, limit:number, search:string) : Promise<{lessons:ILesson[], total:number}>{
    const result = await this.lessonRespository.findAll(page, limit, search)
    return result
  }

  async findByLanguageAndCategory(languageName : Types.ObjectId, categoryName: Types.ObjectId) : Promise<ILesson[]>{
    const lessons = await this.lessonRespository.findByLanguageAndCategory(languageName, categoryName)
    return lessons
  }

  async findById(id : string) : Promise<ILesson | null>{
    console.log('le ser')
    const lesson = await this.lessonRespository.findById(id)
    return lesson
  }

  async getLessonsByLanguageId(languageId: string): Promise<any[]> {
    try {
      return await this.lessonRespository.findLessonsByLanguageId(languageId);
    } catch (error) {
      throw new Error('Error fetching lessons');
    }
  }

  async updateLesson(id : string, language : Partial<ILesson>) : Promise<ILesson | null>{
    const updatedLesson = await this.lessonRespository.update(id, language)
    return updatedLesson
  }

}

export default LessonService