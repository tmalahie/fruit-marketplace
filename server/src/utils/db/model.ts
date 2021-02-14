import knex from "./knex";
import uuid from "uuid/v4";
import { dateToText } from "./formating";
import ObjectUtils from "../objectUtils";
import { NotFoundError } from "../../exception/http";
import { isObject } from "../typesUtils";

// The guts of a model that uses Knexjs to store and retrieve data from a
// database using the provided `knex` instance. Custom functionality can be
// composed on top of this set of common guts.
//
// The idea is that these are the most-used types of functions that most/all
// "models" will want to have. They can be overriden/modified/extended if
// needed by composing a new object out of the one returned by this function ;)

export const entityNotFoundError = (id: string | any, entity: string) =>
  new NotFoundError(
    `Could not find entity '${entity}' with id: ${!isObject(id) ? id : JSON.stringify(id).replace(/"/g, "'")
    }`,
    "EntityNotFound",
    { id, entity }
  );

type ModelProps<K> = {
  tableName: string;
  requiredProps?: K[];
  optionalProps?: K[];
  timeout?: number;
};

export type DefaultColumns = {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};
export const DefaultColumnNames: any = ["id", "created_at", "updated_at"];
export type ModelColumn<T> = keyof Required<T>;
export type ModelFilters<T> = {
  [id in ModelColumn<T>]?: any;
};
export type ModelColumns<T> = {
  [id in ModelColumn<T>]: string;
};
const modelColumnProxy = new Proxy({}, { get: (_, name) => name });

class Model<T extends DefaultColumns> {
  public readonly tableName: string;
  public readonly columns = modelColumnProxy as ModelColumns<T>;
  public readonly requiredProps: ModelColumn<T>[];
  public readonly optionalProps: ModelColumn<T>[];
  public readonly columnNames: ModelColumn<T>[];
  public readonly selectableProps: ModelColumn<T>[];
  public readonly timeout: number;

  constructor(props: ModelProps<ModelColumn<T>>) {
    this.tableName = props.tableName;
    this.requiredProps = props.requiredProps || [];
    this.optionalProps = props.optionalProps || [];
    this.columnNames = [...this.requiredProps, ...this.optionalProps];
    this.selectableProps = [...DefaultColumnNames, ...this.columnNames];
    this.timeout = props.timeout || 30000;
  }

  columnsWithAlias(
    alias: string,
    columns: (ModelColumn<T> | [ModelColumn<T>, string])[] = this
      .selectableProps
  ) {
    return columns.map((c: any) => {
      if (Array.isArray(c)) c = c.join(" AS ");
      if (!alias) return c;
      return `${alias}.${c}`;
    });
  }

  async insert(props: Partial<T>): Promise<T & { id: string }> {
    const cleanedProps = ObjectUtils.removeKeysWithUndefinedValues(props);
    const res = this.fillDefaultColumns(cleanedProps);
    const newProps = await this.format(res);
    await knex
      .insert(newProps)
      .into(this.tableName)
      .timeout(this.timeout);
    return res;
  }

  async update(id: string, props: Partial<T>): Promise<number> {
    const { id: _, ...propsWithoutId } = props;
    const cleanedProps = ObjectUtils.removeKeysWithUndefinedValues(
      propsWithoutId
    );
    const res = await this.format(cleanedProps);
    if (!res.updated_at) res.updated_at = new Date().toISOString();
    return knex
      .update(res)
      .into(this.tableName)
      .where({ id, deleted_at: null })
      .timeout(this.timeout);
  }

  async find(
    filters: ModelFilters<T>,
    {
      includeDeleted = false,
      ...options
    }: {
      includeDeleted?: boolean;
      [key: string]: any;
    } = {}
  ): Promise<T[]> {
    const results = await knex
      .select(this.selectableProps)
      .from(this.tableName)
      .where({
        ...filters,
        ...(!includeDeleted && { deleted_at: null }),
      })
      .timeout(this.timeout);

    return this.transformResults(results as T[], options);
  }

  findAll(options?: {
    includeDeleted?: boolean;
    [key: string]: any;
  }): Promise<T[]> {
    return this.find({}, options);
  }

  // Same as `find` but only returns the first match if >1 are found.
  async findOne(
    filters: ModelFilters<T>,
    options?: {
      includeDeleted?: boolean;
      [key: string]: any;
    }
  ): Promise<T> {
    const results = await this.find(filters, options);
    return Array.isArray(results) ? results[0] : results;
  }

  findById(id: string, options?: any): Promise<T> {
    return this.findOne({ id }, options);
  }

