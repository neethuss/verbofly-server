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
class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    getSubscriptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search = '', page = 1, limit = 10 } = req.query;
                const pageNum = parseInt(page, 10);
                const limitNum = parseInt(limit, 10);
                const result = yield this.subscriptionService.findAll(pageNum, limitNum, search);
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
}
exports.default = SubscriptionController;
