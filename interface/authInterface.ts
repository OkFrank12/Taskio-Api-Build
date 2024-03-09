import { Document } from "mongoose";

interface iAuth {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  token: string;
  verified: boolean;
  taskHistory: {}[];
  progressHistory: {}[];
  doneHistory: {}[];
  trash: {}[];
  starredHistory: {}[];
}

export interface iAuthData extends iAuth, Document {}
