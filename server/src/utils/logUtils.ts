import winston from "winston";
import { GlobalLogModel, LOG_LEVEL } from "../models/global_log";

let req;

export function setCurrentRequest(r) {
  req = r;
}

export function logException({
  err,
  category = "UnknownError",
  level = LOG_LEVEL.WARNING,
  message = null
}) {
  if (!message)
    message = (err.message+"");
  if (!req)
    req = {};
  return GlobalLogModel.insert({
    request_method: req.method,
    request_uri: req.url,
    request_body: req.body,
    level,
    category,
    message,
    stack_trace: err && (err.stack+"")
  }).catch(winston.error);
}