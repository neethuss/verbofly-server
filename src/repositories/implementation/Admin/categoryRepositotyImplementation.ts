import { ICategory, Category } from "../../../models/Admin/categoryModel";
import { ICountry } from "../../../models/Admin/countryModel";
import CategoryRepository from "../../Admin/categoryRepository";

class CategoryRepositoryImplementation implements CategoryRepository {
  async createCategory(categoryName: string): Promise<ICategory> {
    const newCategory = await Category.create({ categoryName })
    return newCategory
  }

  async findByCategoryName(categoryName: string): Promise<ICategory | null> {
    const category = await Category.findOne({ categoryName })
    return category
  }

  async findAll(page: number, limit: number, search: string): Promise<{ categories: ICategory[]; total: number; }> {
    const offset = (page - 1) * limit
    const query = search ? {
      $or: [{ categoryName: { $regex: search, $options: 'i' } }]
    } : {}
    const categories = await Category.find(query).skip(offset).limit(limit).exec()
    const total = await Category.countDocuments(query)
    return { categories, total }
  }

  async findById(id: string): Promise<ICategory | null> {
    const category = await Category.findById(id)
    return category
  }

  async update(id: string, category: Partial<ICategory>): Promise<ICategory | null> {
    const updatedCategory = await Category.findByIdAndUpdate(id, category, { new: true }).exec()
    console.log(updatedCategory, 'puthiyath')
    return updatedCategory
  }

}

export default CategoryRepositoryImplementation