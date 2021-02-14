import config from "./utils/config";

// ref: https://devhints.io/knex
module.exports = {
  client: "pg",
  connection: {
    host: config.db_host,
    user: config.db_user,
    port: config.db_port,
    password: config.db_password,
    database: config.db_name,
    timezone: "+00:00",
    typeCast: function (field, next) {
      if (field.type === "TIMESTAMP") {
        const val = field.string();
        return (
          val &&
          new Date(
            val.replace(
              /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
              "$1-$2-$3T$4:$5:$6Z"
            )
          ).toISOString()
        );
      }
      return next();
    },
  },
  migrations: {
    tableName: "knex_migrations",
    directory: `${__dirname}/db/migrations`,
  },
  seeds: {
    directory: `${__dirname}/db/seeds`,
  },
};

export default module.exports;