  // Same as findById but throws an exception if item doesn't exist
  async findIfExists(id: string, includeDeleted: boolean = false): Promise<T> {
    const filters = { id, ...(!includeDeleted && { deleted_at: null }) };
    const res = await this.customSelect({ where: filters });
    if (!res.length) {
      throw entityNotFoundError(id, this.tableName);
    }
    return res[0];
  }

  async updateIfExists(
    id: string,
    props: Partial<T>,
    includeDeleted: boolean = false
  ): Promise<number> {
    const { id: _, ...propsWithoutId } = props;
    const cleanedProps = ObjectUtils.removeKeysWithUndefinedValues(
      propsWithoutId
    );
    const res = await this.format(cleanedProps);
    const affectedRows = await knex
      .update(res)
      .into(this.tableName)
      .where({ id, ...(!includeDeleted && { deleted_at: null }) })
      .timeout(this.timeout);

    if (!affectedRows) {
      throw entityNotFoundError(id, this.tableName);
    }
    return affectedRows;
  }
  delete(id: string): Promise<number> {
    const toUpdate = { deleted_at: dateToText(new Date()) } as Partial<T>;
    return this.update(id, toUpdate);
  }

  async format({ ...props }, _options?: { [key: string]: any }) {
    for (const [key, value] of Object.entries(props)) {
      if (["created_at", "updated_at"].includes(key) && value) {
        props[key] = dateToText(new Date(value));
      } else if (ObjectUtils.isObjectOrArray(value)) {
        props[key] = JSON.stringify(value);
      }
    }
    return props;
  }

  async transformResult(
    obj: any,
    _options: { [key: string]: any } = {}
  ): Promise<T> {
    return obj;
  }

  transformResults(arr: T[], options: { [key: string]: any } = {}) {
    return Promise.all(arr.map((el) => this.transformResult(el, options)));
  }

  generateUuid() {
    return uuid();
  }
  fillDefaultColumns({
    id = null,
    created_at = null,
    updated_at = null,
    ...cleanedProps
  }): any {
    const d = new Date().toISOString();
    return {
      ...cleanedProps,
      id: id || this.generateUuid(),
      created_at: created_at || d,
      updated_at: updated_at || d,
    };
  }

  customSelect(
    {
      alias = null,
      columns = this.selectableProps,
      where = { deleted_at: null },
    } = {} as any
  ) {
    let tableName = this.tableName;
    if (alias) {
      tableName = `${tableName} AS ${alias}`;
      if (Array.isArray(columns))
        columns = columns.map((name) =>
          name.indexOf && name.indexOf(".") === -1 ? `${alias}.${name}` : name
        );
      else if (columns === "*") columns = `${alias}.*`;
      where = Object.entries(where).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [`${alias}.${key}`]: value,
        };
      }, {});
    }
    return knex
      .select(columns)
      .from(tableName)
      .where(where)
      .timeout(this.timeout);
  }
  customUpdate({ columns, where = { deleted_at: null } } = {} as any) {
    return knex
      .update(columns)
      .into(this.tableName)
      .where(where)
      .timeout(this.timeout);
  }

  private async bulkInsert_<K>(
    rows: K[],
    updateIfExists
  ): Promise<(K & { id: string })[]> {
    if (!rows.length) return [];
    const res = rows.map((row) =>
      this.fillDefaultColumns(ObjectUtils.removeKeysWithUndefinedValues(row))
    );
    const newRows: any = await Promise.all(res.map((row) => this.format(row)));
    const columns = Object.keys(newRows[0]);
    let sql = `INSERT INTO ${this.tableName} `;
    sql += `(${columns.map((column) => `\`${column}\``).join(",")}) VALUES `;
    sql += newRows
      .map((row) => {
        return `(${columns
          .map((column) =>
            knex.raw("?", row[column] == undefined ? null : row[column])
          )
          .join(",")})`;
      })
      .join(",");
    if (updateIfExists) {
      sql += " ON DUPLICATE KEY UPDATE ";
      sql += columns
        .filter((column) => column != "id")
        .map((column) => `\`${column}\`=VALUES(\`${column}\`)`)
        .join(",");
    }
    await knex.raw(sql);
    return res;
  }
  bulkInsert<K>(rows: K[]): Promise<(K & { id: string })[]> {
    return this.bulkInsert_(rows, false);
  }
  bulkUpsert<K>(rows: K[]): Promise<(K & { id: string })[]> {
    return this.bulkInsert_(rows, true);
  }
  async bulkUpdate<K>(rows: K[]): Promise<K[]> {
    for (const row of rows) await this.update(row["id"], row);
    return rows;
  }
  bulkDelete(ids: string[]) {
    const deleted_at = dateToText(new Date());
    return this.customUpdate({ columns: { deleted_at } }).where(
      "id",
      "IN",
      ids
    );
  }
}
export default Model;
