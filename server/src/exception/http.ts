/**
 * This file contains some exceptions allowing to return a HTTP status to the client
 * If you throw any HTTPError, the server will handle it automatically to return the right HTTP status
 * with some consistent JSON payload
 */

export class HTTPError extends Error {
  constructor(
    public readonly status: number,
    message?: string,
    public readonly type?: string,
    public readonly details?: any
  ) {
    super(message);
  }
}

export class DuplicateEntryError extends HTTPError {
  constructor({
    msg = "Duplicate entry found",
    type = "DuplicateEntry",
    details,
  }: {
    msg?: string;
    type?: string;
    details?: any;
  }) {
    super(409, msg, type, details);
  }
}

export class NotFoundError extends HTTPError {
  constructor(
    message = "Object not found",
    type: string = "NotFound",
    details?: any
  ) {
    super(404, message, type, details);
  }
}

export class UnprocessableEntityError extends HTTPError {
  constructor(
    message = "Entity may contain invalid fields such as foreign keys not matching an existing entity",
    type: string,
    details?: any
  ) {
    super(422, message, type, details);
  }
}
export class EntityNotFoundError extends UnprocessableEntityError {
  constructor(
    entity: string,
    id,
    withid: string = "with id ",
    details: any = {}
  ) {
    super(`${entity} ${withid}${id} does not exist`, "EntityNotFound", {
      entity,
      id,
      ...details,
    });
  }
}
export class InvalidStatusError extends UnprocessableEntityError {
  constructor(message, details?) {
    super(message, "InvalidStatus", details);
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(
    message = "Action not allowed",
    type: string = "Unauthorized",
    details?: any
  ) {
    super(401, message, type, details);
  }
}

export class BadRequestError extends HTTPError {
  constructor(
    message = "Bad Request",
    type: string = "BadRequest",
    details?: any
  ) {
    super(400, message, type, details);
  }
}

export class InvalidParametersError extends UnprocessableEntityError {
  constructor(param: string, error: string = "Invalid value", details?: any) {
    super(`${param}: ${error}`, "InvalidParameters", details);
  }
}
