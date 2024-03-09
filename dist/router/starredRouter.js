"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const starredTaskController_1 = require("../controller/starredTaskController");
const starredRoute = (0, express_1.Router)();
starredRoute.patch("/:_id/:task_id/starred-task", starredTaskController_1.starredTaskControl);
starredRoute.get("/:_id/view-starred-task", starredTaskController_1.viewStarredTaskControl);
exports.default = starredRoute;
