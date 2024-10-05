import CategoryService from "../../services/Admin/categoryService";
import { Request, Response } from "express";

class CategoryController{
  private categoryService : CategoryService

  constructor(categoryService : CategoryService){
    this.categoryService = categoryService
  }

  async postCreateCategory(req : Request, res: Response): Promise<void>{
    try {
      console.log('controller ethi')
      const category = req.body
      const categoryname = category.categoryName.toLowerCase().trim()
      console.log(categoryname,'categoryname')
      const existingCategory = await this.categoryService.findByCategoryName(categoryname)
      if(existingCategory){
        res.status(200).json({message : "Category already exists"})
        return
      }else{
        console.log('else')
        const newCategory = await this.categoryService.createCategory(categoryname)
        res.status(201).json(newCategory)
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getCategories(req:Request, res:Response) : Promise<void>{
    try {
      console.log('categories backend')
      const {search='', page=1, limit=10} = req.query
      console.log(req.query,'back')
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this.categoryService.findAll(pageNum, limitNum, search as string);
      console.log(result,'categories result')
      res.status(200).json(result);
    } catch (error) {
      console.log(error,'errr')
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getCategory(req:Request, res : Response): Promise<void>{
    try {
      console.log('category')
      const {id} = req.params
      console.log(id,'kd')
      const category = await this.categoryService.findById(id)
      
      if(category){
        console.log(category,'dk')
        res.status(200).json(category)
     return
      }else{
        console.log('category illa')
        res.status(404).json({message : "Category not found"})
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

  async updateCategory(req:Request, res:Response) : Promise<void>{
    try {
      console.log('category update backend')
      const {id} = req.params
      const {categoryName} = req.body
      console.log(id, categoryName,'cate update')
      const isCategory = await this.categoryService.findById(id)
      if(!isCategory){
        res.status(404).json({message : "Category not found"})
        return
      }
      let name = categoryName.toLowerCase().trim()
      const existingCategory = await this.categoryService.findByCategoryName(name)
      if(existingCategory &&  existingCategory._id != id){
        res.status(409).json({message : "Category already exists with this name"})
        return
      }
      const updatedCategory = await this.categoryService.updateCategory(id, {categoryName:name})
      res.status(200).json(updatedCategory)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async unblockCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      console.log('unblocking')
      const updatedCategory = await this.categoryService.updateCategory(id, { isBlocked: false })
      if (updatedCategory) {
        console.log(updatedCategory, 'update aayi')
        res.status(200).json(updatedCategory)
      } else {
        console.log('Category kaanan illa')
        res.status(404).json({ message: 'Category not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }


  async blockCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      console.log('blocking')
      const updatedCategory = await this.categoryService.updateCategory(id, { isBlocked: true })
      if (updatedCategory) {
        console.log(updatedCategory, 'update aayi')
        res.status(200).json(updatedCategory)
      } else {
        console.log('Category kaanan illa')
        res.status(404).json({ message: 'Category not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }

}

export default CategoryController