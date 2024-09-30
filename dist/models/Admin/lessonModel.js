"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lesson = void 0;
const mongoose_1 = require("mongoose");
const LessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    languageName: { type: mongoose_1.Schema.Types.ObjectId, ref: "Language", required: true },
    categoryName: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
    isBlocked: { type: Boolean, default: false },
});
const Lesson = (0, mongoose_1.model)("Lesson", LessonSchema);
exports.Lesson = Lesson;
