"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const SubscriptionSchma = new mongoose_1.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, default: 199, required: true },
    orderId: { type: String },
    expirationDate: { type: Date, default: null }
});
const Subscription = (0, mongoose_1.model)('Subscription', SubscriptionSchma);
exports.Subscription = Subscription;
