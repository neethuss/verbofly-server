import { Types } from "mongoose";
import { ILesson } from "../../models/Admin/lessonModel";

interface LessonRepository{
  createLesson(lesson : ILesson) : Promise<ILesson>
  findByTitle(title:string) : Promise<ILesson | null>
  findAll(page:number, limit:number, search:string) : Promise<{lessons : ILesson[], total:number}>
  findByLanguageAndCategory(languageName : Types.ObjectId, categoryName : Types.ObjectId) : Promise<ILesson[]>
  findById(id : string) : Promise<ILesson | null>
  findLessonsByLanguageId(languageId: string): Promise<any[]>;
  update(id:string, lesson:Partial<ILesson>) : Promise<ILesson | null>
}

export default LessonRepository