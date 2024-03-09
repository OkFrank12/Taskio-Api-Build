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
exports.deleteTrashedTask = exports.viewTrashedTask = exports.moveToAllTask = exports.moveTaskToTrash = exports.editTaskControl = exports.viewTaskionsTaskControl = exports.createTaskControl = void 0;
const taskModel_1 = __importDefault(require("../model/taskModel"));
const mongoose_1 = require("mongoose");
const authModel_1 = __importDefault(require("../model/authModel"));
const createTaskControl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const { title, description, targetDate, category, priority } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({
                message: "This user does not have a Taskion account",
            });
        }
        const findTaskion = yield authModel_1.default.findById(_id);
        if (!findTaskion) {
            return res.status(404).json({
                message: "This user is not a Taskion",
            });
        }
        else {
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    message: "Input your task details",
                });
            }
            else {
                const createTask = yield taskModel_1.default.create({
                    title,
                    description,
                    targetDate,
                    category,
                    priority,
                });
                findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.taskHistory.push(new mongoose_1.Types.ObjectId(createTask._id));
                findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.save();
                return res.status(201).json({
                    message: "Task Created Successfully",
                    data: createTask,
                });
            }
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.createTaskControl = createTaskControl;
const viewTaskionsTaskControl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({
                message: "This user does not have a Taskion account",
            });
        }
        const findTaskion = yield authModel_1.default.findById(_id).populate({
            path: "taskHistory",
            options: {
                sort: { createdAt: -1 },
            },
        });
        return res.status(200).json({
            message: `Taskion ${findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.userName}'s Task`,
            data: findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.taskHistory,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.viewTaskionsTaskControl = viewTaskionsTaskControl;
const editTaskControl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, task_id } = req.params;
        const { title, description, category, priority, targetDate } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({
                message: "This user does not have a Taskion account",
            });
        }
        if (!mongoose_1.Types.ObjectId.isValid(task_id)) {
            return res.status(404).json({
                message: "This task does not exit",
            });
        }
        const findTaskion = yield authModel_1.default.findById(_id);
        const findTask = yield taskModel_1.default.findById(task_id);
        if (!findTaskion && !findTask) {
            return res.status(404).json({
                message: "This User or Task you want to edit, does not exist",
            });
        }
        else {
            const editTask = yield taskModel_1.default.findByIdAndUpdate(task_id, {
                title,
                description,
                category,
                priority,
                targetDate,
            }, { new: true });
            return res.status(200).json({
                message: "Task Edited Successfully",
                data: editTask,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.editTaskControl = editTaskControl;
const moveTaskToTrash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, task_id } = req.params;
        const findTaskion = yield authModel_1.default.findById(_id);
        const findTask = yield taskModel_1.default.findById(task_id);
        if (!findTaskion && !findTask) {
            return res.status(404).json({
                message: "This User or Task you want to move to trash, does not exist",
            });
        }
        else {
            yield taskModel_1.default.findByIdAndUpdate(findTask === null || findTask === void 0 ? void 0 : findTask._id, {
                status: "Trash",
            }, { new: true });
            findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.trash.push(new mongoose_1.Types.ObjectId(findTask === null || findTask === void 0 ? void 0 : findTask._id));
            findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.progressHistory.pull(new mongoose_1.Types.ObjectId(findTask === null || findTask === void 0 ? void 0 : findTask._id));
            findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.save();
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield taskModel_1.default.findByIdAndDelete(task_id);
            }), 432000000);
            return res.status(200).json({
                message: "Moved To Trash",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.moveTaskToTrash = moveTaskToTrash;
const moveToAllTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, task_id } = req.params;
        const findTaskion = yield authModel_1.default.findById(_id);
        const findTask = yield taskModel_1.default.findById(task_id);
        if (!findTaskion && !findTask) {
            return res.status(404).json({
                message: "This User or Task you want to move to all task, does not exist",
            });
        }
        else {
            yield taskModel_1.default.findByIdAndUpdate(findTask === null || findTask === void 0 ? void 0 : findTask._id, {
                status: "Task",
            }, { new: true });
            findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.taskHistory.push(new mongoose_1.Types.ObjectId(findTask === null || findTask === void 0 ? void 0 : findTask._id));
            findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.progressHistory.pull(new mongoose_1.Types.ObjectId(findTask === null || findTask === void 0 ? void 0 : findTask._id));
            findTaskion.starredHistory.pull(new mongoose_1.Types.ObjectId(findTask === null || findTask === void 0 ? void 0 : findTask._id));
            findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.trash.pull(new mongoose_1.Types.ObjectId(findTask === null || findTask === void 0 ? void 0 : findTask._id));
            findTaskion.save();
            return res.status(200).json({
                message: "Moved To All Tasks",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.moveToAllTask = moveToAllTask;
const viewTrashedTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const findTaskion = yield authModel_1.default.findById(_id).populate({
            path: "trash",
            options: {
                sort: { createdAt: -1 },
            },
        });
        return res.status(200).json({
            message: `Taskion ${findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.userName}'s Trashed Task`,
            data: findTaskion === null || findTaskion === void 0 ? void 0 : findTaskion.trash,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.viewTrashedTask = viewTrashedTask;
const deleteTrashedTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, task_id } = req.params;
        const findTaskion = yield authModel_1.default.findById(_id);
        const findTask = yield taskModel_1.default.findById(task_id);
        if (!findTaskion && !findTask) {
            return res.status(404).json({
                message: "This User or Task you want to delete permanently, does not exist",
            });
        }
        else {
            yield taskModel_1.default.findByIdAndDelete(task_id);
            findTaskion.progressHistory.pull(new mongoose_1.Types.ObjectId(task_id));
            findTaskion.starredHistory.pull(new mongoose_1.Types.ObjectId(task_id));
            findTaskion.doneHistory.pull(new mongoose_1.Types.ObjectId(task_id));
            findTaskion.save();
            return res.status(200).json({
                message: "Task Deleted",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.deleteTrashedTask = deleteTrashedTask;
