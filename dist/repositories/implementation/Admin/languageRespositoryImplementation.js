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
const languageModel_1 = require("../../../models/Admin/languageModel");
class LanguageRepositoryImplementation {
    createLanaguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(language, 'ell l undo');
            const newLanguage = yield languageModel_1.Language.create(language);
            console.log(newLanguage, 'nl');
            return newLanguage;
        });
    }
    findBylanguageName(languageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = yield languageModel_1.Language.findOne({ languageName });
            return language;
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            const query = search ? {
                $or: [
                    {
                        languageName: { $regex: search, $options: 'i' }
                    }
                ]
            } : {};
            const languages = yield languageModel_1.Language.find(query).skip(offset).limit(limit).populate('countries').exec();
            const total = yield languageModel_1.Language.countDocuments(query);
            return { languages, total };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = yield languageModel_1.Language.findById(id).populate('countries');
            return language;
        });
    }
    update(id, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedLanguage = yield languageModel_1.Language.findByIdAndUpdate(id, language, { new: true }).exec();
            return updatedLanguage;
        });
    }
    getObjectIdArrayByNames(names) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('imp eth');
            const languages = yield languageModel_1.Language.find({ languageName: { $in: names } }).exec();
            const objectIds = languages.map(language => language._id);
            console.log("Language ObjectIds:", objectIds);
            return objectIds;
        });
    }
}
exports.default = LanguageRepositoryImplementation;
