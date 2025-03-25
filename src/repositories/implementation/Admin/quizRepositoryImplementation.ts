import { Types } from "mongoose";
import { IQuiz, Quiz } from "../../../models/Admin/quizModel";
import LessonRepository from "../../Admin/lessonRespository";
import QuizRepository from "../../Admin/quizRepository";

class QuizRepositoryImplementation implements QuizRepository{
  
  async createQuiz(quiz: IQuiz): Promise<IQuiz> {
    console.log('createQuiz QuizRepositoryImplementation')
    console.log(quiz,'quiz QuizRepositoryImplementation')
    const newQuiz = await Quiz.create(quiz)
    console.log(newQuiz,'newQuiz QuizRepositoryImplementation')
    return newQuiz
  }

  async findByName(name: string): Promise<IQuiz | null> {
    console.log('findByName QuizRepositoryImplementation')
    const lesson = await Quiz.findOne({name})
    return lesson
  }

  async findAll(page: number, limit: number, search: string): Promise<{ quizzes: IQuiz[]; total: number; }> {
    const offset = (page-1) * limit
    const query = search ? {
      $or : [
        {
          title : {$regex:search, $options:'i'}
        }
      ]
    } : {}
    const quizzes = await Quiz.find(query).skip(offset).limit(limit).populate('languageName').populate('categoryName').exec()
    const total = await Quiz.countDocuments(query)
    return {quizzes, total}
  }

  async findByLanguageAndCategory(languageName: Types.ObjectId, categoryName: Types.ObjectId): Promise<IQuiz | null> {
     const quiz = await Quiz.findOne({languageName, categoryName},{ $sample: { size: 10 } })
     return quiz
  }

  // async findById(id: string): Promise<ILesson | null> {
  //   console.log('d')
  //   const lesson = await Lesson.findById(id).populate('languageName').populate('categoryName').exec()
  //   console.log(lesson,'les impl')
  //   return lesson
  // }

  // async findLessonsByLanguageId(languageId: string): Promise<any[]> {
  //   try {
  //     return await Lesson.find({languageName: languageId }).exec();
  //   } catch (error) {
  //     throw new Error('Error fetching lessons from the database');
  //   }
  // }

  // async update(id: string, lesson: Partial<ILesson>): Promise<ILesson | null> {
  //   const updatedLesson = await Lesson.findByIdAndUpdate(id, lesson,{new : true}).exec()
  //   return updatedLesson
  // }

}

export default QuizRepositoryImplementation