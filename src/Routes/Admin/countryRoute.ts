import { Router } from "express";

const router = Router()


import CountryController from "../../controllers/Admin/countryController"
import CountryService from "../../services/Admin/countryService";
import CountryRepositoryImplentation from "../../repositories/implementation/Admin/countryRepositoryImplementation";

const countryRepositoryImplementation = new CountryRepositoryImplentation()
const countryService = new CountryService(countryRepositoryImplementation)
const countryController = new CountryController(countryService)

import authenticationMiddleware from "../../middlewares/authenticationMiddleware";

router.get('/countries', authenticationMiddleware,(req,res) => countryController.getCountries(req,res))
router.post('/addCountry', authenticationMiddleware,(req,res) => countryController.postCountry(req,res))
router.get('/:id', authenticationMiddleware,(req,res) => countryController.getCountry(req,res))
router.patch('/:id', authenticationMiddleware,(req,res) => countryController.updateCountry(req,res))
router.patch('/block/:id', authenticationMiddleware, (req,res) => countryController.blockCountry(req, res))
router.patch('/unblock/:id', authenticationMiddleware, (req,res) => countryController.unblockCountry(req, res))

export default router