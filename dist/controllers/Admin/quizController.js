"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class QuizController {
    constructor(quizService) {
        this.quizService = quizService;
    }
    postCreateQuiz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('postCreateQuiz');
            try {
                const quiz = req.body;
                console.log(quiz, 'postCreateQuiz body');
                const existingQuiz = yield this.quizService.findByLanguageAndCategory(quiz.languageName, quiz.categoryName);
                console.log(existingQuiz, 'existing quiz');
                if (existingQuiz) {
                    res.status(200).send({ message: " Quiz already exists" });
                    return;
                }
                const newQuiz = yield this.quizService.createQuiz(quiz);
                console.log(newQuiz, 'new quiz postCreateQuiz');
                res.status(201).json(newQuiz);
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    getQuizzes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search = '', page = 1, limit = 10 } = req.query;
                const pageNum = parseInt(page, 10);
                const limitNum = parseInt(limit, 10);
                const result = yield this.quizService.findAll(pageNum, limitNum, search);
                console.log(result);
                res.status(200).json(result);
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
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
    getByLangugeAndCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { languageId, categoryId } = req.params;
                const languageObjectId = new mongoose_1.Types.ObjectId(languageId);
                const categoryObjectId = new mongoose_1.Types.ObjectId(categoryId);
                const quiz = yield this.quizService.findByLanguageAndCategory(languageObjectId, categoryObjectId);
                console.log(quiz, 'particular quiz');
                res.status(200).json(quiz);
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
}
exports.default = QuizController;
