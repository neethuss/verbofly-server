import { ICountry, Country } from "../../../models/Admin/countryModel";
import CountryRepository from "../../Admin/countryRespository";
import { BaseRepositoryImplentation } from "../../implementation/Base/baseRepositoryImplementation";
import { FilterQuery } from "mongoose";

class CountryRepositoryImplementation
  extends BaseRepositoryImplentation<ICountry>
  implements CountryRepository 
{
  constructor() {
    super(Country);
  }

  async createCountry(countryName: string): Promise<ICountry> {
    return this.create({ countryName });
  }

  async findByCountryName(countryName: string): Promise<ICountry | null> {
    const filter: FilterQuery<ICountry> = { countryName };
    return this.findOne(filter);
  }

  async findAll(page: number, limit: number, search: string): Promise<{ countries: ICountry[]; total: number }> {
    const filter: FilterQuery<ICountry> = search
      ? { countryName: { $regex: search, $options: "i" } }
      : {};

    const skip = (page - 1) * limit;

    const [countries, total] = await Promise.all([
      this.find(filter, { skip, limit }),
      this.count(filter)
    ]);

    return { countries, total };
  }

  async findById(id: string): Promise<ICountry | null> {
    return super.findById(id);
  }

  async update(id: string, country: Partial<ICountry>): Promise<ICountry | null> {
    return super.update(id, country);
  }
}

export default CountryRepositoryImplementation;
