import { Document, FilterQuery, UpdateQuery} from 'mongoose'

//generic interface for base repository
export interface BaseRepository<T extends Document> {//T extends Document=>ensures T is a Mongoose document
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  find(filter: FilterQuery<T>, options?: { 
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
    populate?: string | string[];
  }): Promise<T[]>;
  update(id: string, item: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filter: FilterQuery<T>): Promise<number>;
}