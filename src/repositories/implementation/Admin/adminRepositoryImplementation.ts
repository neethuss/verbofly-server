import { IAdmin, Admin } from "../../../models/Admin/adminModel";
import { BaseRepositoryImplentation } from '../../implementation/Base/baseRepositoryImplementation'
import AdminRepository from "../../Admin/adminRepository";

class AdminRepositoryImplementation extends BaseRepositoryImplentation<IAdmin> implements AdminRepository {

  constructor() {
    super(Admin); 
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.model.findOne({ email }).exec(); 
  }
}

export default AdminRepositoryImplementation;
