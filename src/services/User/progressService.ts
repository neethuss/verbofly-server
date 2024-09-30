import { IProgress } from "../../models/User/userProgress";
import ProgressRepository from "../../repositories/User/progressRepository";
import { Types } from "mongoose";

class ProgressService {

  private progressRepository: ProgressRepository

  constructor(progressRepository: ProgressRepository) {
    this.progressRepository = progressRepository
  }

  async findByUserId(userId: Types.ObjectId): Promise<IProgress | null> {
    console.log(userId, 'find user for progress')
    return this.progressRepository.findByUserId(userId);
  }

  //   async updateOrCreateProgress(userId: Types.ObjectId, language: Types.ObjectId, lessonId: Types.ObjectId, isCompleted: boolean): Promise<IProgress | null> {
  //     let progress = await this.progressRepository.findByUserId(userId);

  //     if (!progress) {
  //         return this.progressRepository.create({
  //             userId,
  //             languages: [
  //                 {
  //                     language,
  //                     lessons: [
  //                         {
  //                             lesson: lessonId,
  //                             isCompleted,
  //                             progress: isCompleted ? 100 : 0,
  //                         }
  //                     ]
  //                 }
  //             ]
  //         });
  //     } else {
  //         return this.progressRepository.updateLessonProgress(userId, language, lessonId, isCompleted);
  //     }
  // }


  async updateOrCreateProgress(
    userId: Types.ObjectId,
    language: Types.ObjectId,
    lessonId: Types.ObjectId | null,
    isCompleted: boolean,
    result?: 'passed' | 'failed'
  ): Promise<IProgress | null> {
    console.log('updating progrss')
    let progress = await this.progressRepository.findByUserId(userId);
console.log('pr',progress)
    const quizUpdates = {
      quizAttempted: result ? 1 : 0,
      quizFailed: result === 'failed' ? 1 : 0,
      quizWin: result === 'passed' ? 1 : 0
    };
    console.log(quizUpdates,'a')

    if (!progress) {
      return this.progressRepository.create({
        userId,
        languages: [
          {
            language,
            quizAttempted: quizUpdates.quizAttempted || 0,
            quizFailed: quizUpdates.quizFailed || 0,
            quizWin: quizUpdates.quizWin || 0,
            streak: 1,
            lastActiveDate: new Date(),
            lessons: lessonId
              ? [
                {
                  lesson: lessonId,
                  isCompleted,
                  progress: isCompleted ? 100 : 0,
                }
              ]
              : []
          }
        ]
      });
    } else {
      if (lessonId) {
        return this.progressRepository.updateLessonProgress(userId, language, lessonId, isCompleted, quizUpdates);
      } else if (result) {
        console.log('isdj')
        return this.progressRepository.updateQuizProgress(userId, language, quizUpdates);
      }
    }

    return null;
  }
}

export default ProgressService