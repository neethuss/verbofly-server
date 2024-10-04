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
const lessonModel_1 = require("../../../models/Admin/lessonModel");
class LessonRepositoryImplementation {
    createLesson(lesson) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('le repo imp');
            const newLesson = yield lessonModel_1.Lesson.create(lesson);
            return newLesson;
        });
    }
    findByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield lessonModel_1.Lesson.findOne({ title });
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
            const lessons = yield lessonModel_1.Lesson.find(query).skip(offset).limit(limit).populate('languageName').populate('categoryName').exec();
            const total = yield lessonModel_1.Lesson.countDocuments(query);
            return { lessons, total };
        });
    }
    findByLanguageAndCategory(languageName, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield lessonModel_1.Lesson.find({ languageName, categoryName });
            return lessons;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('d');
            const lesson = yield lessonModel_1.Lesson.findById(id).populate('languageName').populate('categoryName').exec();
            console.log(lesson, 'les impl');
            return lesson;
        });
    }
    findLessonsByLanguageId(languageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield lessonModel_1.Lesson.find({ languageName: languageId }).exec();
            }
            catch (error) {
                throw new Error('Error fetching lessons from the database');
            }
        });
    }
    update(id, lesson) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedLesson = yield lessonModel_1.Lesson.findByIdAndUpdate(id, lesson, { new: true }).exec();
            return updatedLesson;
        });
    }
}
exports.default = LessonRepositoryImplementation;
