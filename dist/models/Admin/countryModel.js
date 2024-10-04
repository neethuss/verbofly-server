"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = void 0;
const mongoose_1 = require("mongoose");
const CountrySchema = new mongoose_1.Schema({
    countryName: { type: String, required: true },
    isBlocked: { type: Boolean, default: false }
});
const Country = (0, mongoose_1.model)('Country', CountrySchema);
exports.Country = Country;
