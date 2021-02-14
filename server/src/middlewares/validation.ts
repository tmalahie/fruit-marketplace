import { validationResult, ValidationError } from "express-validator";
import { InvalidParametersError } from "../exception/http";
import { isEmptyObject } from "../utils/typesUtils";

const isBodyEmpty = (errors: ValidationError[] = []) => {
  const [firstError] = errors;
  return (
    isEmptyObject(firstError.value) &&
    firstError.param === "" &&
    firstError.location === "body"
  );
};

const isQueryEmpty = (errors: ValidationError[] = []) => {
  const [firstError] = errors;
  return (
    isEmptyObject(firstError.value) &&
    firstError.param === "" &&
    firstError.location === "query"
  );
};

const getGroupedErrors = (errors: ValidationError[] = []) =>
  errors
    .filter(
      (error) =>
        !(error.param === "_error" && error.hasOwnProperty("nestedErrors"))
    )
    .reduce(
      (acc, { param, location, ...error }) => ({
        ...acc,
        [param]: acc.hasOwnProperty(param)
          ? {
              ...acc[param],
              errors: [...acc[param].errors, error],
            }
          : {
              location,
              errors: [error],
            },
      }),
      {}
    );

const getNestedErrors = (errors: ValidationError[] = []) => {
  return errors
    .filter(
      (error) =>
        error.param === "_error" && error.hasOwnProperty("nestedErrors")
    )
    .map((error) => getGroupedErrors(error.nestedErrors as ValidationError[]))
    .reduce((acc, groupedErrors) => {
      // const label = Object.keys(groupedErrors).join(" OR ");
      return {
        ...acc,
        oneOf: groupedErrors,
      };
    }, {});
};

/**
 * A middleware to handle form validation errors returned by express-validator
 * If there are some errors, it will return a "bad request" status to the client
 * with the details on the wrong parameters in JSON payload
 */
export default (req, _res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "testing"
  ) {
    console.log("Errors list: ", errors.mapped());
  }

  if (isBodyEmpty(errors.array())) {
    throw new InvalidParametersError("JSON body", "must not be empty!");
  } else if (isQueryEmpty(errors.array())) {
    throw new InvalidParametersError(
      "Query parameters",
      errors.array()[0].msg || "must not be empty!"
    );
  }

  const reducedErrors = getGroupedErrors(errors.array());
  const nestedErrors = getNestedErrors(errors.array());
  const allErrors = { ...reducedErrors, ...nestedErrors };

  //console.log("Errors list: ");
  //console.log(JSON.stringify(allErrors, null, 2));

  if (nestedErrors.hasOwnProperty("oneOf")) {
    throw new InvalidParametersError(
      Object.keys(nestedErrors["oneOf"]).join(" OR "),
      "at least one of the fields must match expected input rules ",
      nestedErrors["oneOf"]
    );
  }

  throw new InvalidParametersError(
    Object.keys(allErrors).join(", "),
    "field(s) do(es)n't match expected input rules",
    allErrors
  );
};
