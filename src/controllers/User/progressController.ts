import ProgressService from "../../services/User/progressService";
import UserService from "../../services/User/userService";
import LessonService from "../../services/Admin/lessonService";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authenticationMiddleware";
import { Types } from "mongoose";


class ProgressController {
  private progressService: ProgressService;
  private userService: UserService;
  private lessonService: LessonService;

  constructor(progressService: ProgressService, userService: UserService, lessonService: LessonService) {
    this.progressService = progressService;
    this.userService = userService;
    this.lessonService = lessonService;
  }

  async findProgressByUserId(req: CustomRequest, res: Response): Promise<void> {
    const email = req.user
    const user = await this.userService.findByEmail(email as string)
    const userId = user?._id as string

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).send({ error: 'Invalid user ID' });
      return;
    }

    try {
      const progress = await this.progressService.findByUserId(new Types.ObjectId(userId));
      if (!progress) {
        res.status(404).send({ message: 'Progress not found' });
        return;
      }
      res.status(200).send(progress)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async updateOrCreateProgress(req: Request, res: Response): Promise<void> {
    const { userId, languageId, isCompleted, lessonId,result } = req.body;
    try {
      const progress = await this.progressService.updateOrCreateProgress(
        new Types.ObjectId(userId),
        new Types.ObjectId(languageId),
        lessonId ? new Types.ObjectId(lessonId) : null,
        isCompleted ?? false,
        result
    );

    if (progress) {
        res.status(200).json({ message: 'Progress updated successfully', progress });
    } else {
        res.status(500).json({ message: 'Failed to update progress' });
    }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async findLessonsWithProgress(req: CustomRequest, res: Response): Promise<void> {
    const { languageId, categoryId } = req.params;
    const email = req.user;
    const user = await this.userService.findByEmail(email as string);
    const userId = user?._id as string;

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).send({ error: 'Invalid user ID' });
      return;
    }

    try {
      const progress = await this.progressService.findByUserId(new Types.ObjectId(userId));
      if(!progress){
        res.status(404).json({message :"Progress yet not started"})
        return 
      }

      const lessons = await this.lessonService.findByLanguageAndCategory(new Types.ObjectId(languageId), new Types.ObjectId(categoryId));

      const lessonCompletionStatus = new Map<string, boolean>();
      if (progress && progress.languages) {
        for (const language of progress.languages) {
          for (const lesson of language.lessons) {
            lessonCompletionStatus.set(lesson.lesson.toString(), lesson.isCompleted);
          }
        }
      }

      const lessonsWithStatus = lessons.map((lesson: any) => ({
        ...lesson.toObject(),
        isCompleted: lessonCompletionStatus.get(lesson._id.toString()) || false
      }));

      res.status(200).send(lessonsWithStatus);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }



}
export default ProgressController;
