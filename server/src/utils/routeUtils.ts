import {
  oneOf,
  body,
  param,
  ValidationChain,
  CustomValidator,
  query,
} from "express-validator";

import { isObject, isNonEmptyObject } from "../utils/typesUtils";

const findFromKeysPath = (object, keysPath: string) =>
  keysPath.split(".").reduce((acc, current) => {
    if (isObject(acc) && acc.hasOwnProperty(current)) {
      return acc[current];
    }
  }, object);

type DefaultAutomaticFeatures = {
  isOptional?: boolean;
  isOptionalNullable?: boolean;
  isOptionalOrFalsy?: boolean;
  entity?: string;
  isIn?: any[];
};

export type DefaultValidationChain = {
  fields: string | string[];
  dependsOn?: ValidationChain | CustomValidator;
  location?: string;
  parents?: string;
  msg?: string;
} & DefaultAutomaticFeatures;

export const getUUIDMsg = (entity: string) =>
  `must be a valid '${entity}' UUID`;

export const checkDefaults = ({
  validationLink,
  location,
  parents = null,
  isOptional = false,
  isOptionalNullable = null,
  isOptionalOrFalsy = null,
  entity = null,
  isIn = null,
}: {
  validationLink: ValidationChain;
  location: string;
  parents?: string;
  isOptional?: boolean;
  isOptionalNullable?: boolean;
  isOptionalOrFalsy?: boolean;
  entity?: string;
  isIn?: any[];
}): ValidationChain =>
  [
    { isOptional },
    { isOptionalNullable },
    { isOptionalOrFalsy },
    { entity },
    { isIn },
  ].reduce((acc: ValidationChain, current: DefaultAutomaticFeatures) => {
    if (current.hasOwnProperty("isOptional")) {
      return current.isOptional
        ? acc.optional()
        : acc.exists().withMessage("must be provided");
    }

    if (
      current.hasOwnProperty("isOptionalNullable") &&
      current.isOptionalNullable
    ) {
      return acc.optional({ nullable: true });
    }

    if (
      current.hasOwnProperty("isOptionalOrFalsy") &&
      current.isOptionalOrFalsy
    ) {
      return acc.optional({ checkFalsy: true });
    }

    if (current.entity) {
      return acc.isUUID().withMessage(getUUIDMsg(current.entity));
    }

    if (current.isIn) {
      return acc
        .trim()
        .isIn(current.isIn)
        .withMessage(
          `must be a valid string from: ['${current.isIn.join("', '")}']`
        );
    }
    return acc;
  }, validationLink);

export const checkBody = ({
  fields,
  dependsOn = null,
  parents = null,
  msg = null,
  entity = null,
  isOptional = false,
  isOptionalNullable = false,
  isOptionalOrFalsy = false,
  isIn = null,
}: DefaultValidationChain): ValidationChain => {
  const validationLink: ValidationChain = body(
    parents
      ? Array.isArray(fields)
        ? fields.map((field) => `${parents}.${field}`)
        : `${parents}.${fields}`
      : fields,
    msg
  ).if(!dependsOn ? () => true : dependsOn);

  return checkDefaults({
    validationLink: parents
      ? validationLink.if(
          body(parents)
            .exists()
            .notEmpty()
        )
      : validationLink,
    location: "body",
    parents,
    entity,
    isOptional,
    isOptionalNullable,
    isOptionalOrFalsy,
    isIn,
  });
};

export const checkParam = ({
  fields,
  parents = null,
  msg = null,
  entity = null,
  isOptional = false,
  isIn = null,
}: DefaultValidationChain): ValidationChain => {
  let validationLink: ValidationChain = param(fields, msg);
  return checkDefaults({
    validationLink: parents
      ? validationLink.if(param(parents).exists())
      : validationLink,
    location: "param",
    parents,
    entity,
    isOptional,
    isIn,
  });
};

export const checkQuery = ({
  fields,
  parents = null,
  msg = null,
  entity = null,
  isOptional = false,
  isIn = null,
}: DefaultValidationChain): ValidationChain => {
  let validationLink: ValidationChain = query(fields, msg);
  return checkDefaults({
    validationLink: parents
      ? validationLink.if(query(parents).exists())
      : validationLink,
    location: "param",
    parents,
    entity,
    isOptional,
    isIn,
  });
};

export const customBodyCheck = (
  customValidator: CustomValidator
): ValidationChain => body().custom(customValidator);

export const nonEmptyBodyCheck: ValidationChain = body().custom(
  isNonEmptyObject
);
export const validBodyCheck = (allowedKeys: string[] = []): ValidationChain =>
  body()
    .custom(isNonEmptyObject)
    .withMessage("main request body must not be empty")
    .custom((obj) => {
      const isInAllowedKeys = (key: string) => allowedKeys.includes(key);
      return Object.keys(obj).filter(isInAllowedKeys).length;
    })
    .withMessage(
      `must have at least one key from: {${allowedKeys.join(", ")}}`
    );

export const checkOneOfRequired = (
  fields: string[] = [],
  checkFunc: (_: DefaultValidationChain) => ValidationChain = checkBody
) =>
  oneOf(
    fields.map((field) =>
      checkFunc({
        fields: field,
      })
    )
  );
