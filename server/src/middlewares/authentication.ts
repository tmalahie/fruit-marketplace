import { HTTPError } from "../exception/http";
import tryCatchHandler from "./trycatch";
import jwt from "jsonwebtoken"
import config from "../utils/config"
const authConfig = config.authentication;

/**
 * A middleware that handles authentication, for now it's just a dummy function, waiting for authent project to finish
 */
export default tryCatchHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const user = jwt.verify(token, authConfig.secret);
      if (user)
        req["user"] = user["data"];
    }
    catch (e) {
      console.error(e);
    }
  }
  next();
});
