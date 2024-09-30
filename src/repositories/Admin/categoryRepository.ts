import { ICategory } from "../../models/Admin/categoryModel";
import { ICountry } from "../../models/Admin/countryModel";

interface CategoryRepository{
  createCategory(categoryName:string) : Promise<ICategory>
  findByCategoryName(categoryName : string) : Promise<ICategory | null>
  findAll(page : number, limit : number, search : string) : Promise<{categories : ICategory[], total : number}>
  findById(id : string) : Promise<ICategory | null>
  update(id: string, category : Partial<ICategory>) : Promise<ICategory | null>
}

export default CategoryRepository