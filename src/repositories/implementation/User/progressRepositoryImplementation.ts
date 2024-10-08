import { Types } from "mongoose";
import { IProgress, Progress } from "../../../models/User/userProgress";
import ProgressRepository from "../../User/progressRepository";

class ProgressRepositoryImplementation implements ProgressRepository {


  async findByUserId(userId: Types.ObjectId): Promise<IProgress | null> {
    console.log('find progr')
    const user = await Progress.findOne({ userId }).populate('languages.language').populate('languages.lessons').populate('languages.lessons.lesson').exec();
    console.log(user, 'user in imp forf prot')
    return user
  }


  async updateLessonProgress(
    userId: Types.ObjectId,
    language: Types.ObjectId,
    lessonId: Types.ObjectId,
    isCompleted: boolean,
    quizUpdates?: { quizAttempted?: number; quizFailed?: number; quizWin?: number }
  ): Promise<IProgress | null> {
    const progress = await Progress.findOne({ userId }).exec();
    console.log('priii', progress, language);

    // If no progress exists, return null
    if (!progress) return null;

    // Find language progress in the user's progress data
    const languageProgress = progress.languages.find((lang) => lang.language.equals(language));

    const updateFields: any = {};

    // Quiz updates
    if (quizUpdates) {
      if (quizUpdates.quizAttempted !== undefined) {
        updateFields['languages.$.quizAttempted'] = (languageProgress?.quizAttempted || 0) + quizUpdates.quizAttempted;
      }
      if (quizUpdates.quizFailed !== undefined) {
        updateFields['languages.$.quizFailed'] = (languageProgress?.quizFailed || 0) + quizUpdates.quizFailed;
      }
      if (quizUpdates.quizWin !== undefined) {
        updateFields['languages.$.quizWin'] = (languageProgress?.quizWin || 0) + quizUpdates.quizWin;
      }
    }

    // If the language doesn't exist in the progress, push the new language with its lesson
    if (!languageProgress) {
      return Progress.findOneAndUpdate(
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

    const lessonExists = languageProgress.lessons.find((less) => less.lesson.equals(lessonId));

    if (!lessonExists) {
      console.log('this lesson id is not found in this particular lesssons')
      const newLesson = {
        lesson:lessonId,
        isCompleted:true,
        progress:isCompleted?100:0
      }
      const updatedProgress = await languageProgress.lessons.push(newLesson)
      return progress.save()
    } else {
      console.log(progress,'in else')
      return progress.save()
    }
    // console.log(updateFields, 'updatedFields')
    // const updatedProgress = await Progress.findOneAndUpdate(
    //   { userId, 'languages.language': language },
    //   { $set: updateFields },
    //   {
    //     arrayFilters: [
    //       { 'languageElem.language': language },
    //       { 'lessonElem.lesson': lessonId },
    //     ],
    //     new: true,
    //   }
    // ).exec();
    // console.log(updatedProgress, 'updatedProgress')
    // return updatedProgress
  }


 

  async create(progress: IProgress): Promise<IProgress> {
    console.log('Creating new progress');

    progress.languages.forEach(lang => {
      lang.streak = 1;
      lang.lastActiveDate = new Date();
    });

    return new Progress(progress).save();
  }

  async updateQuizProgress(
    userId: Types.ObjectId,
    language: Types.ObjectId,
    quizUpdates: { quizAttempted: number; quizFailed: number; quizWin: number }
  ): Promise<IProgress | null> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(language)) {
      console.error('Invalid ObjectId provided');
      return null;
    } else {
      console.log('Valid ObjectIds');
    }


    const progress = await Progress.findOne({ userId }).exec();
    console.log(progress, 'progress for user:', language, userId);

    if (!progress) return null;


    const languageProgress = progress.languages.find((lang) => lang.language.equals(language));

    const updateFields: any = {};

    if (!languageProgress) {
      return Progress.findOneAndUpdate(
        { userId },
        {
          $push: {
            languages: {
              language,
              quizAttempted: quizUpdates.quizAttempted,
              quizFailed: quizUpdates.quizFailed,
              quizWin: quizUpdates.quizWin,
              lessons: []
            },
          },
        },
        { new: true }
      ).exec();
    }

    updateFields['languages.$.quizAttempted'] = languageProgress.quizAttempted + quizUpdates.quizAttempted;
    updateFields['languages.$.quizFailed'] = languageProgress.quizFailed + quizUpdates.quizFailed;
    updateFields['languages.$.quizWin'] = languageProgress.quizWin + quizUpdates.quizWin;

    const updatedProgress = Progress.findOneAndUpdate(
      { userId, 'languages.language': language },
      { $set: updateFields },
      { new: true }
    ).exec();

    console.log(updatedProgress, 'Updated Progress');
    return updatedProgress;
  }



}

export default ProgressRepositoryImplementation