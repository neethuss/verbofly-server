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
class QuizService {
    constructor(quizRespository) {
        this.quizRespository = quizRespository;
    }
    createQuiz(quiz) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('createQuiz QuizService');
            const newQuiz = yield this.quizRespository.createQuiz(quiz);
            return newQuiz;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('findByName QuizService');
            const quiz = yield this.quizRespository.findByName(name);
            return quiz;
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.quizRespository.findAll(page, limit, search);
            return result;
        });
    }
    findByLanguageAndCategory(languageName, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield this.quizRespository.findByLanguageAndCategory(languageName, categoryName);
            return quiz;
        });
    }
}
exports.default = QuizService;
