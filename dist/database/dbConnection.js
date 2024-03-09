"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const mongoose_1 = require("mongoose");
const envExports_1 = require("../environment/envExports");
const dbURI = envExports_1.envExports.MONGODB_URI;
const dbConnection = () => {
    (0, mongoose_1.connect)(dbURI).then(() => {
        console.log("Database and Server is live");
    });
};
exports.dbConnection = dbConnection;
