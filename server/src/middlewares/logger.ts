import { setCurrentRequest } from "../utils/logUtils";

/**
 * A middleware that store current request to log it in case of exception
 */
export default (req, res, next) => {
  setCurrentRequest(req);
  next();
};
