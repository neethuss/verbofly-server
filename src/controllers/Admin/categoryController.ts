import CategoryService from "../../services/Admin/categoryService";
import { Request, Response } from "express";

class CategoryController {
  private categoryService: CategoryService

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService
  }

  async postCreateCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = req.body
      const categoryname = category.categoryName.toLowerCase().trim()
      const existingCategory = await this.categoryService.findByCategoryName(categoryname)
      if (existingCategory) {
        res.status(200).json({ message: "Category already exists" })
        return
      } else {
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

  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const { search = '', page = 1, limit = 10 } = req.query
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this.categoryService.findAll(pageNum, limitNum, search as string);
      res.status(200).json(result);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const category = await this.categoryService.findById(id)

      if (category) {
        res.status(200).json(category)
        return
      } else {
        res.status(404).json({ message: "Category not found" })
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

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { categoryName } = req.body
      const isCategory = await this.categoryService.findById(id)
      if (!isCategory) {
        res.status(404).json({ message: "Category not found" })
        return
      }
      let name = categoryName.toLowerCase().trim()
      const existingCategory = await this.categoryService.findByCategoryName(name)
      if (existingCategory && existingCategory._id != id) {
        res.status(409).json({ message: "Category already exists with this name" })
        return
      }
      const updatedCategory = await this.categoryService.updateCategory(id, { categoryName: name })
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
      const updatedCategory = await this.categoryService.updateCategory(id, { isBlocked: false })
      if (updatedCategory) {
        res.status(200).json(updatedCategory)
      } else {
        res.status(404).json({ message: 'Category not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }


  async blockCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updatedCategory = await this.categoryService.updateCategory(id, { isBlocked: true })
      if (updatedCategory) {
        res.status(200).json(updatedCategory)
      } else {
        res.status(404).json({ message: 'Category not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }

}

export default CategoryController