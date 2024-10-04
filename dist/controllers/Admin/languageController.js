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
class LanguageController {
    constructor(languageService) {
        this.languageServie = languageService;
    }
    postLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = req.body;
                const languageName = language.languageName.toLowerCase();
                const existingLanguage = yield this.languageServie.findByLanguageName(languageName);
                if (existingLanguage) {
                    res.status(200).json({ message: "Language already exists" });
                }
                else {
                    const newLanguage = yield this.languageServie.createLanguage(language);
                    console.log(newLanguage, 'new l');
                    res.status(201).json(newLanguage);
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
    getLanguages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('lages');
                const { search = '', page = 1, limit = 10 } = req.query;
                const pageNum = parseInt(page, 10);
                const limitNum = parseInt(limit, 10);
                const result = yield this.languageServie.findAll(pageNum, limitNum, search);
                console.log(result);
                res.status(200).json(result);
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
    updateLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { languageName, countries } = req.body;
                const languagename = languageName.toLowerCase();
                const existingLanguage = yield this.languageServie.findById(id);
                if (!existingLanguage) {
                    res.status(404).json({ message: "Language not found" });
                    return;
                }
                const duplicateLanguage = yield this.languageServie.findByLanguageName(languagename);
                if (duplicateLanguage && duplicateLanguage._id != id) {
                    res.status(409).json({ message: "Language already exists with this name" });
                    return;
                }
                const updatedLanguage = yield this.languageServie.updateLanguagae(id, { languageName: languagename, countries });
                if (!updatedLanguage) {
                    res.status(500).json({ message: "Failed to update language" });
                    return;
                }
                res.status(200).json(updatedLanguage);
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
    getLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                console.log(id, 'back');
                const language = yield this.languageServie.findById(id);
                res.status(200).send(language);
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
    unblockLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('unblocking');
                const updatedLanguage = yield this.languageServie.updateLanguagae(id, { isBlocked: false });
                if (updatedLanguage) {
                    console.log(updatedLanguage, 'update aayi');
                    res.status(200).json(updatedLanguage);
                }
                else {
                    console.log('Language kaanan illa');
                    res.status(404).json({ message: 'Language not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
    blockLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('blocking');
                const updatedLanguage = yield this.languageServie.updateLanguagae(id, { isBlocked: true });
                if (updatedLanguage) {
                    console.log(updatedLanguage, 'update aayi');
                    res.status(200).json(updatedLanguage);
                }
                else {
                    console.log('Language kaanan illa');
                    res.status(404).json({ message: 'Language not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
    getLangugage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('start language lesson backend');
                const { id } = req.params;
                console.log(id, 'language id');
                const language = yield this.languageServie.findById(id);
                console.log(language, 'language ');
                res.status(200).json(language);
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
exports.default = LanguageController;
