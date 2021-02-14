import { checkBody, checkParam } from "./routeUtils";

export const checkDate = ({ fields, parents = null, isOptional = true }) => {
  const isValidDate = (d) => !isNaN(d as any);
  return checkBody({
    fields,
    parents,
    isOptional,
    msg: "must be a valid date (JavaScript date string or timestamp number)",
  }).custom((value) => isValidDate(new Date(value)));
};

export const idParamCheck = (entity: string) =>
  checkParam({ fields: "id", entity, isOptional: false });