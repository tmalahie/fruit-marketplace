import * as Knex from "knex";
import { createTableFromConfig } from "../../utils/db/migration";
import dbTypes from "../../utils/db/types";
import { Offer } from "../../models/offer";
import { GlobalLog } from "../../models/global_log";
import { User } from "../../models/user";
import { Client } from "../../models/client";
import { Farmer } from "../../models/farmer";

type TableDescription<T> = {
  name: string;
  columns: {
    [id in keyof T]:
    | string
    | string[]
    | {
      type?: string | string[];
      foreign?: string;
      nullable?: boolean;
      default?: any;
    };
  };
  indexes?: {
    columns: string[];
    unique: boolean;
  }[];
};

const USER_TABLE: TableDescription<User> = {
  name: "user",
  columns: {
    email: {
      type: dbTypes.STRING,
      nullable: false,
    },
    password: {
      type: dbTypes.STRING,
      nullable: false,
    },
    type: {
      type: dbTypes.STRING,
      nullable: false,
    }
  },
}
const CLIENT_TABLE: TableDescription<Client> = {
  name: "client",
  columns: {
    id: {
      foreign: "user.id",
      nullable: false,
    },
    wallet_amount_xrp: {
      type: dbTypes.FLOAT,
      nullable: false,
      default: 0
    },
  },
  indexes: [
    {
      columns: ["id"],
      unique: true,
    },
  ]
}
const FARMER_TABLE: TableDescription<Farmer> = {
  name: "farmer",
  columns: {
    id: {
      foreign: "user.id",
      nullable: false,
    },
  },
  indexes: [
    {
      columns: ["id"],
      unique: true,
    },
  ]
}

const OFFER_TABLE: TableDescription<Offer> = {
  name: "offer",
  columns: {
    farmer_id: {
      type: dbTypes.UUID,
      foreign: "farmer.id",
      nullable: false,
    },
    fruit_name: {
      type: dbTypes.STRING,
      nullable: false,
      default: "",
    },
    fruit_quantity: {
      type: dbTypes.INT,
      nullable: false,
      default: 0,
    },
    fruit_unit_price_eur: {
      type: dbTypes.FLOAT,
      nullable: false,
      default: 0,
    },
    period: {
      type: dbTypes.STRING,
      nullable: false,
      default: "",
    }
  },
};

const GLOBAL_LOG: TableDescription<GlobalLog> = {
  name: "global_log",
  columns: {
    request_method: dbTypes.STRING,
    request_uri: dbTypes.STRING,
    request_body: dbTypes.TEXT,
    level: dbTypes.INT,
    category: dbTypes.STRING,
    response_code: dbTypes.INT,
    message: dbTypes.TEXT,
    stack_trace: dbTypes.TEXT
  },
  indexes: [
    {
      columns: ["request_method", "request_uri"],
      unique: false,
    },
    {
      columns: ["category"],
      unique: false,
    },
    {
      columns: ["level"],
      unique: false,
    },
    {
      columns: ["created_at"],
      unique: false,
    },
  ],
};

export async function up(knex: Knex): Promise<any> {
  if (process.env.FLUSHONLY) return;
  await down(knex);

  await createTableFromConfig(knex, USER_TABLE);
  await createTableFromConfig(knex, CLIENT_TABLE);
  await createTableFromConfig(knex, FARMER_TABLE);
  await createTableFromConfig(knex, OFFER_TABLE);
  await createTableFromConfig(knex, GLOBAL_LOG);
}

export async function down(knex: Knex): Promise<any> {
  const sqlOp = process.env.FLUSHONLY ? "DELETE FROM" : "DROP TABLE";
  // Drop all tables
  const tableList = await knex
    .select("tablename")
    .from("pg_catalog.pg_tables")
    .where({ schemaname: "public" });
  await knex.raw("SET session_replication_role = 'replica';");
  await Promise.all(
    tableList
      .filter((result) => !result["tablename"].startsWith("knex_migrations"))
      .map((result) => knex.raw(sqlOp + " \"" + result["tablename"] + "\" CASCADE;"))
  );
  await knex.raw("SET session_replication_role = 'origin';");
}
