import cors from "cors";
import { Application, NextFunction, Request, Response, json } from "express";
import authRoute from "./router/authRouter";
import taskRoute from "./router/taskRouter";
import progressRoute from "./router/progressRouter";
import completeTaskRoute from "./router/completeTaskRouter";
import starredRoute from "./router/starredRouter";

export const appConnect = async (app: Application) => {
  app
    .use(cors())
    .use(json())
    .set("view engine", "ejs")
    .use("/api/taskio", authRoute)
    .use(
      "/api/taskio/task",
      taskRoute,
      progressRoute,
      completeTaskRoute,
      starredRoute
    )
    .get("/", (req: Request, res: Response) => {
      try {
        return res.status(200).json({
          message: "TASKIO API is live🚀🚀🚀",
        });
      } catch (error: any) {
        return res.status(500).json({
          message: error.message,
        });
      }
    });
  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
      status: "fail",
      message: `Can't find ${req.originalUrl} on the server`,
    });
  });
};
