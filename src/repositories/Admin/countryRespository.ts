import { ICountry } from "../../models/Admin/countryModel";

interface CountryRepository{
  createCountry(countryName : string) : Promise<ICountry>
  findByCountryName(countryName : string) : Promise<ICountry | null>
  findAll(page:number, limit:number, search: string) : Promise<{countries : ICountry[], total : number}>
  findById(id : string) : Promise<ICountry | null>
  update(id : string, country : Partial<ICountry>) : Promise<ICountry | null>
}

export default CountryRepository