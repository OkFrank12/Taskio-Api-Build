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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationMail = void 0;
const nodemailer_1 = require("nodemailer");
const path_1 = require("path");
const envExports_1 = require("../environment/envExports");
const jsonwebtoken_1 = require("jsonwebtoken");
const ejs_1 = require("ejs");
const sendVerificationMail = (auth) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = (0, nodemailer_1.createTransport)({
            service: "gmail",
            auth: {
                user: envExports_1.envExports.EMAIL,
                pass: envExports_1.envExports.EMAIL_PASS,
            },
        });
        const token = (0, jsonwebtoken_1.sign)({ id: auth._id }, envExports_1.envExports.TOKEN_SECRET);
        const mailOptions = {
            userName: auth.userName,
            email: auth.email,
            verifyLink: `http://localhost:5173/${token}/verify-account`,
        };
        const locateEjsFile = (0, path_1.join)(__dirname, "../views/verifyEJS.ejs");
        const htmlToSend = yield (0, ejs_1.renderFile)(locateEjsFile, mailOptions);
        const mailer = {
            from: "Taskio App <cfoonyemmemme@gmail.com>",
            to: auth.email,
            subject: "Verify Your Taskio Account - Complete Registration Now!",
            html: htmlToSend,
        };
        transporter.sendMail(mailer);
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendVerificationMail = sendVerificationMail;
