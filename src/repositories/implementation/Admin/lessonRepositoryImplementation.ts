import { Types } from "mongoose";
import { ILesson, Lesson } from "../../../models/Admin/lessonModel";
import LessonRepository from "../../Admin/lessonRespository";

class LessonRepositoryImplementation implements LessonRepository{
  
  async createLesson(lesson: ILesson): Promise<ILesson> {
    console.log('le repo imp')
    const newLesson = await Lesson.create(lesson)
    return newLesson
  }

  async findByTitle(title: string): Promise<ILesson | null> {
    console.log('tile imple')
    const lesson = await Lesson.findOne({title})
    return lesson
  }

  async findAll(page: number, limit: number, search: string): Promise<{ lessons: ILesson[]; total: number; }> {
    const offset = (page-1) * limit
    const query = search ? {
      $or : [
        {
          title : {$regex:search, $options:'i'}
        }
      ]
    } : {}
    const lessons = await Lesson.find(query).skip(offset).limit(limit).populate('languageName').populate('categoryName').exec()
    const total = await Lesson.countDocuments(query)
    return {lessons, total}
  }

  async findByLanguageAndCategory(languageName: Types.ObjectId, categoryName: Types.ObjectId): Promise<ILesson[]> {
     const lessons = await Lesson.find({languageName, categoryName})
     return lessons
  }

  async findById(id: string): Promise<ILesson | null> {
    console.log('d')
    const lesson = await Lesson.findById(id).populate('languageName').populate('categoryName').exec()
    console.log(lesson,'les impl')
    return lesson
  }

  async findLessonsByLanguageId(languageId: string): Promise<any[]> {
    try {
      return await Lesson.find({languageName: languageId }).exec();
    } catch (error) {
      throw new Error('Error fetching lessons from the database');
    }
  }

  async update(id: string, lesson: Partial<ILesson>): Promise<ILesson | null> {
    const updatedLesson = await Lesson.findByIdAndUpdate(id, lesson,{new : true}).exec()
    return updatedLesson
  }

}

export default LessonRepositoryImplementation