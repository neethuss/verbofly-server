import QuizService from "../../services/Admin/quizService";
import { Response, Request } from "express";
import { Types } from "mongoose";

class QuizController{

  private quizService : QuizService

  constructor(quizService : QuizService){
    this.quizService = quizService
  }

  async postCreateQuiz(req:Request , res:Response): Promise<void>{
    console.log('postCreateQuiz')
    try {
      
      const quiz = req.body
      console.log(quiz,'postCreateQuiz body')
   
      const existingQuiz = await this.quizService.findByLanguageAndCategory(quiz.languageName, quiz.categoryName)
      console.log(existingQuiz,'existing quiz')
      if(existingQuiz){
        res.status(200).send({message : " Quiz already exists"})
        return
      }
      const newQuiz = await this.quizService.createQuiz(quiz)
      console.log(newQuiz,'new quiz postCreateQuiz')
      res.status(201).json(newQuiz)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getQuizzes(req:Request, res:Response) : Promise<void>{
    try {
      const {search='', page=1, limit=10} = req.query
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this.quizService.findAll(pageNum, limitNum, search as string);
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

  // async getLessonById(req:Request, res:Response) : Promise<void>{
  //   console.log('bsk')
  //   try {
  //     console.log('lesson backend')
  //     const {lessonId} = req.params
  //     console.log(lessonId,'ji')
  //     const lesson = await this.lessonService.findById(lessonId)
  //     console.log(lesson,'les')
  //     res.status(200).json(lesson)
  //   } catch (error) {
  //     let errorMessage = 'An unexpected error occurred';
  //     if (error instanceof Error) {
  //       errorMessage = error.message;
  //     }
  //     res.status(500).json({ message: errorMessage });
  //   }
  // }

  
  // async unblockLesson(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.params
  //     console.log('unblocking')
  //     const updatedLesson = await this.lessonService.updateLesson(id, { isBlocked: false })
  //     if (updatedLesson) {
  //       console.log(updatedLesson, 'update aayi')
  //       res.status(200).json(updatedLesson)
  //     } else {
  //       console.log('Lesson kaanan illa')
  //       res.status(404).json({ message: 'Lesson not found' })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ message: "Unexpected server error" })
  //   }
  // }


  // async blockLesson(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.params
  //     console.log('blocking')
  //     const updatedLesson = await this.lessonService.updateLesson(id, { isBlocked: true })
  //     if (updatedLesson) {
  //       console.log(updatedLesson, 'update aayi')
  //       res.status(200).json(updatedLesson)
  //     } else {
  //       console.log('Lesson kaanan illa')
  //       res.status(404).json({ message: 'Lesson not found' })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ message: "Unexpected server error" })
  //   }
  // }


  async getByLangugeAndCategory(req:Request, res: Response) : Promise<void>{
    try {
      const {languageId, categoryId} = req.params
      const languageObjectId = new Types.ObjectId(languageId);
      const categoryObjectId = new Types.ObjectId(categoryId);
      const quiz = await this.quizService.findByLanguageAndCategory(languageObjectId, categoryObjectId)
      console.log(quiz,'particular quiz')
      res.status(200).json(quiz)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }


  // async getLessonByLanguageId(req:Request, res:Response) : Promise<void>{
  //   try {
  //     const { languageId } = req.params;
  //     console.log(languageId, 'backed')
  //     console.log('aaaaaaaaaaaaaaaaaaa')
      
  //     if (!languageId) {
  //       res.status(400).json({ message: 'Language ID is required' });
  //       return;
  //     }

  //     const lessons = await this.lessonService.getLessonsByLanguageId(languageId);

  //     if (!lessons.length) {
  //       res.status(404).json({ message: 'No lessons found for the provided language ID' });
  //       return;
  //     }

  //     res.status(200).json(lessons);
  //   } catch (error) {
  //     let errorMessage = 'An unexpected error occurred';
  //     if (error instanceof Error) {
  //       errorMessage = error.message;
  //     }
  //     res.status(500).json({ message: errorMessage });
  //   }
  // }

  

}

export default QuizController