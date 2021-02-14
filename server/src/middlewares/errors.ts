import { Request, Response, NextFunction } from "express";
import { HTTPError, NotFoundError } from "../exception/http";
import { UnprocessableEntityError } from "../exception/http";
import winston from "winston";
import { LOG_LEVEL } from "../models/global_log";
import { setCurrentRequest, logException } from "../utils/logUtils";

type SQLError = {
  errno: number;
  sqlState: string;
  sqlMessage: string;
  code: string;
};

/**
 * A middleware that handles any uncaught exception
 * It will return the right HTTP status and a consistent JSON payload based on the exception
 */
export default (
  err: { [key: string]: any },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err = handleSQLErrors(err as SQLError, {
    ...req.body,
    ...req.query,
    ...req.params,
  });
  if (res.headersSent) return next(err);

  const defaultStatus = 500;
  let status = defaultStatus;
  let payload: any = {
    type: "Unknown",
    message: "Unknown error",
    ...(process.env.NODE_ENV !== "production" && { details: err }),
  };

  if (err.constructor.toString().includes("SyntaxError")) {
    payload.message = "Syntax error";
    payload.type = err.type;
    status = err.status;
  }

  if (err instanceof HTTPError) {
    payload.message = err.message;
    status = err.status;
    if (err.type) payload.type = err.type;
    if (err.details) payload.details = err.details;
  }

  const isInternalError = (status === defaultStatus);
  if (isInternalError) {
    winston.error(err);
    if (!payload.message) payload.message = "Internal Server Error";
  }
  setCurrentRequest(req);
  logException({
    err,
    level: isInternalError ? LOG_LEVEL.ERROR : LOG_LEVEL.INFO,
    category: isInternalError ? "InternalError":"BadRequest"
  });

  res.status(status).json({ error: payload });
};

function handleSQLErrors(err: SQLError, inputs: { [key: string]: any }) {
  switch (true) {
    case /ER_NO_REFERENCED_ROW/i.test(err.code):
      const [, foreignKey, entity] =
        err.sqlMessage.match(
          / FOREIGN KEY \(`([^`]+)`\) REFERENCES `([^`]+)`/
        ) || [];
      if (foreignKey && entity && inputs.hasOwnProperty(foreignKey)) {
        const id = inputs[foreignKey];
        return new NotFoundError(
          `Could not find entity '${entity}' with id: ${id}`,
          "EntityNotFound",
          { id, entity }
        );
      }
      return new UnprocessableEntityError(
        `Invalid foreign key constraint`,
        "FOREIGN_KEY_INVALID",
        err
      );
    case /ER_DUP_ENTRY/i.test(err.code):
      return new UnprocessableEntityError(err.sqlMessage, "DuplicateEntry");
    default:
      return err;
  }
}
