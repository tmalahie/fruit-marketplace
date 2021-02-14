import { RequestHandler, Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../exception/http";
import {
  OfferModel as Model,
  getEntityFromInputs,
  OfferModel,
  Offer,
} from "../models/offer";
import { UserType } from "../models/user";
import ResponseUtils from "../utils/responseUtils";
import util from "util";
import child_process from "child_process";
import { ClientModel } from "../models/client";
import { roundPrice } from "../utils/numberUtils"
const exec = util.promisify(child_process.exec);

const { sendData, sendCreated, sendDeleted, sendUpdated } = ResponseUtils(
  Model
);

async function getTotalPriceXrp(offer: Offer) {
  const total_price_xrp = await exec(`python ../python/compute_xrp.py ${offer.fruit_unit_price_eur} ${offer.fruit_quantity}`);
  return +total_price_xrp.stdout;
}

export const getAll: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const entity = await Model.find({
    period: req.query.period
  });
  if (req["user"].type === UserType.CLIENT) {
    for (const offer of entity)
      offer["fruit_total_price_xrp"] = await getTotalPriceXrp(offer);
  }
  sendData(res, entity);
};

export const getMyOffers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req["user"] || req["user"].type !== UserType.FARMER)
    throw new UnauthorizedError();
  const entity = await Model.find({
    farmer_id: req["user"].id
  });
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
  { body, user }: any,
  res: Response,
  next: NextFunction
) => {
  if (!(user && user.type === UserType.FARMER))
    throw new UnauthorizedError();
  const entity = getEntityFromInputs(body, [
    "id",
    ...OfferModel.columnNames,
  ]);
  entity.farmer_id = user.id;
  const { id } = await Model.insert(entity);
  sendCreated(res, id);
};

export const update: RequestHandler = async (
  { user, body, params: { id } }: any,
  res: Response,
  next: NextFunction
) => {
  const item = await Model.findIfExists(id);
  if (!(user && item.farmer_id === user.id))
    throw new UnauthorizedError();
  const entity = getEntityFromInputs(body);
  entity.deleted_at = null;
  await Model.update(id, entity);
  sendUpdated(res, id);
};

export const remove: RequestHandler = async (
  { user, params: { id } }: any,
  res: Response,
  next: NextFunction
) => {
  const item = await Model.findIfExists(id);
  if (!(user && item.farmer_id === user.id))
    throw new UnauthorizedError();
  await Model.delete(item.id);
  sendDeleted(res, id);
};

export const buy: RequestHandler = async (
  { user, params: { id } }: any,
  res: Response,
  next: NextFunction
) => {
  if (!(user && user.type === UserType.CLIENT))
    throw new UnauthorizedError();
  const offer = await OfferModel.findIfExists(id);
  const totalPriceXrp = await getTotalPriceXrp(offer);
  const client = await ClientModel.findById(user.id);
  if (client.wallet_amount_xrp >= totalPriceXrp) {
    await OfferModel.delete(offer.id);
    await ClientModel.update(user.id, {
      wallet_amount_xrp: roundPrice(client.wallet_amount_xrp - totalPriceXrp)
    });
  }
  sendDeleted(res, id);
};