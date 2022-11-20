export interface IUser {
  _id: string;
  email: string;
  name: string;
  status: boolean;
  registrationTime: string;
  selected?: boolean;
  lastOnline: string;
}
