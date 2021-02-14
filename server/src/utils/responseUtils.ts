import { Response } from "express";
import Model, { DefaultColumns } from "../utils/db/model";

const sendData = (res: Response, data: any, statusCode: number = 200) =>
  res.status(statusCode).json(data);
const sendHTML = (res: Response, data: string) =>
  res
    .status(200)
    .set("Content-Type", "text/html")
    .send(data);

const sendCreated = (EntityModel: Model<any>) => (
  res: Response,
  id: string,
  options?: any
) =>
  EntityModel.findById(id, options).then((data) =>
    res.status(201).json(data)
  );

const sendUpdated = (EntityModel: Model<any>) => (
  res: Response,
  id: string,
  options?: any
) =>
  EntityModel.findById(id, options).then((data) =>
    res.json(data)
  );

const sendDeleted = (res: Response, id: string) => res.status(204).json();

const sendPDF = (res: Response, data: Buffer, fileName: string) => {
  res.setHeader("Content-disposition", `inline; filename="${fileName}"`);
  res.contentType("application/pdf");
  res.end(data, "binary");
};

export default <T extends DefaultColumns>(EntityModel: Model<T>) => ({
  sendData,
  sendHTML,
  sendCreated: sendCreated(EntityModel),
  sendUpdated: sendUpdated(EntityModel),
  sendDeleted,
  sendPDF,
});
