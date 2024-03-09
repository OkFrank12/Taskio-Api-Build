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
exports.viewTaskInProgress = exports.moveTaskToProgress = void 0;
const mongoose_1 = require("mongoose");
const authModel_1 = __importDefault(require("../model/authModel"));
const taskModel_1 = __importDefault(require("../model/taskModel"));
const moveTaskToProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, task_id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({
                message: "This user does not have a Taskion account",
            });
        }
        if (!mongoose_1.Types.ObjectId.isValid(task_id)) {
            return res.status(404).json({
                message: "This task does not exist",
            });
        }
        const findTaskion = yield authModel_1.default.findById(_id);
        const findTask = yield taskModel_1.default.findById(task_id);
        if (findTask && findTaskion) {
            yield taskModel_1.default.findByIdAndUpdate(findTask._id, {
                status: "InProgress",
            }, { new: true });
            findTaskion.progressHistory.push(new mongoose_1.Types.ObjectId(task_id));
            findTaskion.doneHistory.pull(new mongoose_1.Types.ObjectId(task_id));
            findTaskion.save();
            return res.status(200).json({
                message: "Moved To Progress",
            });
        }
        else {
            return res.status(404).json({
                message: "This User or Task you want to move to progress, does not exist",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.moveTaskToProgress = moveTaskToProgress;
const viewTaskInProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({
                message: "This user does not have a Taskion account",
            });
        }
        const findTaskion = yield authModel_1.default.findById(_id).populate({
            path: "progressHistory",
            options: {
                sort: { createdAt: -1 },
            },
        });
        return res.status(200).json({
            message: `Taskion ${findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.userName}'s Task in Progress`,
            data: findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.progressHistory,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.viewTaskInProgress = viewTaskInProgress;
