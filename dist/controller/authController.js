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
exports.viewAllTaskioAccount = exports.viewOneTaskioAccount = exports.signIntoTaskioAccount = exports.verifyTaskioAccount = exports.createTaskioAccount = void 0;
const authModel_1 = __importDefault(require("../model/authModel"));
const bcrypt_1 = require("bcrypt");
const transporter_1 = require("../email/transporter");
const jsonwebtoken_1 = require("jsonwebtoken");
const envExports_1 = require("../environment/envExports");
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const createTaskioAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        const salting = yield (0, bcrypt_1.genSalt)(10);
        const hashing = yield (0, bcrypt_1.hash)(password, salting);
        const generateToken = crypto_1.default.randomBytes(16).toString("hex");
        const auth = yield authModel_1.default.findOne({ email });
        if (auth)
            return res.status(409).json({
                message: "Taskion Account Already Exists",
            });
        const createAccount = yield authModel_1.default.create({
            firstName,
            lastName,
            userName: firstName + " " + lastName,
            email,
            password: hashing,
            token: generateToken,
        });
        (0, transporter_1.sendVerificationMail)(createAccount).then(() => {
            console.log("Mail has been sent");
        });
        return res.status(201).json({
            message: "Registered Successfully",
            data: createAccount,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.createTaskioAccount = createTaskioAccount;
const verifyTaskioAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const getAuthID = (0, jsonwebtoken_1.verify)(token, envExports_1.envExports.TOKEN_SECRET, (err, payload) => {
            if (err) {
                throw new Error();
            }
            else {
                return payload;
            }
        });
        yield authModel_1.default.findByIdAndUpdate(getAuthID.id, { verified: true, token: "" }, { new: true });
        return res.status(200).json({
            message: "Verification Successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.verifyTaskioAccount = verifyTaskioAccount;
const signIntoTaskioAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const auth = yield authModel_1.default.findOne({ email });
        if (auth) {
            const PasswordValid = yield (0, bcrypt_1.compare)(password, auth.password);
            if (PasswordValid) {
                if (auth.verified && auth.token === "") {
                    const token = (0, jsonwebtoken_1.sign)({ id: auth.id }, envExports_1.envExports.TOKEN_SECRET);
                    return res.status(201).json({
                        message: `Welcome Back Taskion`,
                        data: token,
                    });
                }
                else {
                    return res.status(403).json({
                        message: "You are not verified",
                    });
                }
            }
            else {
                return res.status(401).json({
                    message: "Your Password is incorrect",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Taskio Account Not Found",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.signIntoTaskioAccount = signIntoTaskioAccount;
const viewOneTaskioAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({
                message: "This user is not a Taskion",
            });
        }
        const auth = yield authModel_1.default.findById(_id);
        if (!auth) {
            return res.status(404).json({
                message: "This user is not a Taskion",
            });
        }
        return res.status(200).json({
            message: "Taskion Found",
            data: auth,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.viewOneTaskioAccount = viewOneTaskioAccount;
const viewAllTaskioAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = yield authModel_1.default.find();
        return res.status(200).json({
            message: `All Taskion: ${auth.length}`,
            data: auth,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});
exports.viewAllTaskioAccount = viewAllTaskioAccount;
