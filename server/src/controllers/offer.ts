import { RequestHandler, Request, Response, NextFunction } from "express";
import {
  OfferModel as Model,
  getEntityFromInputs,
  OfferModel,
} from "../models/offer";
import ResponseUtils from "../utils/responseUtils";

const { sendData, sendCreated, sendDeleted, sendUpdated } = ResponseUtils(
  Model
);

export const getAll: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const entity = await Model.findAll();
  sendData(res, entity);
};

export const get: RequestHandler = async (
  { params: { id } }: Request,
  res: Response,
  next: NextFunction
) => {
  const entity = await Model.findIfExists(id);
  sendData(res, entity);
};

export const create: RequestHandler = async (
  { body }: Request,
  res: Response,
  next: NextFunction
) => {
  const entity = getEntityFromInputs(body, [
    "id",
    ...OfferModel.columnNames,
  ]);
  const { id } = await Model.insert(entity);
  sendCreated(res, id);
};

export const update: RequestHandler = async (
  { body, params: { id } }: Request,
  res: Response,
  next: NextFunction
) => {
  const entity = getEntityFromInputs(body);
  entity.deleted_at = null;
  await Model.updateIfExists(id, entity, true);
  sendUpdated(res, id);
};

export const remove: RequestHandler = async (
  { params: { id } }: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await Model.findIfExists(id);
  await Model.delete(result.id);
  sendDeleted(res, id);
};
