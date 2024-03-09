import { Document } from "mongoose";

interface iTask {
  title: string;
  description: string;
  targetDate: string;
  category: string;
  priority: string;
  status: string;
  taskionId: string;
  starred: boolean;
}

export interface iTaskData extends iTask, Document {}
