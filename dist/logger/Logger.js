"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = tslib_1.__importStar(require("path"));
/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */
var Logger = /** @class */ (function () {
    function Logger(scope) {
        this.scope = Logger.parsePathToScope(scope ? scope : Logger.DEFAULT_SCOPE);
    }
    Logger.parsePathToScope = function (filepath) {
        if (filepath.indexOf(path.sep) >= 0) {
            filepath = filepath.replace(process.cwd(), "");
            filepath = filepath.replace(path.sep + "src" + path.sep, "");
            filepath = filepath.replace(path.sep + "dist" + path.sep, "");
            filepath = filepath.replace(".ts", "");
            filepath = filepath.replace(".js", "");
            filepath = filepath.replace(path.sep, ":");
        }
        return filepath;
    };
    Logger.prototype.set = function (scope) {
        this.scope = Logger.parsePathToScope(scope ? scope : Logger.DEFAULT_SCOPE);
    };
    Logger.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log("debug", message, args);
    };
    Logger.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log("info", message, args);
    };
    Logger.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log("warn", message, args);
    };
    Logger.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log("error", message, args);
    };
    Logger.prototype.log = function (level, message, args) {
        console.log("==> " + this.formatScope() + " " + message);
    };
    Logger.prototype.formatScope = function () {
        return "[" + this.scope + "]";
    };
    Logger.DEFAULT_SCOPE = "app";
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map