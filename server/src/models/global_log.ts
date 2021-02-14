import ObjectUtils from "../utils/objectUtils";
import Model, { DefaultColumns } from "../utils/db/model";

export enum LOG_LEVEL {
  CRITICAL = 0,
  ERROR = 1,
  WARNING = 2,
  NOTICE = 3,
  INFO = 4
}
export type GlobalLog = DefaultColumns & {
  request_method: string;
  request_uri: string;
  request_body: any;
  level: LOG_LEVEL;
  category: string;
  response_code: number;
  message: string;
  stack_trace: string;
};
class EntityModel extends Model<GlobalLog> {
  constructor() {
    super({
      tableName: "global_log",
      requiredProps: ["request_method", "request_uri", "request_body", "level", "category", "response_code", "message", "stack_trace"],
      optionalProps: []
    });
  }
}
export const GlobalLogModel = new EntityModel();
export const GlobalLogColumns = GlobalLogModel.columns;

export const getEntityFromInputs = (
  inputs: any,
  columns: string[] = GlobalLogModel.columnNames
): Partial<GlobalLog> => ObjectUtils.subKeys(inputs, columns);
