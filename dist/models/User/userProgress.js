"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const mongoose_1 = require("mongoose");
const ProgressSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    languages: [{
            language: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Language' },
            streak: { type: Number, default: 0 },
            lastActiveDate: { type: Date },
            lessons: [{
                    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson' },
                    isCompleted: { type: Boolean, default: false },
                    progress: { type: Number, default: 0 }
                }]
        }]
});
const Progress = (0, mongoose_1.model)('Progress', ProgressSchema);
exports.Progress = Progress;
