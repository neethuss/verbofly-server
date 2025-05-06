import { Types } from "mongoose";
import { IProgress, Progress } from "../../../models/User/userProgress";
import ProgressRepository from "../../User/progressRepository";
import { BaseRepositoryImplentation } from "../Base/baseRepositoryImplementation";
class ProgressRepositoryImplementation
  extends BaseRepositoryImplentation<IProgress>
  implements ProgressRepository
{
  constructor() {
    super(Progress);
  }

  async findByUserId(userId: Types.ObjectId): Promise<IProgress | null> {
    return this.model
      .findOne({ userId })
      .populate('languages.language')
      .populate('languages.lessons')
      .populate('languages.lessons.lesson')
      .exec();
  }

  async updateLessonProgress(
    userId: Types.ObjectId,
    language: Types.ObjectId,
    lessonId: Types.ObjectId,
    isCompleted: boolean,
    quizUpdates?: { quizAttempted?: number; quizFailed?: number; quizWin?: number }
  ): Promise<IProgress | null> {
    const progress = await this.model.findOne({ userId }).exec();
    if (!progress) return null;

    const languageProgress = progress.languages.find((lang) => lang.language.equals(language));

    if (!languageProgress) {
      return this.model.findOneAndUpdate(
        { userId },
        {
          $push: {
            languages: {
              language,
              lessons: [{ lesson: lessonId, isCompleted, progress: isCompleted ? 100 : 0 }],
              quizAttempted: quizUpdates?.quizAttempted || 0,
              quizFailed: quizUpdates?.quizFailed || 0,
              quizWin: quizUpdates?.quizWin || 0,
            },
          },
        },
        { new: true }
      ).exec();
    }

    // Update quiz stats if available
    if (quizUpdates) {
      languageProgress.quizAttempted = (languageProgress.quizAttempted || 0) + (quizUpdates.quizAttempted || 0);
      languageProgress.quizFailed = (languageProgress.quizFailed || 0) + (quizUpdates.quizFailed || 0);
      languageProgress.quizWin = (languageProgress.quizWin || 0) + (quizUpdates.quizWin || 0);
    }

    // Add new lesson if not already present
    const lessonExists = languageProgress.lessons.find((less) => less.lesson.equals(lessonId));
    if (!lessonExists) {
      languageProgress.lessons.push({
        lesson: lessonId,
        isCompleted,
        progress: isCompleted ? 100 : 0,
      });
    }

    return progress.save();
  }

  async updateQuizProgress(
    userId: Types.ObjectId,
    language: Types.ObjectId,
    quizUpdates: { quizAttempted: number; quizFailed: number; quizWin: number }
  ): Promise<IProgress | null> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(language)) {
      return null;
    }

    const progress = await this.model.findOne({ userId }).exec();
    if (!progress) return null;

    const languageProgress = progress.languages.find((lang) => lang.language.equals(language));

    if (!languageProgress) {
      return this.model.findOneAndUpdate(
        { userId },
        {
          $push: {
            languages: {
              language,
              quizAttempted: quizUpdates.quizAttempted,
              quizFailed: quizUpdates.quizFailed,
              quizWin: quizUpdates.quizWin,
              lessons: [],
            },
          },
        },
        { new: true }
      ).exec();
    }

    languageProgress.quizAttempted += quizUpdates.quizAttempted;
    languageProgress.quizFailed += quizUpdates.quizFailed;
    languageProgress.quizWin += quizUpdates.quizWin;

    return progress.save();
  }

  async create(progress: IProgress): Promise<IProgress> {
    progress.languages.forEach(lang => {
      lang.streak = 1;
      lang.lastActiveDate = new Date();
    });
    return new this.model(progress).save();
  }
}

export default ProgressRepositoryImplementation;
