import { RequestHandler, Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../exception/http";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../utils/config"
const authConfig = config.authentication;

import {
  UserModel as Model, UserModel,
} from "../models/user";
import ResponseUtils from "../utils/responseUtils";

const { sendData } = ResponseUtils(
  Model
);

export const getMe: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req["user"])
    throw new UnauthorizedError();
  const user = await UserModel.findById(req["user"].id);
  sendData(res, await Model.serialize(user));
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await Model.findOne({
    type: req.body.type,
    email: req.body.email
  });
  if (!user)
    throw new UnauthorizedError("User or password is incorrect", "InvalidCredentials");
  const passwordMatches = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatches)
    throw new UnauthorizedError("User or password is incorrect", "InvalidCredentials");
  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
    data: { id: user.id, type: user.type }
  }, authConfig.secret, { algorithm: authConfig.algorithm });
  sendData(res, {
    user: await Model.serialize(user),
    token: token
  });
};