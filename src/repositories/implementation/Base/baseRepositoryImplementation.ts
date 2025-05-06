import {Document, FilterQuery, Model, UpdateQuery } from "mongoose";
import { BaseRepository } from "../../Base/baseRepository";

export class BaseRepositoryImplentation<T extends Document> implements BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    return this.model.create(item);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async find(filter: FilterQuery<T> = {}, options: { 
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
    populate?: string | string[];
  } = {}): Promise<T[]> {
    let query = this.model.find(filter);
    
    if (options.skip !== undefined) {
      query = query.skip(options.skip);
    }
    
    if (options.limit !== undefined) {
      query = query.limit(options.limit);
    }
    
    if (options.sort) {
      query = query.sort(options.sort);
    }
    
    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach(path => {
          query = query.populate(path);
        });
      } else {
        query = query.populate(options.populate);
      }
    }
    
    return query.exec();
  }

  async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}

// Helper function for pagination
export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function paginate<T extends Document>(
  repository: BaseRepository<T>,
  filter: FilterQuery<T>,
  page: number = 1,
  limit: number = 10,
  options: {
    sort?: Record<string, 1 | -1>;
    populate?: string | string[];
  } = {}
): Promise<PaginationResult<T>> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    repository.find(filter, { skip, limit, ...options }),
    repository.count(filter)
  ]);
  
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1
  };
}