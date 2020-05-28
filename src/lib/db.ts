import { merge, clone } from "lodash";
import knex from "knex";
import chalk from "chalk";
import { Logger } from "../logger";

const log = new Logger(__filename);

const connectionOptionDefaults = {
  debug: false,
  client: "pg",
  pool: {
    min: 2,
    max: parseInt(process.env.DB_CONNECTION_POOL_MAX) || 10,
  },
};

function enableSQLLogging(
  knexInstance: Function,
  connectionName: string
): void {
  const runningQueries = {};
  // eslint-disable-next-line
  // @ts-ignore
  knexInstance.on("query", (query) => {
    runningQueries[query.__knexQueryUid] = Date.now();
  });
  // eslint-disable-next-line
  // @ts-ignore
  knexInstance.on("query-response", (response, query) => {
    let totalTimeInMS = chalk.green("unknown execution time");

    if (runningQueries[query.__knexQueryUid]) {
      totalTimeInMS = chalk.green(
        `${Date.now() - runningQueries[query.__knexQueryUid]}ms`
      );
      delete runningQueries[query.__knexQueryUid];
    }
    console.log("==> query.sql", query.sql);
    if (query.sql && query.bindings && query.bindings.length) {
      const oldSql = clone(query.sql);
      const bindings = clone(query.bindings);
      const sql = oldSql.replace(/\$\d+/gi, () => {
        // eslint-disable-next-line
        // @ts-ignore
        return knexInstance.raw("?", [bindings.shift()]);
      });

      log.info(
        chalk.blue(`[${connectionName}]`),
        chalk.magenta(sql),
        totalTimeInMS
      );
    } else if (query.sql) {
      log.info(
        chalk.blue(`[${connectionName}]`),
        chalk.magenta(query.sql),
        totalTimeInMS
      );
    }
  });
}

function addDBConnection(
  name: string,
  options:
    | Function
    | (() => string)
    | (() => string)
    | (() => Object)
    | ((v: string | number | symbol) => boolean)
    | ((v: Object) => boolean)
    | ((v: string | number | symbol) => boolean),
  db: Object
): Function {
  if (db[name]) {
    log.warn(chalk.yellow.bold(`DB connection ${name} already added`));
    return db[name];
  }

  const knexInstance = knex(merge({}, connectionOptionDefaults, options));

  if (process.env.KNEX_DEBUG) {
    enableSQLLogging(knexInstance, name);
  }

  db[name] = knexInstance;

  return knexInstance;
}

export { addDBConnection };
