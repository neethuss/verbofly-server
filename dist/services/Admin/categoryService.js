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
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    createCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCategory = yield this.categoryRepository.createCategory(categoryName);
            return newCategory;
        });
    }
    findByCategoryName(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findByCategoryName(categoryName);
            return category;
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.categoryRepository.findAll(page, limit, search);
            console.log('result');
            return result;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findById(id);
            return category;
        });
    }
    updateCategory(id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCategory = yield this.categoryRepository.update(id, category);
            return updatedCategory;
        });
    }
}
exports.default = CategoryService;
