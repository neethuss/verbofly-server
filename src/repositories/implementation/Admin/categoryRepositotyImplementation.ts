import { ICategory } from "../../../models/Admin/categoryModel";
import { BaseRepositoryImplentation, paginate } from "../../implementation/Base/baseRepositoryImplementation";
import CategoryRepository from "../../Admin/categoryRepository";
import { Category } from "../../../models/Admin/categoryModel";

class CategoryRepositoryImplementation extends BaseRepositoryImplentation<ICategory> implements CategoryRepository {
  constructor() {
    super(Category);
  }

  // Create Category
  async createCategory(categoryName: string): Promise<ICategory> {
    return this.create({ categoryName });
  }

  // Find category by name
  async findByCategoryName(categoryName: string): Promise<ICategory | null> {
    return this.findOne({ categoryName });
  }

  async findAll(page: number, limit: number, search: string): Promise<{ categories: ICategory[]; total: number; }> {
    const filter = search ? {
      categoryName: { $regex: search, $options: 'i' }
    } : {};
    
    const result = await paginate<ICategory>(this, filter, page, limit);
    
    return {
      categories: result.data,
      total: result.total
    };
  }

  async findById(id: string): Promise<ICategory | null> {
    return super.findById(id);
  }

  async update(id: string, category: Partial<ICategory>): Promise<ICategory | null> {
    return super.update(id, category);
  }
}

export default CategoryRepositoryImplementation;
