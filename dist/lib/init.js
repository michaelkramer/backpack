"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var config_1 = require("../config");
var logger_1 = require("../logger");
var db_1 = require("./db");
var cache_1 = require("./cache");
var log = new logger_1.Logger(__filename);
function init(config) {
    var cfg = lodash_1.merge(config_1.configDefault, config);
    if (cfg.captureUncaught) {
        process.on("uncaughtException", log.error);
    }
    if (cfg.captureUnhandled) {
        process.on("unhandledRejection", log.error);
    }
    if (cfg.db) {
        lodash_1.each(lodash_1.omit(cfg.db, lodash_1.keys(config_1.db)), function (options, name) {
            return db_1.addDBConnection(name, options, config_1.db);
        });
    }
    if (cfg.cache) {
        lodash_1.each(lodash_1.omit(cfg.cache, lodash_1.keys(config_1.cache)), function (options, name) {
            return cache_1.addCache(name, options, config_1.cache);
        });
    }
}
exports.init = init;
//# sourceMappingURL=init.js.map