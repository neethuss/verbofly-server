import { Types } from "mongoose";
import { ILesson, Lesson } from "../../../models/Admin/lessonModel";
import { BaseRepositoryImplentation } from "../Base/baseRepositoryImplementation";
import LessonRepository from "../../Admin/lessonRespository";

class LessonRepositoryImplementation
  extends BaseRepositoryImplentation<ILesson>
  implements LessonRepository {

  constructor() {
    super(Lesson); 
  }

  async createLesson(lesson: ILesson): Promise<ILesson> {
    return this.create(lesson);
  }

  async findByTitle(title: string): Promise<ILesson | null> {
    return this.findOne({ title });
  }

  async findAll(page: number, limit: number, search: string): Promise<{ lessons: ILesson[]; total: number }> {
    const filter = search
      ? {
          $or: [{ title: { $regex: search, $options: "i" } }],
        }
      : {};

    const lessons = await this.find(filter, {
      sort: ({ createdAt: -1 }),
      skip: (page - 1) * limit,
      limit,
      populate: ["languageName", "categoryName"],
    });

    const total = await this.count(filter);

    return { lessons, total };
    
  }

  async findByLanguageAndCategory(languageName: Types.ObjectId, categoryName: Types.ObjectId): Promise<ILesson[]> {
    return this.find({ languageName, categoryName });
  }

  async findById(id: string): Promise<ILesson | null> {
    const lesson = await super.findById(id);
    if (!lesson) return null;
  
    await lesson.populate("languageName");
    await lesson.populate("categoryName");
  
    return lesson;
  }
  

  async findLessonsByLanguageId(languageId: string): Promise<ILesson[]> {
    return this.find({ languageName: languageId });
  }

  async update(id: string, lesson: Partial<ILesson>): Promise<ILesson | null> {
    return super.update(id, lesson);
  }
}

export default LessonRepositoryImplementation;
