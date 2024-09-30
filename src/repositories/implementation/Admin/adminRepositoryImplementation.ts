import { IAdmin, Admin } from "../../../models/Admin/adminModel";
import AdminRepository from "../../Admin/adminRepository";

class AdminRepositoryImplementation implements AdminRepository{

  async findByEmail(email: string): Promise<IAdmin | null> {
    const admin = await Admin.findOne({email}).exec()
    return admin
  }

}

export default AdminRepositoryImplementation