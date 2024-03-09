import { Router } from "express";
import {
  moveTaskToCompleted,
  viewCompletedTask,
} from "../controller/completeTaskController";

const completeTaskRoute: Router = Router();

completeTaskRoute.patch(
  `/:_id/:task_id/move-task-to-done`,
  moveTaskToCompleted
);
completeTaskRoute.get(`/:_id/view-completed-task`, viewCompletedTask);

export default completeTaskRoute;
