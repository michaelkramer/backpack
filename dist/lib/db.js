"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDBConnection = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var knex_1 = tslib_1.__importDefault(require("knex"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var logger_1 = require("../logger");
var log = new logger_1.Logger(__filename);
var connectionOptionDefaults = {
    debug: false,
    client: "pg",
    pool: {
        min: 2,
        max: parseInt(process.env.DB_CONNECTION_POOL_MAX) || 10,
    },
};
function enableSQLLogging(knexInstance, connectionName) {
    var runningQueries = {};
    // eslint-disable-next-line
    // @ts-ignore
    knexInstance.on("query", function (query) {
        runningQueries[query.__knexQueryUid] = Date.now();
    });
    // eslint-disable-next-line
    // @ts-ignore
    knexInstance.on("query-response", function (response, query) {
        var totalTimeInMS = chalk_1.default.green("unknown execution time");
        if (runningQueries[query.__knexQueryUid]) {
            totalTimeInMS = chalk_1.default.green(Date.now() - runningQueries[query.__knexQueryUid] + "ms");
            delete runningQueries[query.__knexQueryUid];
        }
        console.log("==> query.sql", query.sql);
        if (query.sql && query.bindings && query.bindings.length) {
            var oldSql = lodash_1.clone(query.sql);
            var bindings_1 = lodash_1.clone(query.bindings);
            var sql = oldSql.replace(/\$\d+/gi, function () {
                // eslint-disable-next-line
                // @ts-ignore
                return knexInstance.raw("?", [bindings_1.shift()]);
            });
            log.info(chalk_1.default.blue("[" + connectionName + "]"), chalk_1.default.magenta(sql), totalTimeInMS);
        }
        else if (query.sql) {
            log.info(chalk_1.default.blue("[" + connectionName + "]"), chalk_1.default.magenta(query.sql), totalTimeInMS);
        }
    });
}
function addDBConnection(name, options, db) {
    if (db[name]) {
        log.warn(chalk_1.default.yellow.bold("DB connection " + name + " already added"));
        return db[name];
    }
    var knexInstance = knex_1.default(lodash_1.merge({}, connectionOptionDefaults, options));
    if (process.env.KNEX_DEBUG) {
        enableSQLLogging(knexInstance, name);
    }
    db[name] = knexInstance;
    return knexInstance;
}
exports.addDBConnection = addDBConnection;
//# sourceMappingURL=db.js.map