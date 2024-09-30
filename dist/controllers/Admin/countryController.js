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
class CountryController {
    constructor(countryService) {
        this.countryService = countryService;
    }
    postCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const country = req.body;
                console.log(req.body, 'he');
                const existingCountry = yield this.countryService.findByCountryName(country.countryName);
                if (existingCountry) {
                    res.status(200).json({ message: "Country already exists" });
                }
                else {
                    const newCountry = yield this.countryService.createCountry(country);
                    res.status(201).json(newCountry);
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
    getCountries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('coun');
                const { search = '', page = 1, limit = 10 } = req.query;
                const pageNum = parseInt(page, 10);
                const limitNum = parseInt(limit, 10);
                const result = yield this.countryService.findAll(pageNum, limitNum, search);
                console.log(result, 'ju');
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
    getCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('country');
                const { id } = req.params;
                console.log(id, 'kd');
                const country = yield this.countryService.findById(id);
                if (country) {
                    console.log(country, 'dk');
                    res.status(200).json(country);
                    return;
                }
                else {
                    console.log('country illa');
                    res.status(404).json({ message: "Country not found" });
                    return;
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
    updateCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('country update backend');
                const { id } = req.params;
                const { countryName } = req.body;
                const isCountry = yield this.countryService.findById(id);
                if (!isCountry) {
                    res.status(404).json({ message: "Country not found" });
                    return;
                }
                const existingCountry = yield this.countryService.findByCountryName(countryName);
                if (existingCountry && existingCountry._id != id) {
                    res.status(409).json({ message: "Country already exists with this name" });
                    return;
                }
                const updatedCountry = yield this.countryService.updateCountry(id, { countryName });
                res.status(200).json(updatedCountry);
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
    unblockCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('unblocking');
                const updatedCountry = yield this.countryService.updateCountry(id, { isBlocked: false });
                if (updatedCountry) {
                    console.log(updatedCountry, 'update aayi');
                    res.status(200).json(updatedCountry);
                }
                else {
                    console.log('Country kaanan illa');
                    res.status(404).json({ message: 'Country not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
    blockCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('blocking');
                const updatedCountry = yield this.countryService.updateCountry(id, { isBlocked: true });
                if (updatedCountry) {
                    console.log(updatedCountry, 'update aayi');
                    res.status(200).json(updatedCountry);
                }
                else {
                    console.log('Country kaanan illa');
                    res.status(404).json({ message: 'Country not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
}
exports.default = CountryController;
