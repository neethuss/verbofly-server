import QuizService from "../../services/Admin/quizService";
import { Response, Request } from "express";
import { Types } from "mongoose";

class QuizController {

  private quizService: QuizService

  constructor(quizService: QuizService) {
    this.quizService = quizService
  }

  async postCreateQuiz(req: Request, res: Response): Promise<void> {
    try {

      const quiz = req.body

      const existingQuiz = await this.quizService.findByLanguageAndCategory(quiz.languageName, quiz.categoryName)
      if (existingQuiz) {
        res.status(200).send({ message: " Quiz already exists" })
        return
      }
      const newQuiz = await this.quizService.createQuiz(quiz)
      res.status(201).json(newQuiz)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getQuizzes(req: Request, res: Response): Promise<void> {
    try {
      const { search = '', page = 1, limit = 10 } = req.query
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this.quizService.findAll(pageNum, limitNum, search as string);
      res.status(200).json(result);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getByLangugeAndCategory(req: Request, res: Response): Promise<void> {
    try {
      const { languageId, categoryId } = req.params
      const languageObjectId = new Types.ObjectId(languageId);
      const categoryObjectId = new Types.ObjectId(categoryId);
      const quiz = await this.quizService.findByLanguageAndCategory(languageObjectId, categoryObjectId)
      if (quiz && quiz.questions && Array.isArray(quiz.questions)) {
        for (let i = quiz.questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [quiz.questions[i], quiz.questions[j]] = [quiz.questions[j], quiz.questions[i]];
        }
      }
      res.status(200).json(quiz)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }


  async getQuizById(req: Request, res: Response): Promise<void> {
    try {
      const { quizId } = req.params
      const quiz = await this.quizService.findById(quizId)
      res.status(200).json(quiz)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }


  async editQuiz(req: Request, res: Response): Promise<void> {
    try {
      const quiz = req.body
      const { quizId } = req.params

      const existingQuiz = await this.quizService.findByLanguageAndCategory(quiz.languageName, quiz.categoryName)
      if (existingQuiz && existingQuiz._id != quizId) {
        console.log(existingQuiz,'a')
        res.status(409).send({ message: " Quiz already exists" })
        return
      }
      const updatedQuiz = await this.quizService.updateQuiz(quizId, quiz)
      res.status(200).json(updatedQuiz)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }



}

export default QuizController