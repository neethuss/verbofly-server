import LessonService from "../../services/Admin/lessonService";
import { Response, Request } from "express";
import { Types } from "mongoose";

class LessonController {

  private lessonService: LessonService

  constructor(lessonService: LessonService) {
    this.lessonService = lessonService
  }

  async postCreateLesson(req: Request, res: Response): Promise<void> {
    console.log('le backend')
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
      const lesson = req.body
      const title = lesson.title.toLowerCase().trim()
      console.log(lesson, 'less body')
      const existingLesson = await this.lessonService.findByTitle(title)
      console.log(existingLesson, 'existing lesson')
      if (existingLesson) {
        res.status(200).send({ message: " Lesson already exists" })
        return
      }
      console.log(req.file, 'file')
      const fileUrl = (req.file as any).location;
      lesson.content = fileUrl
      lesson.title = lesson.title.toLocaleLowerCase().trim()
      console.log(lesson.content, 'con')
      console.log(lesson, 'tot less')
      const newLesson = await this.lessonService.createLesson(lesson)
      console.log(newLesson, 'new L')
      res.status(201).json(newLesson)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getLessons(req: Request, res: Response): Promise<void> {
    try {
      console.log('less')
      const { search = '', page = 1, limit = 10 } = req.query
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this.lessonService.findAll(pageNum, limitNum, search as string);
      console.log(result)
      res.status(200).json(result);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getLessonById(req: Request, res: Response): Promise<void> {
    console.log('bsk')
    try {
      console.log('lesson backend')
      const { lessonId } = req.params
      console.log(lessonId, 'ji')
      const lesson = await this.lessonService.findById(lessonId)
      console.log(lesson, 'les')
      res.status(200).json(lesson)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async editLessonById(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params
      const lessonBody = req.body
      const lesson = await this.lessonService.findById(lessonId)
      if (!lesson) {
        res.status(404).send({ message: 'No lesson found with this id' })
        return
      }
      const existingLesson = await this.lessonService.findByTitle(lessonBody.title.toLowerCase().trim())
      if (existingLesson && existingLesson._id != lessonId) {
        res.status(409).json({ message: "Language already exists with this name" });
        return;
      }
      const updatedLessonData = {
        ...lessonBody,
        title: lessonBody.title.toLowerCase().trim()
      };
      const updatedLesson = await this.lessonService.updateLesson(lessonId, updatedLessonData)
      res.status(200).json(updatedLesson)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }


  async unblockLesson(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      console.log('unblocking')
      const updatedLesson = await this.lessonService.updateLesson(id, { isBlocked: false })
      if (updatedLesson) {
        console.log(updatedLesson, 'update aayi')
        res.status(200).json(updatedLesson)
      } else {
        console.log('Lesson kaanan illa')
        res.status(404).json({ message: 'Lesson not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }


  async blockLesson(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      console.log('blocking')
      const updatedLesson = await this.lessonService.updateLesson(id, { isBlocked: true })
      if (updatedLesson) {
        console.log(updatedLesson, 'update aayi')
        res.status(200).json(updatedLesson)
      } else {
        console.log('Lesson kaanan illa')
        res.status(404).json({ message: 'Lesson not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }


  async getCategoryLessons(req: Request, res: Response): Promise<void> {
    try {
      const { languageId, categoryId } = req.params
      const languageObjectId = new Types.ObjectId(languageId);
      const categoryObjectId = new Types.ObjectId(categoryId);
      const lessons = await this.lessonService.findByLanguageAndCategory(languageObjectId, categoryObjectId)
      console.log(lessons, 'particular lessons')
      res.status(200).json(lessons)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }


  async getLessonByLanguageId(req: Request, res: Response): Promise<void> {
    try {
      const { languageId } = req.params;
      console.log(languageId, 'backed')
      console.log('aaaaaaaaaaaaaaaaaaa')

      if (!languageId) {
        res.status(400).json({ message: 'Language ID is required' });
        return;
      }

      const lessons = await this.lessonService.getLessonsByLanguageId(languageId);

      if (!lessons.length) {
        res.status(404).json({ message: 'No lessons found for the provided language ID' });
        return;
      }

      res.status(200).json(lessons);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }



}

export default LessonController