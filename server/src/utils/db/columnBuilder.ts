import dbTypes from "./types";
import objectUtils from "../objectUtils";

const keysContainSome = (obj, list) =>
  Object.keys(obj).some((elem) => list.includes(elem));

const isString = (elem) => typeof elem === "string" || elem instanceof String;

const isObject = (item) =>
  typeof item === "object" && !Array.isArray(item) && item !== null;

function setColumnFromConfig(table, column, config) {
  if (!isObject(config)) {
    return;
  }
  if (!keysContainSome(config, ["foreign", "type"])) {
    throw new Error("Column config does not contain required key.");
  }
  return Object.entries(config).reduce(
    (previous, [rule, value]: Array<any>) => {
      //console.log(`Rule: ${rule} , value: ${value}`);
      switch (rule) {
        case "foreign":
          if (config.type)
            return previous.references(value);
          return table.uuid(column).references(value);
        case "type":
          if (
            isString(value) &&
            Object.values(dbTypes)
              .filter(isString)
              .includes(value.toString())
          )
            return table[value.toString()](column);
          if (Array.isArray(value) && value[0] === "specificType")
            return table.specificType(column, value[1]);
        case "default":
          return previous.defaultTo(value);
        case "nullable":
          return previous.nullable(value);
        case "extra":
          return previous.extra(value);
        default:
          return previous;
      }
    },
    table
  );
}

const addColumns = (columnsMap) => (table) => {
  Object.entries(columnsMap).forEach(([columnName, config]: Array<any>) => {
    //console.log(` Dealing with type: ${columnType}, column: ${columnName}`);
    if (!objectUtils.isObject(config)) config = { type: config };
    return setColumnFromConfig(table, columnName, config);
  });
};

export default addColumns;
