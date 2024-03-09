import { Request, Response, response } from "express";
import authModel from "../model/authModel";
import { compare, genSalt, hash } from "bcrypt";
import { sendVerificationMail } from "../email/transporter";
import { sign, verify } from "jsonwebtoken";
import { envExports } from "../environment/envExports";
import crypto from "crypto";
import { Types } from "mongoose";

export const createTaskioAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const salting = await genSalt(10);
    const hashing = await hash(password, salting);
    const generateToken = crypto.randomBytes(16).toString("hex");

    const auth = await authModel.findOne({ email });
    if (auth)
      return res.status(409).json({
        message: "Taskion Account Already Exists",
      });

    const createAccount = await authModel.create({
      firstName,
      lastName,
      userName: firstName + " " + lastName,
      email,
      password: hashing,
      token: generateToken,
    });

    sendVerificationMail(createAccount).then(() => {
      console.log("Mail has been sent");
    });

    return res.status(201).json({
      message: "Registered Successfully",
      data: createAccount,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyTaskioAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.params;

    const getAuthID: any = verify(
      token,
      envExports.TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          throw new Error();
        } else {
          return payload;
        }
      }
    );

    await authModel.findByIdAndUpdate(
      getAuthID.id,
      { verified: true, token: "" },
      { new: true }
    );

    return res.status(200).json({
      message: "Verification Successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signIntoTaskioAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const auth = await authModel.findOne({ email });
    if (auth) {
      const PasswordValid = await compare(password, auth.password);
      if (PasswordValid) {
        if (auth.verified && auth.token === "") {
          const token = sign({ id: auth.id }, envExports.TOKEN_SECRET);
          return res.status(201).json({
            message: `Welcome Back Taskion`,
            data: token,
          });
        } else {
          return res.status(403).json({
            message: "You are not verified",
          });
        }
      } else {
        return res.status(401).json({
          message: "Your Password is incorrect",
        });
      }
    } else {
      return res.status(404).json({
        message: "Taskio Account Not Found",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewOneTaskioAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.params;

    if (!Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        message: "This user is not a Taskion",
      });
    }
    const auth = await authModel.findById(_id);

    if (!auth) {
      return res.status(404).json({
        message: "This user is not a Taskion",
      });
    }

    return res.status(200).json({
      message: "Taskion Found",
      data: auth,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewAllTaskioAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const auth = await authModel.find();

    return res.status(200).json({
      message: `All Taskion: ${auth.length}`,
      data: auth,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
