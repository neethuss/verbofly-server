import { ICountry, Country } from "../../../models/Admin/countryModel";
import CountryRepository from "../../Admin/countryRespository";

class CountryRepositoryImplentation implements CountryRepository {
  async createCountry(countryName: string): Promise<ICountry> {
    const newCountry = await Country.create({ countryName })
    return newCountry
  }

  async findByCountryName(countryName: string): Promise<ICountry | null> {
    const country = await Country.findOne({ countryName })
    return country
  }

  async findAll(page: number, limit: number, search: string): Promise<{ countries: ICountry[]; total: number; }> {
    const offset = (page - 1) * limit;
    const query = search
      ? {
        $or: [
          { countryName: { $regex: search, $options: 'i' } }

        ],
      }
      : {};

    const countries = await Country.find(query).skip(offset).limit(limit).exec();
    const total = await Country.countDocuments(query);
    console.log(countries,'coun')
    return { countries, total };
  }

  async findById(id: string): Promise<ICountry | null> {
    const country = await Country.findById(id)
    return country
  }

  async update(id: string, country: Partial<ICountry>): Promise<ICountry | null> {
    const updatedCountry = await Country.findByIdAndUpdate(id, country, { new: true }).exec()
    console.log(updatedCountry, 'puthiyath')
    return updatedCountry
  }
}

export default CountryRepositoryImplentation