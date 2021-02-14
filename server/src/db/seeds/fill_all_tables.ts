import Knex from "knex";
import dataSample from "./data_samples/all_tables.json";

function pascalToSnake(s) {
  return s
    .replace(/(?:^|\.?)([A-Z])/g, function(x, y) {
      return "_" + y.toLowerCase();
    })
    .replace(/^_/, "")
    .replace(/_([a-z])_|$/, "$1");
}

function getModelFromName(table: string) {
  return require("../../models/" + pascalToSnake(table))[`${table}Model`];
}

function insertRowsIntoTable(table, rows = []) {
  const Model = getModelFromName(table);
  if (!Model)
    return Promise.reject(
      new Error(`Table name '${table}' isn't valid. Model could not be found.`)
    );
  return rows.reduce(
    (previousPromise, row) => previousPromise.then(() => Model.insert(row)),
    Promise.resolve()
  );
}

export async function seed(knex: Knex): Promise<any> {
  await knex.raw("START TRANSACTION;");

  for (const [table, data] of Object.entries(dataSample)) {
    await insertRowsIntoTable(table, data);
  }

  await knex.raw("COMMIT;");
}
