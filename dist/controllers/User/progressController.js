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
class ProgressController {
    constructor(progressService, userService, lessonService) {
        this.progressService = progressService;
        this.userService = userService;
        this.lessonService = lessonService;
    }
    findProgressByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('progres');
            const email = req.user;
            const user = yield this.userService.findByEmail(email);
            const userId = user === null || user === void 0 ? void 0 : user._id;
            if (!mongoose_1.Types.ObjectId.isValid(userId)) {
                res.status(400).send({ error: 'Invalid user ID' });
                return;
            }
            try {
                const progress = yield this.progressService.findByUserId(new mongoose_1.Types.ObjectId(userId));
                if (!progress) {
                    res.status(404).send({ message: 'Progress not found' });
                    return;
                }
                console.log(progress, 'pr use');
                res.status(200).send(progress);
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
    updateOrCreateProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('object');
            const { userId, lessonId, languageId, isCompleted } = req.body;
            console.log(userId, lessonId, languageId, isCompleted, 'ksidj');
            try {
                const progress = yield this.progressService.updateOrCreateProgress(new mongoose_1.Types.ObjectId(userId), new mongoose_1.Types.ObjectId(languageId), new mongoose_1.Types.ObjectId(lessonId), isCompleted);
                console.log(progress, 'what res progress');
                if (progress) {
                    res.status(200).json({ message: 'Progress updated successfully', progress });
                }
                else {
                    res.status(500).json({ message: 'Failed to update progress' });
                }
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
    findLessonsWithProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { languageId, categoryId } = req.params;
            console.log(languageId, categoryId, 'backend leson on lang, cate');
            const email = req.user;
            const user = yield this.userService.findByEmail(email);
            const userId = user === null || user === void 0 ? void 0 : user._id;
            if (!mongoose_1.Types.ObjectId.isValid(userId)) {
                res.status(400).send({ error: 'Invalid user ID' });
                return;
            }
            try {
                const progress = yield this.progressService.findByUserId(new mongoose_1.Types.ObjectId(userId));
                if (!progress) {
                    res.status(404).json({ message: "Progress yet not started" });
                    return;
                }
                console.log(progress, 'userpro lan cat');
                const lessons = yield this.lessonService.findByLanguageAndCategory(new mongoose_1.Types.ObjectId(languageId), new mongoose_1.Types.ObjectId(categoryId));
                console.log(lessons, 'bak ');
                const lessonCompletionStatus = new Map();
                if (progress && progress.languages) {
                    for (const language of progress.languages) {
                        for (const lesson of language.lessons) {
                            lessonCompletionStatus.set(lesson.lesson.toString(), lesson.isCompleted);
                        }
                    }
                }
                const lessonsWithStatus = lessons.map((lesson) => (Object.assign(Object.assign({}, lesson.toObject()), { isCompleted: lessonCompletionStatus.get(lesson._id.toString()) || false })));
                console.log(lessonsWithStatus, 'cvad;');
                res.status(200).send(lessonsWithStatus);
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
exports.default = ProgressController;
