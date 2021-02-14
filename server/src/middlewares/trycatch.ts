import { Request, Response, NextFunction } from "express";

/**
 * A function to catch all exceptions in controllers
 */
export default function tryCatchHandler(controller) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
