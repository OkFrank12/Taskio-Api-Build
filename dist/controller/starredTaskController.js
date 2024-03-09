"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewStarredTaskControl = exports.starredTaskControl = void 0;
const taskModel_1 = __importDefault(require("../model/taskModel"));
const authModel_1 = __importDefault(require("../model/authModel"));
const mongoose_1 = require("mongoose");
const starredTaskControl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, task_id } = req.params;
        const findTaskion = yield authModel_1.default.findById(_id);
        const findTask = yield taskModel_1.default.findById(task_id);
        if (!findTaskion && !findTask) {
            return res.status(404).json({
                message: "This User or Task you want to star, does not exist",
            });
        }
        else {
            if ((findTask === null || findTask === void 0 ? void 0 : findTask.starred) === false) {
                yield taskModel_1.default.findByIdAndUpdate(findTask === null || findTask === void 0 ? void 0 : findTask._id, {
                    starred: true,
                }, { new: true });
                findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.starredHistory.push(new mongoose_1.Types.ObjectId(findTask === null || findTask === void 0 ? void 0 : findTask._id));
                findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.save();
                return res.status(200).json({
                    message: "Task is starred",
                });
            }
            else {
                yield taskModel_1.default.findByIdAndUpdate(findTask === null || findTask === void 0 ? void 0 : findTask._id, {
                    starred: false,
                }, { new: true });
                findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.starredHistory.pull(new mongoose_1.Types.ObjectId(findTask === null || findTask === void 0 ? void 0 : findTask._id));
                findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.save();
                return res.status(200).json({
                    message: "Task is unstarred",
                });
            }
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.starredTaskControl = starredTaskControl;
const viewStarredTaskControl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const findTaskion = yield authModel_1.default.findById(_id).populate({
            path: "starredHistory",
            options: {
                sort: { createdAt: -1 },
            },
        });
        return res.status(200).json({
            message: `Taskion ${findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.userName}'s Starred Task`,
            data: findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.starredHistory,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.viewStarredTaskControl = viewStarredTaskControl;
