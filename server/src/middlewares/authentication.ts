import { HTTPError } from "../exception/http";
import tryCatchHandler from "./trycatch";

/**
 * A middleware that handles authentication, for now it's just a dummy function, waiting for authent project to finish
 */
export default tryCatchHandler(async (req, res, next) => {
  next();
});
