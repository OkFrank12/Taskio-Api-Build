"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const authModel = new mongoose_1.Schema({
    userName: {
        type: String,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    token: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    taskHistory: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "task-history",
        },
    ],
    progressHistory: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "task-history",
        },
    ],
    doneHistory: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "task-history",
        },
    ],
    trash: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "task-history",
        },
    ],
    starredHistory: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "task-history",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("taskio-auth", authModel);
