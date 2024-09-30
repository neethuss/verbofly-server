"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    categoryName: { type: String, required: true },
    isBlocked: { type: Boolean, default: false }
});
const Category = (0, mongoose_1.model)('Category', CategorySchema);
exports.Category = Category;
