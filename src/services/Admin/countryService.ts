import { ICountry } from "../../models/Admin/countryModel";
import CountryRepository from "../../repositories/Admin/countryRespository";

class CountryService{
  private countryRepository : CountryRepository

  constructor(countryRepository : CountryRepository){
    this.countryRepository = countryRepository
  }

  async createCountry(countryName : string) : Promise<ICountry>{
    const newCountry = await this.countryRepository.createCountry(countryName)
    return newCountry
  }

  async findByCountryName(countryName : string) : Promise<ICountry| null>{
    const country = await this.countryRepository.findByCountryName(countryName)
    return country
  }

  async findAll(page:number, limit:number, search:string) : Promise<{countries : ICountry[], total: number}>{
    const result = await this.countryRepository.findAll(page, limit, search)
    return result
  }

  async findById(id: string) : Promise<ICountry | null>{
    const country = await this.countryRepository.findById(id)
    return country
  }

  async updateCountry(id : string, country : Partial<ICountry>) : Promise<ICountry | null>{
    const updatedCountry = await this.countryRepository.update(id, country)
    return updatedCountry
  }

}

export default CountryService
