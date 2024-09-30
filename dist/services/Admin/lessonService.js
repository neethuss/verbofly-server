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
class LessonService {
    constructor(lessonRepository) {
        this.lessonRespository = lessonRepository;
    }
    createLesson(lesson) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('le ser');
            const newLesson = yield this.lessonRespository.createLesson(lesson);
            return newLesson;
        });
    }
    findByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield this.lessonRespository.findByTitle(title);
            return lesson;
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.lessonRespository.findAll(page, limit, search);
            return result;
        });
    }
    findByLanguageAndCategory(languageName, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield this.lessonRespository.findByLanguageAndCategory(languageName, categoryName);
            return lessons;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('le ser');
            const lesson = yield this.lessonRespository.findById(id);
            return lesson;
        });
    }
    getLessonsByLanguageId(languageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.lessonRespository.findLessonsByLanguageId(languageId);
            }
            catch (error) {
                throw new Error('Error fetching lessons');
            }
        });
    }
    updateLesson(id, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedLesson = yield this.lessonRespository.update(id, language);
            return updatedLesson;
        });
    }
}
exports.default = LessonService;
