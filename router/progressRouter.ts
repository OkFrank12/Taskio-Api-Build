import { Router } from "express";
import {
  moveTaskToProgress,
  viewTaskInProgress,
} from "../controller/progressController";

const progressRoute: Router = Router();

progressRoute.patch("/:_id/:task_id/move-task-to-progress", moveTaskToProgress);
progressRoute.get("/:_id/view-in-progress-task", viewTaskInProgress);

export default progressRoute;
