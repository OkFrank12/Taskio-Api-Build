import { Router } from "express";
import {
  createTaskControl,
  deleteTrashedTask,
  editTaskControl,
  moveTaskToTrash,
  moveToAllTask,
  viewTaskionsTaskControl,
  viewTrashedTask,
} from "../controller/taskController";

const taskRoute: Router = Router();

taskRoute.post("/:_id/create-your-task", createTaskControl);
taskRoute.patch("/:_id/:task_id/edit-your-task", editTaskControl);
taskRoute.patch("/:_id/:task_id/move-to-trash", moveTaskToTrash);
taskRoute.get("/:_id/view-your-task", viewTaskionsTaskControl);
taskRoute.patch("/:_id/:task_id/move-to-all-task", moveToAllTask);
taskRoute.get(`/:_id/view-trashed-task`, viewTrashedTask);
taskRoute.delete("/:_id/:task_id/delete-trashed-task", deleteTrashedTask);

export default taskRoute;
