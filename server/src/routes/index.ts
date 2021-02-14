/**
 * This folder contains the "routing" part of the express server
 * It associates each API endpoint to the corresponding controller
 */

import { Express } from "express";

import heartBeatRoute from "./hb";
import offerRoute from "./offer";
import userRoute from "./user";

export default (app: Express) => {
  app.use("/hb", heartBeatRoute);
  app.use("/offers", offerRoute);
  app.use("/users", userRoute);
};
