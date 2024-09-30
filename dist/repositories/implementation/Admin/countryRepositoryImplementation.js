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
const countryModel_1 = require("../../../models/Admin/countryModel");
class CountryRepositoryImplentation {
    createCountry(country) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCountry = yield countryModel_1.Country.create(country);
            return newCountry;
        });
    }
    findByCountryName(countryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield countryModel_1.Country.findOne({ countryName });
            return country;
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            const query = search
                ? {
                    $or: [
                        { countryName: { $regex: search, $options: 'i' } }
                    ],
                }
                : {};
            const countries = yield countryModel_1.Country.find(query).skip(offset).limit(limit).exec();
            const total = yield countryModel_1.Country.countDocuments(query);
            return { countries, total };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const country = yield countryModel_1.Country.findById(id);
            return country;
        });
    }
    update(id, country) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCountry = yield countryModel_1.Country.findByIdAndUpdate(id, country, { new: true }).exec();
            console.log(updatedCountry, 'puthiyath');
            return updatedCountry;
        });
    }
}
exports.default = CountryRepositoryImplentation;
