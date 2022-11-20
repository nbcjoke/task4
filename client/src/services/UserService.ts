import api from "../api/config";
import { AxiosResponse } from "axios";
import { IUser } from "../models/IUser";

export class UserService {
  static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return api.get<IUser[]>("/users");
  }

  static deleteUsers(ids: string[]): Promise<any> {
    return api.post<any>(`/user/delete`, { ids });
  }

  static updateStatus(ids: string[], status: boolean): Promise<any> {
    return api.put<any>(`/user/update`, { ids, status });
  }
}
