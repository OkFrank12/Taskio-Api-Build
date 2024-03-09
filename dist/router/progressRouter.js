"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progressController_1 = require("../controller/progressController");
const progressRoute = (0, express_1.Router)();
progressRoute.patch("/:_id/:task_id/move-task-to-progress", progressController_1.moveTaskToProgress);
progressRoute.get("/:_id/view-in-progress-task", progressController_1.viewTaskInProgress);
exports.default = progressRoute;
