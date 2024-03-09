"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const completeTaskController_1 = require("../controller/completeTaskController");
const completeTaskRoute = (0, express_1.Router)();
completeTaskRoute.patch(`/:_id/:task_id/move-task-to-done`, completeTaskController_1.moveTaskToCompleted);
completeTaskRoute.get(`/:_id/view-completed-task`, completeTaskController_1.viewCompletedTask);
exports.default = completeTaskRoute;
