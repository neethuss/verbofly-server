import CountryService from "../../services/Admin/countryService";
import { Request, Response } from "express";

class CountryController {
  private countryService: CountryService

  constructor(countryService: CountryService) {
    this.countryService = countryService
  }

  async postCountry(req: Request, res: Response): Promise<void> {
    try {
      const country = req.body
      const countryname = country.countryName.toLowerCase().trim()
      const existingCountry = await this.countryService.findByCountryName(countryname)
      if (existingCountry) {
        res.status(200).json({ message: "Country already exists" })
        return
      } else {
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

  async getCountries(req: Request, res: Response): Promise<void> {
    try {
      const { search = '', page = 1, limit = 10 } = req.query
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this.countryService.findAll(pageNum, limitNum, search as string);
      res.status(200).json(result);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getCountry(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const country = await this.countryService.findById(id)

      if (country) {
        res.status(200).json(country)
        return
      } else {
        res.status(404).json({ message: "Country not found" })
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

  async updateCountry(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { countryName } = req.body
      const isCountry = await this.countryService.findById(id)
      if (!isCountry) {
        res.status(404).json({ message: "Country not found" })
        return
      }
      let name = countryName.toLowerCase().trim()
      const existingCountry = await this.countryService.findByCountryName(name)
      if (existingCountry && existingCountry._id != id) {
        res.status(409).json({ message: "Country already exists with this name" })
        return
      }
      const updatedCountry = await this.countryService.updateCountry(id, { countryName: name })
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
      const updatedCountry = await this.countryService.updateCountry(id, { isBlocked: false })
      if (updatedCountry) {
        res.status(200).json(updatedCountry)
      } else {
        res.status(404).json({ message: 'Country not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }


  async blockCountry(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updatedCountry = await this.countryService.updateCountry(id, { isBlocked: true })
      if (updatedCountry) {
        res.status(200).json(updatedCountry)
      } else {
        res.status(404).json({ message: 'Country not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }

}

export default CountryController