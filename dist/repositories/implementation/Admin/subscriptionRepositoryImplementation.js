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
const subscriptionModel_1 = require("../../../models/User/subscriptionModel");
class SubscriptionRepositoryImplementation {
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
            const subscriptions = yield subscriptionModel_1.Subscription.find(query).skip(offset).limit(limit).populate('user').exec();
            const total = yield subscriptionModel_1.Subscription.countDocuments(query);
            return { subscriptions, total };
        });
    }
}
exports.default = SubscriptionRepositoryImplementation;
