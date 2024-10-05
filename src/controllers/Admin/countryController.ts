import CountryService from "../../services/Admin/countryService";
import { Request, Response } from "express";

class CountryController{
  private countryService : CountryService

  constructor(countryService : CountryService){
    this.countryService = countryService
  }

  async postCountry(req : Request, res : Response) : Promise<void>{
    try {
      console.log('country add in backend')
      const country = req.body
      const countryname = country.countryName.toLowerCase().trim()
      console.log(countryname,'country name')
      const existingCountry = await this.countryService.findByCountryName(countryname)
      console.log(existingCountry,'existing nthosn')
      if(existingCountry){
        res.status(200).json({ message: "Country already exists" })
        return
      }else{
        const newCountry = await this.countryService.createCountry(countryname)
        res.status(201).json(newCountry)
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getCountries(req:Request, res:Response) : Promise<void>{
    try {
      console.log('coun')
      const {search='', page=1, limit=10} = req.query
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this.countryService.findAll(pageNum, limitNum, search as string);
      console.log(result,'ju')
      res.status(200).json(result);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getCountry(req: Request, res: Response) : Promise<void>{
    try {
      console.log('country')
      const {id} = req.params
      console.log(id,'kd')
      const country = await this.countryService.findById(id)
      
      if(country){
        console.log(country,'dk')
        res.status(200).json(country)
     return
      }else{
        console.log('country illa')
        res.status(404).json({message : "Country not found"})
        return
      }
      
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async updateCountry(req:Request, res:Response) : Promise<void>{
    try {
      console.log('country update backend')
      const {id} = req.params
      const {countryName} = req.body
      const isCountry = await this.countryService.findById(id)
      if(!isCountry){
        res.status(404).json({message : "Country not found"})
        return
      }
      let name = countryName.toLowerCase().trim()
      console.log(name,'clg')
      const existingCountry = await this.countryService.findByCountryName(name)
      if(existingCountry &&  existingCountry._id != id){
        res.status(409).json({message : "Country already exists with this name"})
        return
      }
      const updatedCountry = await this.countryService.updateCountry(id, {countryName:name})
      res.status(200).json(updatedCountry)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }


  async unblockCountry(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      console.log('unblocking')
      const updatedCountry = await this.countryService.updateCountry(id, { isBlocked: false })
      if (updatedCountry) {
        console.log(updatedCountry, 'update aayi')
        res.status(200).json(updatedCountry)
      } else {
        console.log('Country kaanan illa')
        res.status(404).json({ message: 'Country not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }


  async blockCountry(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      console.log('blocking')
      const updatedCountry = await this.countryService.updateCountry(id, { isBlocked: true })
      if (updatedCountry) {
        console.log(updatedCountry, 'update aayi')
        res.status(200).json(updatedCountry)
      } else {
        console.log('Country kaanan illa')
        res.status(404).json({ message: 'Country not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }

}

export default CountryController