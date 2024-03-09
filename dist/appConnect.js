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
exports.appConnect = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./router/authRouter"));
const taskRouter_1 = __importDefault(require("./router/taskRouter"));
const progressRouter_1 = __importDefault(require("./router/progressRouter"));
const completeTaskRouter_1 = __importDefault(require("./router/completeTaskRouter"));
const starredRouter_1 = __importDefault(require("./router/starredRouter"));
const appConnect = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app
        .use((0, cors_1.default)())
        .use((0, express_1.json)())
        .set("view engine", "ejs")
        .use("/api/taskio", authRouter_1.default)
        .use("/api/taskio/task", taskRouter_1.default, progressRouter_1.default, completeTaskRouter_1.default, starredRouter_1.default)
        .get("/", (req, res) => {
        try {
            return res.status(200).json({
                message: "TASKIO API is live🚀🚀🚀",
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    });
    app.all("*", (req, res, next) => {
        return res.status(404).json({
            status: "fail",
            message: `Can't find ${req.originalUrl} on the server`,
        });
    });
});
exports.appConnect = appConnect;
