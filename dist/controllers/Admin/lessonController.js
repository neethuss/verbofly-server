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
class LessonController {
    constructor(lessonService) {
        this.lessonService = lessonService;
    }
    postCreateLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('le backend');
            try {
                if (!req.file) {
                    res.status(400).json({ message: 'No file uploaded' });
                    return;
                }
                const lesson = req.body;
                console.log(lesson, 'less body');
                const existingLesson = yield this.lessonService.findByTitle(lesson.title);
                if (existingLesson) {
                    res.status(200).send({ message: " Lesson already exists" });
                    return;
                }
                console.log(req.file, 'file');
                const fileUrl = req.file.location;
                lesson.content = fileUrl;
                console.log(lesson.content, 'con');
                console.log(lesson, 'tot less');
                const newLesson = yield this.lessonService.createLesson(lesson);
                console.log(newLesson, 'new L');
                res.status(201).json(newLesson);
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
    getLessons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('less');
                const { search = '', page = 1, limit = 10 } = req.query;
                const pageNum = parseInt(page, 10);
                const limitNum = parseInt(limit, 10);
                const result = yield this.lessonService.findAll(pageNum, limitNum, search);
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
    getLessonById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('bsk');
            try {
                console.log('lesson backend');
                const { lessonId } = req.params;
                console.log(lessonId, 'ji');
                const lesson = yield this.lessonService.findById(lessonId);
                console.log(lesson, 'les');
                res.status(200).json(lesson);
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
    unblockLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('unblocking');
                const updatedLesson = yield this.lessonService.updateLesson(id, { isBlocked: false });
                if (updatedLesson) {
                    console.log(updatedLesson, 'update aayi');
                    res.status(200).json(updatedLesson);
                }
                else {
                    console.log('Lesson kaanan illa');
                    res.status(404).json({ message: 'Lesson not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
    blockLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('blocking');
                const updatedLesson = yield this.lessonService.updateLesson(id, { isBlocked: true });
                if (updatedLesson) {
                    console.log(updatedLesson, 'update aayi');
                    res.status(200).json(updatedLesson);
                }
                else {
                    console.log('Lesson kaanan illa');
                    res.status(404).json({ message: 'Lesson not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
    getCategoryLessons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { languageId, categoryId } = req.params;
                const languageObjectId = new mongoose_1.Types.ObjectId(languageId);
                const categoryObjectId = new mongoose_1.Types.ObjectId(categoryId);
                const lessons = yield this.lessonService.findByLanguageAndCategory(languageObjectId, categoryObjectId);
                console.log(lessons, 'particular lessons');
                res.status(200).json(lessons);
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
    getLessonByLanguageId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { languageId } = req.params;
                console.log(languageId, 'backed');
                console.log('aaaaaaaaaaaaaaaaaaa');
                if (!languageId) {
                    res.status(400).json({ message: 'Language ID is required' });
                    return;
                }
                const lessons = yield this.lessonService.getLessonsByLanguageId(languageId);
                if (!lessons.length) {
                    res.status(404).json({ message: 'No lessons found for the provided language ID' });
                    return;
                }
                res.status(200).json(lessons);
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
exports.default = LessonController;
