"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    country: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Country', default: null },
    nativeLanguage: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Language', default: null },
    knownLanguages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language', default: null }],
    languagesToLearn: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Language', default: null }],
    profilePhoto: { type: String, default: null },
    bio: { type: String, default: null },
    sentRequests: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    receivedRequests: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    connections: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.User = User;
