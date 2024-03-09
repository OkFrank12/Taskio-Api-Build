import { Schema, Types, model } from "mongoose";
import { iTaskData } from "../interface/taskInterface";

const taskModel = new Schema<iTaskData>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetDate: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Task",
    },
    starred: {
      type: Boolean,
      default: false,
    },
    taskionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model<iTaskData>("task-history", taskModel);
