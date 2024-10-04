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
const quizModel_1 = require("../../../models/Admin/quizModel");
class QuizRepositoryImplementation {
    createQuiz(quiz) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('createQuiz QuizRepositoryImplementation');
            console.log(quiz, 'quiz QuizRepositoryImplementation');
            const newQuiz = yield quizModel_1.Quiz.create(quiz);
            console.log(newQuiz, 'newQuiz QuizRepositoryImplementation');
            return newQuiz;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('findByName QuizRepositoryImplementation');
            const lesson = yield quizModel_1.Quiz.findOne({ name });
            return lesson;
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            const query = search ? {
                $or: [
                    {
                        title: { $regex: search, $options: 'i' }
                    }
                ]
            } : {};
            const quizzes = yield quizModel_1.Quiz.find(query).skip(offset).limit(limit).populate('languageName').populate('categoryName').exec();
            const total = yield quizModel_1.Quiz.countDocuments(query);
            return { quizzes, total };
        });
    }
    findByLanguageAndCategory(languageName, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield quizModel_1.Quiz.findOne({ languageName, categoryName });
            return quiz;
        });
    }
}
exports.default = QuizRepositoryImplementation;
