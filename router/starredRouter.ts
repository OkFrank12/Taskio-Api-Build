import { Router } from "express";
import {
  starredTaskControl,
  viewStarredTaskControl,
} from "../controller/starredTaskController";

const starredRoute: Router = Router();

starredRoute.patch("/:_id/:task_id/starred-task", starredTaskControl);
starredRoute.get("/:_id/view-starred-task", viewStarredTaskControl);

export default starredRoute;
