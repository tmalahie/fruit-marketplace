import * as Knex from "knex";
import addColumns from "./columnBuilder";
import addIndexes from "./indexBuilder";

export function createTableFromConfig(
  knex: Knex,
  config: {
    name: string;
    columns: any;
    indexes?: any[];
    callback?: Function;
  }
) {
  const { id: idColumn = null, ...columnsWithoutId } = config.columns;
  return knex.schema.createTable(config.name, (table) => {
    if (idColumn) {
      addColumns({ id: idColumn })(table);
    } else {
      table.uuid("id").primary();
    }
    table
      .timestamp("created_at")
      .notNullable();
    table
      .timestamp("updated_at")
      .notNullable();
    table.timestamp("deleted_at").index();
    addColumns(columnsWithoutId)(table);
    addIndexes(config.indexes)(table);
    if (config.callback) {
      config.callback(table);
    }
  });
}

export const createTable = async (
  knex: Knex,
  name: string,
  callback: Function
) =>
  knex.schema.createTable(name, (table) => {
    table.uuid("id").primary();
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.timestamp("deleted_at").nullable();
    callback(table);
  });
