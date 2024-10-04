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
const userProgress_1 = require("../../../models/User/userProgress");
class ProgressRepositoryImplementation {
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('find progr');
            const user = yield userProgress_1.Progress.findOne({ userId }).populate('languages.language').populate('languages.lessons').populate('languages.lessons.lesson').exec();
            console.log(user, 'user in imp forf prot');
            return user;
        });
    }
    updateLessonProgress(userId, language, lessonId, isCompleted, quizUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield userProgress_1.Progress.findOne({ userId }).exec();
            console.log('priii', progress, language);
            // If no progress exists, return null
            if (!progress)
                return null;
            // Find language progress in the user's progress data
            const languageProgress = progress.languages.find((lang) => lang.language.equals(language));
            const updateFields = {};
            // Quiz updates
            if (quizUpdates) {
                if (quizUpdates.quizAttempted !== undefined) {
                    updateFields['languages.$.quizAttempted'] = ((languageProgress === null || languageProgress === void 0 ? void 0 : languageProgress.quizAttempted) || 0) + quizUpdates.quizAttempted;
                }
                if (quizUpdates.quizFailed !== undefined) {
                    updateFields['languages.$.quizFailed'] = ((languageProgress === null || languageProgress === void 0 ? void 0 : languageProgress.quizFailed) || 0) + quizUpdates.quizFailed;
                }
                if (quizUpdates.quizWin !== undefined) {
                    updateFields['languages.$.quizWin'] = ((languageProgress === null || languageProgress === void 0 ? void 0 : languageProgress.quizWin) || 0) + quizUpdates.quizWin;
                }
            }
            // If the language doesn't exist in the progress, push the new language with its lesson
            if (!languageProgress) {
                return userProgress_1.Progress.findOneAndUpdate({ userId }, {
                    $push: {
                        languages: {
                            language,
                            lessons: [{ lesson: lessonId, isCompleted, progress: isCompleted ? 100 : 0 }],
                            quizAttempted: (quizUpdates === null || quizUpdates === void 0 ? void 0 : quizUpdates.quizAttempted) || 0,
                            quizFailed: (quizUpdates === null || quizUpdates === void 0 ? void 0 : quizUpdates.quizFailed) || 0,
                            quizWin: (quizUpdates === null || quizUpdates === void 0 ? void 0 : quizUpdates.quizWin) || 0,
                        },
                    },
                }, { new: true }).exec();
            }
            const lessonExists = languageProgress.lessons.find((less) => less.lesson.equals(lessonId));
            if (!lessonExists) {
                console.log('this lesson id is not found in this particular lesssons');
                // updateFields['languages.$.lessons'] = {
                //   $push: {
                //     lesson: lessonId,
                //     isCompleted,
                //     progress: isCompleted ? 100 : 0,
                //   },
                // };
                const newLesson = {
                    lesson: lessonId,
                    isCompleted: true,
                    progress: isCompleted ? 100 : 0
                };
                const updatedProgress = yield languageProgress.lessons.push(newLesson);
                console.log(updatedProgress, 'updatedProgress');
                console.log(progress);
                return progress.save();
            }
            else {
                console.log(progress, 'in else');
                return progress.save();
            }
            // console.log(updateFields, 'updatedFields')
            // const updatedProgress = await Progress.findOneAndUpdate(
            //   { userId, 'languages.language': language },
            //   { $set: updateFields },
            //   {
            //     arrayFilters: [
            //       { 'languageElem.language': language },
            //       { 'lessonElem.lesson': lessonId },
            //     ],
            //     new: true,
            //   }
            // ).exec();
            // console.log(updatedProgress, 'updatedProgress')
            // return updatedProgress
        });
    }
    create(progress) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating new progress');
            progress.languages.forEach(lang => {
                lang.streak = 1;
                lang.lastActiveDate = new Date();
            });
            return new userProgress_1.Progress(progress).save();
        });
    }
    updateQuizProgress(userId, language, quizUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(userId) || !mongoose_1.Types.ObjectId.isValid(language)) {
                console.error('Invalid ObjectId provided');
                return null;
            }
            else {
                console.log('Valid ObjectIds');
            }
            const progress = yield userProgress_1.Progress.findOne({ userId }).exec();
            console.log(progress, 'progress for user:', language, userId);
            if (!progress)
                return null;
            const languageProgress = progress.languages.find((lang) => lang.language.equals(language));
            const updateFields = {};
            if (!languageProgress) {
                return userProgress_1.Progress.findOneAndUpdate({ userId }, {
                    $push: {
                        languages: {
                            language,
                            quizAttempted: quizUpdates.quizAttempted,
                            quizFailed: quizUpdates.quizFailed,
                            quizWin: quizUpdates.quizWin,
                            lessons: []
                        },
                    },
                }, { new: true }).exec();
            }
            updateFields['languages.$.quizAttempted'] = languageProgress.quizAttempted + quizUpdates.quizAttempted;
            updateFields['languages.$.quizFailed'] = languageProgress.quizFailed + quizUpdates.quizFailed;
            updateFields['languages.$.quizWin'] = languageProgress.quizWin + quizUpdates.quizWin;
            const updatedProgress = userProgress_1.Progress.findOneAndUpdate({ userId, 'languages.language': language }, { $set: updateFields }, { new: true }).exec();
            console.log(updatedProgress, 'Updated Progress');
            return updatedProgress;
        });
    }
}
exports.default = ProgressRepositoryImplementation;
