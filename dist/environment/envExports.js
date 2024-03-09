"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envExports = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.envExports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL: process.env.EMAIL,
};
