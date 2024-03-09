import { Router } from "express";
import {
  createTaskioAccount,
  signIntoTaskioAccount,
  verifyTaskioAccount,
  viewAllTaskioAccount,
  viewOneTaskioAccount,
} from "../controller/authController";

const authRoute: Router = Router();

authRoute.post("/create-account", createTaskioAccount);
authRoute.get("/:token/verify-account", verifyTaskioAccount);
authRoute.post("/sign-in-account", signIntoTaskioAccount);
authRoute.get("/:_id/view-one-taskio-account", viewOneTaskioAccount);
authRoute.get("/view-all-account", viewAllTaskioAccount);

export default authRoute;
