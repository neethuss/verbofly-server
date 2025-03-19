import LanguageService from "../../services/Admin/languageService";
import { Request, Response } from "express";
import { Types } from "mongoose";

class LanguageController{

  private languageServie : LanguageService

  constructor(languageService : LanguageService){
    this.languageServie = languageService
  }

  async postLanguage(req : Request, res : Response) : Promise<void>{
    try {
      const language = req.body
      const languageName = language.languageName.toLowerCase().trim()
      const existingLanguage = await this.languageServie.findByLanguageName(languageName)
      if(existingLanguage){
        res.status(200).json({message : "Language already exists"})
      }else{
        const newLanguage = await this.languageServie.createLanguage(language)
        console.log(newLanguage,'new l')
        res.status(201).json(newLanguage)
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getLanguages(req:Request, res:Response) : Promise<void>{
    try {
      console.log('lages')
      const {search='', page=1, limit=10} = req.query
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this.languageServie.findAll(pageNum, limitNum, search as string);
      console.log(result)
      res.status(200).json(result);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async updateLanguage(req:Request, res:Response) : Promise<void>{
    try {
      const { id } = req.params;
      const { languageName, countries } = req.body;
      const languagename = languageName.toLowerCase().trim()
      const existingLanguage = await this.languageServie.findById(id);
      if (!existingLanguage) {
        res.status(404).json({ message: "Language not found" });
        return;
      }
      const duplicateLanguage = await this.languageServie.findByLanguageName(languagename);
      if (duplicateLanguage && duplicateLanguage._id != id) {
        res.status(409).json({ message: "Language already exists with this name" });
        return;
      }
      const updatedLanguage = await this.languageServie.updateLanguagae(id, { languageName:languagename, countries });
      if (!updatedLanguage) {
        res.status(500).json({ message: "Failed to update language" });
        return;
      }

      res.status(200).json(updatedLanguage);
      
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getLanguage(req:Request, res: Response) : Promise<void>{
    const {id} = req.params
    try {
      console.log(id,'back')
      const language = await this.languageServie.findById(id)
      res.status(200).send(language)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }


  async unblockLanguage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      console.log('unblocking')
      const updatedLanguage = await this.languageServie.updateLanguagae(id, { isBlocked: false })
      if (updatedLanguage) {
        console.log(updatedLanguage, 'update aayi')
        res.status(200).json(updatedLanguage)
      } else {
        console.log('Language kaanan illa')
        res.status(404).json({ message: 'Language not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }


  async blockLanguage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      console.log('blocking')
      const updatedLanguage = await this.languageServie.updateLanguagae(id, { isBlocked: true })
      if (updatedLanguage) {
        console.log(updatedLanguage, 'update aayi')
        res.status(200).json(updatedLanguage)
      } else {
        console.log('Language kaanan illa')
        res.status(404).json({ message: 'Language not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }

  async getLangugage(req : Request , res:Response) : Promise<void>{
    try {
      console.log('start language lesson backend')
      const {id} = req.params
      console.log(id,'language id')
      const language = await this.languageServie.findById(id)
      console.log(language,'language ')
      res.status(200).json(language)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  


}

export default LanguageController