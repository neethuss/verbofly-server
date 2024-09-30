import { IAdmin } from "../../models/Admin/adminModel";

interface AdminRepository{
  findByEmail(email : string) : Promise<IAdmin | null>;
}

export default AdminRepository