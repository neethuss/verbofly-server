import { Types } from "mongoose";
import { IProgress } from "../../models/User/userProgress";
import { Type } from "@aws-sdk/client-s3";

interface ProgressRepository {
  findByUserId(userId: Types.ObjectId): Promise<IProgress | null>;
  
  updateLessonProgress(userId: Types.ObjectId,
    language: Types.ObjectId,
    lessonId: Types.ObjectId,
    isCompleted: boolean,
    quizUpdates?: { quizAttempted?: number; quizFailed?: number; quizWin?: number }): Promise<IProgress | null>;
  updateQuizProgress( userId: Types.ObjectId,
    language: Types.ObjectId,
    quizUpdates: { quizAttempted: number; quizFailed: number; quizWin: number }): Promise<IProgress | null>;
  create(progress: IProgress): Promise<IProgress>;
}

export default ProgressRepository