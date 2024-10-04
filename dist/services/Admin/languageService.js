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
class LanguageService {
    constructor(languageRepository) {
        this.languageRepository = languageRepository;
    }
    createLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            const newLanguage = yield this.languageRepository.createLanaguage(language);
            return newLanguage;
        });
    }
    findByLanguageName(languageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = yield this.languageRepository.findBylanguageName(languageName);
            return language;
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.languageRepository.findAll(page, limit, search);
            return result;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = yield this.languageRepository.findById(id);
            return language;
        });
    }
    updateLanguagae(id, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedLanguage = yield this.languageRepository.update(id, language);
            return updatedLanguage;
        });
    }
    getObjectIdArrayByNames(names) {
        return __awaiter(this, void 0, void 0, function* () {
            const languages = yield this.languageRepository.getObjectIdArrayByNames(names);
            return languages;
        });
    }
}
exports.default = LanguageService;
