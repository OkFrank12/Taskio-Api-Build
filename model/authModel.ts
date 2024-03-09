import { Schema, Types, model } from "mongoose";
import { iAuthData } from "../interface/authInterface";

const authModel = new Schema<iAuthData>(
  {
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
        type: Types.ObjectId,
        ref: "task-history",
      },
    ],
    progressHistory: [
      {
        type: Types.ObjectId,
        ref: "task-history",
      },
    ],
    doneHistory: [
      {
        type: Types.ObjectId,
        ref: "task-history",
      },
    ],
    trash: [
      {
        type: Types.ObjectId,
        ref: "task-history",
      },
    ],
    starredHistory: [
      {
        type: Types.ObjectId,
        ref: "task-history",
      },
    ],
  },
  { timestamps: true }
);

export default model<iAuthData>("taskio-auth", authModel);
