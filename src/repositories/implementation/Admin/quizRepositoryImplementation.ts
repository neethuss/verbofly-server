import { Types } from "mongoose";
import { IQuiz, Quiz } from "../../../models/Admin/quizModel";
import { BaseRepositoryImplentation, paginate } from "../Base/baseRepositoryImplementation";
import QuizRepository from "../../Admin/quizRepository";

class QuizRepositoryImplementation
  extends BaseRepositoryImplentation<IQuiz>
  implements QuizRepository {

  constructor() {
    super(Quiz); 
  }

  async createQuiz(quiz: IQuiz): Promise<IQuiz> {
    return this.create(quiz);
  }

  async findByName(name: string): Promise<IQuiz | null> {
    return this.findOne({ name });
  }

  async findAll(
    page: number,
    limit: number,
    search: string
  ): Promise<{ quizzes: IQuiz[]; total: number }> {
    const filter = search
      ? { $or: [{ title: { $regex: search, $options: "i" } }] }
      : {};

    const result = await paginate<IQuiz>(this, filter, page, limit, {
      populate: ["languageName", "categoryName"]
    });

    return {
      quizzes: result.data,
      total: result.total
    };
  }

  async findByLanguageAndCategory(
    languageName: Types.ObjectId,
    categoryName: Types.ObjectId
  ): Promise<IQuiz | null> {
    return this.findOne({ languageName, categoryName });
  }

  async findById(id: string): Promise<IQuiz | null> {
    return this.model.findById(id).populate('languageName').populate('categoryName').exec();
  }

  async update(id: string, quiz: Partial<IQuiz>): Promise<IQuiz | null> {
    return super.update(id, quiz);
  }
}

export default QuizRepositoryImplementation;
