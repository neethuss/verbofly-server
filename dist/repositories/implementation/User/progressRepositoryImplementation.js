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
    //   async updateLessonProgress(userId: Types.ObjectId, language: Types.ObjectId, lesson: Types.ObjectId, isCompleted: boolean): Promise<IProgress | null> {
    //     console.log('Updating lesson progress in the repository implementation');
    //     const progress = await Progress.findOne({ userId, 'languages.language': language }).exec();
    //     if (!progress) {
    //         console.log('No progress found for the given user and language');
    //         return null;
    //     }
    //     const languageExists = progress.languages.find(lang => lang.language.equals(language));
    //     if (!languageExists) {
    //         console.log('Language does not exist in progress');
    //         return null;
    //     }
    //     const lessonExists = languageExists.lessons.find(less => less.lesson.equals(lesson));
    //     if (!lessonExists) {
    //         // If the lesson does not exist under this language, add it
    //         await Progress.findOneAndUpdate(
    //             { userId, 'languages.language': language },
    //             {
    //                 $push: {
    //                     'languages.$.lessons': { lesson, isCompleted, progress: isCompleted ? 100 : 0 }
    //                 }
    //             },
    //             { new: true }
    //         ).exec();
    //     } else {
    //         // If lesson exists, update its progress and completion status
    //         await Progress.findOneAndUpdate(
    //             { userId, 'languages.language': language, 'languages.lessons.lesson': lesson },
    //             {
    //                 $set: {
    //                     'languages.$[languageElem].lessons.$[lessonElem].isCompleted': isCompleted,
    //                     'languages.$[languageElem].lessons.$[lessonElem].progress': isCompleted ? 100 : 0
    //                 }
    //             },
    //             {
    //                 arrayFilters: [
    //                     { 'languageElem.language': language },
    //                     { 'lessonElem.lesson': lesson }
    //                 ],
    //                 new: true
    //             }
    //         ).exec();
    //     }
    //     // Fetch and return the updated progress
    //     const updatedProgress = await Progress.findOne({ userId }).exec();
    //     console.log(updatedProgress, 'Updated progress');
    //     return updatedProgress;
    //   }
    updateLessonProgress(userId, language, lesson, isCompleted) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Updating lesson progress in the repository implementation');
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize to start of the day
            const progress = yield userProgress_1.Progress.findOne({ userId, 'languages.language': language }).exec();
            if (!progress) {
                console.log('No progress found for the given user and language');
                return null;
            }
            const languageProgress = progress.languages.find(lang => lang.language.equals(language));
            if (!languageProgress) {
                console.log('Language does not exist in progress');
                return null;
            }
            const lessonExists = languageProgress.lessons.find(less => less.lesson.equals(lesson));
            if (!lessonExists) {
                // Add the lesson if it does not exist
                yield userProgress_1.Progress.findOneAndUpdate({ userId, 'languages.language': language }, {
                    $push: {
                        'languages.$.lessons': { lesson, isCompleted, progress: isCompleted ? 100 : 0 }
                    }
                }, { new: true }).exec();
            }
            else {
                // Update the lesson's progress and completion status
                yield userProgress_1.Progress.findOneAndUpdate({ userId, 'languages.language': language, 'languages.lessons.lesson': lesson }, {
                    $set: {
                        'languages.$[languageElem].lessons.$[lessonElem].isCompleted': isCompleted,
                        'languages.$[languageElem].lessons.$[lessonElem].progress': isCompleted ? 100 : 0
                    }
                }, {
                    arrayFilters: [
                        { 'languageElem.language': language },
                        { 'lessonElem.lesson': lesson }
                    ],
                    new: true
                }).exec();
            }
            // Update the streak
            const lastActiveDate = languageProgress.lastActiveDate;
            if (lastActiveDate) {
                const diffDays = Math.floor((today.getTime() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    languageProgress.streak += 1;
                }
                else if (diffDays > 1) {
                    languageProgress.streak = 1; // Reset streak if not consecutive
                }
            }
            else {
                languageProgress.streak = 1; // Start new streak
            }
            languageProgress.lastActiveDate = today;
            yield progress.save();
            // Fetch and return the updated progress
            const updatedProgress = yield userProgress_1.Progress.findOne({ userId }).populate('languages.language').populate('languages.lessons.lesson').exec();
            console.log(updatedProgress, 'Updated progress');
            return updatedProgress;
        });
    }
    //   async create(progress: IProgress): Promise<IProgress> {
    //     console.log('object')
    //     return new Progress(progress).save();
    //   }
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
}
exports.default = ProgressRepositoryImplementation;
