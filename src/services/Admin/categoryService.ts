import { ICategory } from "../../models/Admin/categoryModel";
import CategoryRepository from "../../repositories/Admin/categoryRepository";

class CategoryService{
  private categoryRepository : CategoryRepository

  constructor(categoryRepository : CategoryRepository){
    this.categoryRepository = categoryRepository
  }

  async createCategory(categoryName:string) : Promise<ICategory>{
    const newCategory = await this.categoryRepository.createCategory(categoryName)
    return newCategory
  }

  async findByCategoryName(categoryName : string) : Promise<ICategory| null>{
    const category = await this.categoryRepository.findByCategoryName(categoryName)
    return category
  }

  async findAll(page:number, limit:number, search:string) : Promise<{categories : ICategory[], total: number}>{
    const result = await this.categoryRepository.findAll(page, limit, search)
    return result
  }

  async findById(id: string) : Promise<ICategory | null>{
    const category = await this.categoryRepository.findById(id)
    return category
  }

  async updateCategory(id : string, category : Partial<ICategory>) : Promise<ICategory | null>{
    const updatedCategory = await this.categoryRepository.update(id, category)
    return updatedCategory
  }
}

export default CategoryService