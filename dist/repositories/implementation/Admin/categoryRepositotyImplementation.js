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
const categoryModel_1 = require("../../../models/Admin/categoryModel");
class CategoryRepositoryImplementation {
    createCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCategory = yield categoryModel_1.Category.create({ categoryName });
            return newCategory;
        });
    }
    findByCategoryName(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoryModel_1.Category.findOne({ categoryName });
            return category;
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            const query = search ? {
                $or: [{ categoryName: { $regex: search, $options: 'i' } }]
            } : {};
            const categories = yield categoryModel_1.Category.find(query).skip(offset).limit(limit).exec();
            const total = yield categoryModel_1.Category.countDocuments(query);
            return { categories, total };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoryModel_1.Category.findById(id);
            return category;
        });
    }
    update(id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCategory = yield categoryModel_1.Category.findByIdAndUpdate(id, category, { new: true }).exec();
            console.log(updatedCategory, 'puthiyath');
            return updatedCategory;
        });
    }
}
exports.default = CategoryRepositoryImplementation;
