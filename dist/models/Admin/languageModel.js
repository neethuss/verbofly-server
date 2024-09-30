"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const mongoose_1 = require("mongoose");
const LanguageSchma = new mongoose_1.Schema({
    languageName: { type: String, required: true },
    countries: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Country', required: true }],
    isBlocked: { type: Boolean, default: false }
});
const Language = (0, mongoose_1.model)('Language', LanguageSchma);
exports.Language = Language;
