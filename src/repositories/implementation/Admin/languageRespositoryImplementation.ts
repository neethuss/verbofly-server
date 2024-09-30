import { ILanguage, Language } from "../../../models/Admin/languageModel";
import LanguageRepository from "../../Admin/languageRepository";
import { Types } from "mongoose";

class LanguageRepositoryImplementation implements LanguageRepository{
  
  async createLanaguage(language: ILanguage): Promise<ILanguage> {
    console.log(language,'ell l undo')
    const newLanguage = await Language.create(language)
    console.log(newLanguage, 'nl')
    return newLanguage
  }

  async findBylanguageName(languageName: string): Promise<ILanguage | null> {
    const language = await Language.findOne({languageName})
    return language
  }

  async findAll(page: number, limit: number, search: string): Promise<{ languages: ILanguage[]; total: number; }> {
    const offset = (page-1) *limit
    const query = search ? {
      $or: [
        {
          languageName : {$regex :search, $options:'i'}
        }
      ]
    } : {}

    const languages = await Language.find(query).skip(offset).limit(limit).populate('countries').exec()
    const total = await Language.countDocuments(query)
    return {languages, total}
  }

  async findById(id: string) : Promise<ILanguage | null>{
    const language = await Language.findById(id).populate('countries')
    return language
  }

  async update(id: string, language: Partial<ILanguage>): Promise<ILanguage | null> {
    const updatedLanguage = await Language.findByIdAndUpdate(id, language,{new : true}).exec()
    return updatedLanguage
  }

  async getObjectIdArrayByNames(names: string[]): Promise<Types.ObjectId[]> {
    console.log('imp eth')
    const languages = await Language.find({ languageName: { $in: names } }).exec();
    const objectIds = languages.map(language => language._id as Types.ObjectId);
  
    
    console.log("Language ObjectIds:", objectIds);
  
    return objectIds;
  }

}

export default LanguageRepositoryImplementation