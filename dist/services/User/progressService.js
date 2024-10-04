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
class ProgressService {
    constructor(progressRepository) {
        this.progressRepository = progressRepository;
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId, 'find user for progress');
            return this.progressRepository.findByUserId(userId);
        });
    }
    //   async updateOrCreateProgress(userId: Types.ObjectId, language: Types.ObjectId, lessonId: Types.ObjectId, isCompleted: boolean): Promise<IProgress | null> {
    //     let progress = await this.progressRepository.findByUserId(userId);
    //     if (!progress) {
    //         return this.progressRepository.create({
    //             userId,
    //             languages: [
    //                 {
    //                     language,
    //                     lessons: [
    //                         {
    //                             lesson: lessonId,
    //                             isCompleted,
    //                             progress: isCompleted ? 100 : 0,
    //                         }
    //                     ]
    //                 }
    //             ]
    //         });
    //     } else {
    //         return this.progressRepository.updateLessonProgress(userId, language, lessonId, isCompleted);
    //     }
    // }
    updateOrCreateProgress(userId, language, lessonId, isCompleted, result) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('updating progrss');
            let progress = yield this.progressRepository.findByUserId(userId);
            console.log('pr', progress);
            const quizUpdates = {
                quizAttempted: result ? 1 : 0,
                quizFailed: result === 'failed' ? 1 : 0,
                quizWin: result === 'passed' ? 1 : 0
            };
            console.log(quizUpdates, 'a');
            if (!progress) {
                return this.progressRepository.create({
                    userId,
                    languages: [
                        {
                            language,
                            quizAttempted: quizUpdates.quizAttempted || 0,
                            quizFailed: quizUpdates.quizFailed || 0,
                            quizWin: quizUpdates.quizWin || 0,
                            streak: 1,
                            lastActiveDate: new Date(),
                            lessons: lessonId
                                ? [
                                    {
                                        lesson: lessonId,
                                        isCompleted,
                                        progress: isCompleted ? 100 : 0,
                                    }
                                ]
                                : []
                        }
                    ]
                });
            }
            else {
                if (lessonId) {
                    return this.progressRepository.updateLessonProgress(userId, language, lessonId, isCompleted, quizUpdates);
                }
                else if (result) {
                    console.log('isdj');
                    return this.progressRepository.updateQuizProgress(userId, language, quizUpdates);
                }
            }
            return null;
        });
    }
}
exports.default = ProgressService;
