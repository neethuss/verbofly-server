import { ILanguage } from "../../models/Admin/languageModel";
import LanguageRepository from "../../repositories/Admin/languageRepository";
import { Types } from "mongoose";

class LanguageService{
  private languageRepository : LanguageRepository

  constructor(languageRepository : LanguageRepository){
    this.languageRepository = languageRepository
  }

  async createLanguage(language : ILanguage): Promise<ILanguage>{
    const newLanguage =await this.languageRepository.createLanaguage(language)
    return newLanguage
  }

  async findByLanguageName(languageName : string) : Promise<ILanguage | null>{
    const language = await this.languageRepository.findBylanguageName(languageName)
    return language
  }

  async findAll(page : number, limit: number, search : string) : Promise<{languages : ILanguage[], total : number}>{
    const result = await this.languageRepository.findAll(page, limit, search)
    return result
  }

  async findById(id: string): Promise<ILanguage | null>{
    const language = await this.languageRepository.findById(id)
    return language
  }

  async updateLanguagae(id : string, language : Partial<ILanguage>) : Promise<ILanguage | null>{
    const updatedLanguage = await this.languageRepository.update(id, language)
    return updatedLanguage
  }

  async getObjectIdArrayByNames(names: string[]): Promise<Types.ObjectId[]>{
    const languages = await this.languageRepository.getObjectIdArrayByNames(names)
    return languages
  }

}

export default LanguageService