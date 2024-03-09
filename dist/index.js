"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const envExports_1 = require("./environment/envExports");
const dbConnection_1 = require("./database/dbConnection");
const appConnect_1 = require("./appConnect");
const port = parseInt(envExports_1.envExports.PORT);
const app = (0, express_1.default)();
(0, appConnect_1.appConnect)(app);
const server = app.listen(envExports_1.envExports.PORT || port, () => {
    (0, dbConnection_1.dbConnection)();
});
process.on("uncaughtException", (error) => {
    console.log("uncaughtException: ", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    if (reason.message) {
        console.log("No Internet Connection");
    }
    server.close(() => {
        process.exit(1);
    });
});
