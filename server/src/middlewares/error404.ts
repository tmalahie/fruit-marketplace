import { RequestHandler } from "express";
import { NotFoundError } from "../exception/http";

const error: RequestHandler = (_req, _res, _next) => {
  throw new NotFoundError(
    `This API endpoint does not exist: ${
      _req.method
    } ${_req.originalUrl.replace("/undefined", "")}`
  );
};

export default error;
