import { IProgress, Progress } from "../../models/User/userProgress";
import ProgressRepository from "../../repositories/User/progressRepository";
import { Types } from "mongoose";

class ProgressService {

  private progressRepository: ProgressRepository

  constructor(progressRepository: ProgressRepository) {
    this.progressRepository = progressRepository
  }

  async findByUserId(userId: Types.ObjectId): Promise<IProgress | null> {
    return this.progressRepository.findByUserId(userId);
  }



  async updateOrCreateProgress(
    userId: Types.ObjectId,
    language: Types.ObjectId,
    lessonId: Types.ObjectId | null,
    isCompleted: boolean,
    result?: 'passed' | 'failed'
  ): Promise<IProgress | null> {
    let progress = await this.progressRepository.findByUserId(userId);
    
    const quizUpdates = {
      quizAttempted: result ? 1 : 0,
      quizFailed: result === 'failed' ? 1 : 0,
      quizWin: result === 'passed' ? 1 : 0
    };
    
    if (!progress) {
      // Create a new Progress document instance using the model
      const newProgress = new Progress({
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
      
      // Save and return the new document
      return await newProgress.save();
    } else {
      if (lessonId) {
        return this.progressRepository.updateLessonProgress(userId, language, lessonId, isCompleted, quizUpdates);
      } else if (result) {
        return this.progressRepository.updateQuizProgress(userId, language, quizUpdates);
      }
    }
    return null;
  }
}

export default ProgressService