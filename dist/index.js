"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var logger_1 = require("./logger");
var init_1 = require("./lib/init");
exports.default = { db: config_1.db, cache: config_1.cache, Logger: logger_1.Logger, init: init_1.init };
//# sourceMappingURL=index.js.map