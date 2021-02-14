import { RequestHandler, Request, Response, NextFunction } from "express";

/**
 * A dummy request to check if the server is alive
 */
export const get: RequestHandler = async (
  params: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ status: "OK", data: {} });
};

export default { get };
