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
class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    postCreateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('controller ethi');
                const category = req.body;
                const categoryname = category.categoryName.toLowerCase();
                console.log(categoryname, 'categoryname');
                const existingCategory = yield this.categoryService.findByCategoryName(categoryname);
                if (existingCategory) {
                    res.status(200).json({ message: "Category already exists" });
                    return;
                }
                else {
                    console.log('else');
                    const newCategory = yield this.categoryService.createCategory(categoryname);
                    res.status(201).json(newCategory);
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
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('categories backend');
                const { search = '', page = 1, limit = 10 } = req.query;
                console.log(req.query, 'back');
                const pageNum = parseInt(page, 10);
                const limitNum = parseInt(limit, 10);
                const result = yield this.categoryService.findAll(pageNum, limitNum, search);
                console.log(result, 'categories result');
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error, 'errr');
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('category');
                const { id } = req.params;
                console.log(id, 'kd');
                const category = yield this.categoryService.findById(id);
                if (category) {
                    console.log(category, 'dk');
                    res.status(200).json(category);
                    return;
                }
                else {
                    console.log('category illa');
                    res.status(404).json({ message: "Category not found" });
                    return;
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
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('category update backend');
                const { id } = req.params;
                const { categoryName } = req.body;
                console.log(id, categoryName, 'cate update');
                const isCategory = yield this.categoryService.findById(id);
                if (!isCategory) {
                    res.status(404).json({ message: "Category not found" });
                    return;
                }
                let name = categoryName.toLowerCase();
                const existingCategory = yield this.categoryService.findByCategoryName(name);
                if (existingCategory && existingCategory._id != id) {
                    res.status(409).json({ message: "Category already exists with this name" });
                    return;
                }
                const updatedCategory = yield this.categoryService.updateCategory(id, { categoryName: name });
                res.status(200).json(updatedCategory);
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
    unblockCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('unblocking');
                const updatedCategory = yield this.categoryService.updateCategory(id, { isBlocked: false });
                if (updatedCategory) {
                    console.log(updatedCategory, 'update aayi');
                    res.status(200).json(updatedCategory);
                }
                else {
                    console.log('Category kaanan illa');
                    res.status(404).json({ message: 'Category not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
    blockCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('blocking');
                const updatedCategory = yield this.categoryService.updateCategory(id, { isBlocked: true });
                if (updatedCategory) {
                    console.log(updatedCategory, 'update aayi');
                    res.status(200).json(updatedCategory);
                }
                else {
                    console.log('Category kaanan illa');
                    res.status(404).json({ message: 'Category not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
}
exports.default = CategoryController;
