import { connect } from "mongoose";
import { envExports } from "../environment/envExports";

const dbURI: string = envExports.MONGODB_URI;

export const dbConnection = () => {
  connect(dbURI).then(() => {
    console.log("Database and Server is live");
  });
};
