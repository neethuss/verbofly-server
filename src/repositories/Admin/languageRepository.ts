import { Types } from "mongoose";
import { ILanguage } from "../../models/Admin/languageModel";

interface LanguageRepository{
  createLanaguage(language : ILanguage) : Promise<ILanguage>
  findBylanguageName(languageName : string) : Promise<ILanguage | null>
  findAll(page : number, limit: number, search : string) : Promise<{languages : ILanguage[], total : number}>
  findById(id: string) : Promise<ILanguage  | null>
  update(id:string, language:Partial<ILanguage>) : Promise<ILanguage | null>
  getObjectIdArrayByNames(names: string[]): Promise<Types.ObjectId[]>
}

export default LanguageRepository