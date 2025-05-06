import { Types } from "mongoose";
import { ILanguage, Language } from "../../../models/Admin/languageModel";
import LanguageRepository from "../../Admin/languageRepository";
import { BaseRepositoryImplentation } from "../Base/baseRepositoryImplementation";
import { paginate } from "../Base/baseRepositoryImplementation";

class LanguageRepositoryImplementation
  extends BaseRepositoryImplentation<ILanguage>
  implements LanguageRepository
{
  constructor() {
    super(Language); 
  }

  async createLanaguage(language: ILanguage): Promise<ILanguage> {
    return this.create(language);
  }

  async findBylanguageName(languageName: string): Promise<ILanguage | null> {
    return this.findOne({ languageName });
  }

  async findAll(
    page: number,
    limit: number,
    search: string
  ): Promise<{ languages: ILanguage[]; total: number }> {
    const filter = search
      ? {
          $or: [
            {
              languageName: { $regex: search, $options: "i" },
            },
          ],
        }
      : {};

    const result = await paginate<ILanguage>(this, filter, page, limit, {
      populate: "countries",
    });

    return {
      languages: result.data,
      total: result.total,
    };
  }

  async update(id: string, language: Partial<ILanguage>): Promise<ILanguage | null> {
    return super.update(id, language);
  }

  async getObjectIdArrayByNames(names: string[]): Promise<Types.ObjectId[]> {
    const languages = await this.find({ languageName: { $in: names } });
    return languages.map((lang) => lang._id as Types.ObjectId);
  }
}

export default LanguageRepositoryImplementation;
