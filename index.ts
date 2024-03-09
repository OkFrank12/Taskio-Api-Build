import express, { Application } from "express";
import { envExports } from "./environment/envExports";
import { dbConnection } from "./database/dbConnection";
import { appConnect } from "./appConnect";

const port: number = parseInt(envExports.PORT);
const app: Application = express();

appConnect(app);

const server = app.listen(envExports.PORT || port, () => {
  dbConnection();
});

process.on("uncaughtException", (error: any) => {
  console.log("uncaughtException: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  if (reason.message) {
    console.log("No Internet Connection");
  }

  server.close(() => {
    process.exit(1);
  });
});
