"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configDefault = exports.logger = exports.cache = exports.db = void 0;
var logger_1 = require("./logger");
var db = {};
exports.db = db;
var cache = {};
exports.cache = cache;
var logger = new logger_1.Logger(__filename);
exports.logger = logger;
var configDefault = {
    cache: {},
    db: {},
    captureUncaught: false,
    captureUnhandled: false,
};
exports.configDefault = configDefault;
//# sourceMappingURL=config.js.map