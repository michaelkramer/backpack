"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = exports.dbRawStringCSV = exports.qh = void 0;
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var logger_1 = require("../logger");
// later
//import { getHostname, isDateValue } from "server/lib/helpers";
var log = new logger_1.Logger(__filename);
// qh = Query [Builder] helper
var qh = {
    // Specify allowed `where x = y` columns
    whereEquals: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            if (filters && filters[key]) {
                query.where(column, filters[key]);
            }
        });
        return qh; // allow chaining
    },
    whereGTE: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            if (filters && filters[key]) {
                query.where(column, ">=", filters[key]);
            }
        });
        return qh; // allow chaining
    },
    whereLTE: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            if (filters && filters[key]) {
                query.where(column, "<=", filters[key]);
            }
        });
        return qh; // allow chaining
    },
    // same as where equals but forces lower casing
    whereLowerEquals: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            if (lodash_1.default.get(filters, key)) {
                query.whereRaw("lower(??) = lower(?)", [column, filters[key]]);
            }
        });
        return qh;
    },
    // same as where equals but forces lower casing
    whereILike: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            if (lodash_1.default.get(filters, key)) {
                query.where(column, "ILIKE", "%" + filters[key] + "%");
            }
        });
        return qh;
    },
    // Specify allowed `where x IN (y1, y2, y3, ...)` columns
    whereIn: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            // Added Array.isArray check because if filters[key].length === 0, this filter is skipped
            // Which could lead to accidentally exposing records in an unintended way
            // Ex: fetching tasks whereIn('tasks.assigned_to', []) would return an empty array but if we skip the filter
            // It will return tasks for all users
            if (filters && filters[key] && Array.isArray(filters[key])) {
                query.whereIn(column, filters[key]);
            }
            else if (filters && filters[key] && !Array.isArray(filters[key])) {
                // Ideally it would be better to throw here but the context needs to be captured in order to fix this.
                log.error("Expected array of values for filter: " + key + ", got " + typeof filters[key], { column: column, value: filters[key] });
            }
        });
        return qh; // allow chaining
    },
    // Specify allowed `where x NOT IN (y1, y2, y3, ...)` columns
    whereNotIn: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            if (filters &&
                filters[key] &&
                Array.isArray(filters[key]) &&
                filters[key].length) {
                query.whereNotIn(column, filters[key]);
            }
            else if (filters && filters[key] && !Array.isArray(filters[key])) {
                // Ideally it would be better to throw here but the context needs to be captured in order to fix this.
                log.error("Expected array of values for filter: " + key + ", got " + typeof filters[key], { column: column, value: filters[key] });
            }
        });
        return qh; // allow chaining
    },
    // Accepts value as an array or a string
    whereArrayContains: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            // Added Array.isArray check because if filters[key].length === 0, this filter is skipped
            // Which could lead to accidentally exposing records in an unintended way
            // Ex: fetching tasks whereIn('tasks.assigned_to', []) would return an empty array but if we skip the filter
            // It will return tasks for all users
            if (filters && filters[key]) {
                query.where(column, "@>", Array.isArray(filters[key]) ? filters[key] : [filters[key]]);
            }
            else if (filters && filters[key] && !Array.isArray(filters[key])) {
                throw new Error("Expected array of values for filter: " + key + ", got " + typeof filters[key]);
            }
        });
        return qh; // allow chaining
    },
    // Used for searching keywords in a Vector indexed column
    whereVector: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            if (filters && filters[key]) {
                query.whereRaw("to_tsvector('english', ??) @@ plainto_tsquery('english', ?)", [column, filters[key]]);
            }
        });
        return qh; // allow chaining
    },
    // Like whereEquals, except it looks for values of No/Yes since we can't pass a boolean true/false over QS
    whereBool: function (query, filters, acceptable) {
        lodash_1.default.each(acceptable, function (column, key) {
            // Removed `&& filters[key]` because if the value is false, it will get skipped and not apply the filter
            if (filters && lodash_1.default.has(filters, key)) {
                if (filters[key] === "No" || filters[key] === false) {
                    query.where(function (qb) {
                        qb.where(column, "=", false);
                    });
                }
                else if (filters[key] === "Yes" || filters[key] === true) {
                    query.where(column, "=", true);
                }
            }
        });
        return qh;
    },
    // Specify allowed `where x BETWEEN (pair[0], pair[1])` columns
    // Falls back to `where x >= pair[0]` or `where x < pair[1]` if only one of pair dates specified
    // e.g. Helper.qh.whereBetween(query, filters, `${this.TABLE}.created_at`, [filters.startDate, filters.endDate]);
    whereBetween: function (query, filters, column, pair) {
        if (!(pair && pair.length && pair.length === 2)) {
            return qh;
        }
        if (pair[0] && pair[1]) {
            query.whereBetween(column, [pair[0], pair[1]]);
        }
        else if (pair[0]) {
            query.where(column, ">=", pair[0]);
        }
        else if (pair[1]) {
            query.where(column, "<", pair[1]);
        }
        return qh; // allow chaining
    },
    /**
      Order By
  
      Optionally specify default w/ 2-celled array of [column, sortDir] OR single-celled array using orderByRaw:
      1. qh.orderBy(query, D.db.ck, filters, ['notes.id', 'DESC'])
      2. qh.orderBy(query, D.db.ck, filters, ['notes.id DESC, someOtherField DESC, someThirdField DESC'])
    */
    orderBy: function (query, connection, filters, defaultSort) {
        var sortName = String(lodash_1.default.get(filters, "sortName")).includes(".")
            ? filters.sortName
            : lodash_1.default.snakeCase(String(filters.sortName));
        if (sortName && sortName !== "undefined" && lodash_1.default.get(filters, "sortDir")) {
            if (filters.sortDir === "DESC") {
                query.orderByRaw(connection.raw("?? desc NULLS LAST", [sortName]));
            }
            else {
                // If we pass in agents.first_name, for example, don't convert to agents_first_name
                query.orderBy(sortName, filters.sortDir);
            }
        }
        else if (defaultSort && defaultSort.length === 2) {
            query.orderBy(defaultSort[0], defaultSort[1]); // ex: query.orderBy('read_at', 'DESC');
        }
        else if (defaultSort && defaultSort.length === 1) {
            query.orderByRaw(defaultSort[0]); // ex: query.orderByRaw('read_at NULLS FIRST, id DESC');
        }
        return qh;
    },
};
exports.qh = qh;
/**
 * Given an array of string values, create the binding for a raw query
 * @param {*} array
 */
function dbRawStringCSV(knex, array) {
    return knex.raw(array.reduce(function (memo, str) { return "" + memo + (memo.length ? "," : "") + "'" + str + "'"; }, ""));
}
exports.dbRawStringCSV = dbRawStringCSV;
/**
 * Helper function to prevent SQL or logical errors due to bad data when inserting or updating a record in the DB
 * @param {*} payload
 * @param {*} constants
 */
/* eslint-disable */
function sanitize(payload, constants) {
    return lodash_1.default.transform(payload, function (newRecord, value, key) {
        if (constants.ARRAY_FIELDS &&
            lodash_1.default.includes(constants.ARRAY_FIELDS, key) &&
            !Array.isArray(value)) {
            // Make sure array field(s) have an array value
            newRecord[key] = [value];
            // } else if (
            //   constants.DATE_FIELDS &&
            //   _.includes(constants.DATE_FIELDS, key) &&
            //   (value === "" ||
            //     value === false ||
            //     value === true ||
            //     value === 0 ||
            //     value === 1 ||
            //     !isDateValue(value))
            // ) {
            //   // Make sure fields that can't be '' are null intead
            //   newRecord[key] = null;
        }
        else if (constants.NUMBER_FIELDS &&
            lodash_1.default.includes(constants.NUMBER_FIELDS, key)) {
            newRecord[key] =
                !isNaN(Number(value)) && value !== null && value !== ""
                    ? Number(value)
                    : null;
            // } else if (
            //   constants.URL_FIELDS &&
            //   _.includes(constants.URL_FIELDS, key)
            // ) {
            //   newRecord[key] = typeof value === "string" ? getHostname(value) : null;
        }
        else if (constants.JSON_FIELDS &&
            lodash_1.default.includes(constants.JSON_FIELDS, key)) {
            newRecord[key] = lodash_1.default.isObject(value) ? value : null;
        }
        else if (constants.BOOL_FIELDS &&
            lodash_1.default.includes(constants.BOOL_FIELDS, key)) {
            if (value === false ||
                value === "false" ||
                value === 0 ||
                (typeof value === "string" && value.toLowerCase() === "f") ||
                (typeof value === "string" && value.toLowerCase() === "no")) {
                newRecord[key] = false;
            }
            else if (value === true ||
                value === "true" ||
                value === 1 ||
                (lodash_1.default.isString(value) && value.toLowerCase() === "t") ||
                (lodash_1.default.isString(value) && value.toLowerCase() === "yes")) {
                newRecord[key] = true;
            }
            else {
                newRecord[key] = null;
            }
        }
        else {
            newRecord[key] = value;
        }
        return newRecord;
    }, {});
}
exports.sanitize = sanitize;
/* eslint-enable */
// export function TESTS(tools: TestSuite) {
//   return [
//     tools.test("expect non-array values to become array values", (t) => {
//       t.deepEqual(sanitize({ userIds: 1 }, { ARRAY_FIELDS: ["userIds"] }), {
//         userIds: [1],
//       });
//       t.deepEqual(sanitize({ userIds: [11] }, { ARRAY_FIELDS: ["userIds"] }), {
//         userIds: [11],
//       });
//     }),
//     tools.test("expect string values for date fields to become null", (t) => {
//       const actualDate = new Date();
//       t.deepEqual(sanitize({ createdAt: "" }, { DATE_FIELDS: ["createdAt"] }), {
//         createdAt: null,
//       });
//       t.deepEqual(
//         sanitize({ createdAt: actualDate }, { DATE_FIELDS: ["createdAt"] }),
//         { createdAt: actualDate }
//       );
//     }),
//     tools.test(
//       "expect non-number values for number fields to become null",
//       (t) => {
//         t.deepEqual(sanitize({ userId: "" }, { NUMBER_FIELDS: ["userId"] }), {
//           userId: null,
//         });
//         t.deepEqual(
//           sanitize({ userId: "Jason" }, { NUMBER_FIELDS: ["userId"] }),
//           { userId: null }
//         );
//         t.deepEqual(sanitize({ userId: 1 }, { NUMBER_FIELDS: ["userId"] }), {
//           userId: 1,
//         });
//         t.deepEqual(
//           sanitize({ userId: "1" }, { NUMBER_FIELDS: ["userId"] }), // typecasting is allowed except for ''
//           { userId: 1 }
//         );
//       }
//     ),
//     tools.test(
//       "expect url values for url fields to have protocol stripped from the front",
//       (t) => {
//         t.deepEqual(
//           sanitize({ url: "http://google.com" }, { URL_FIELDS: ["url"] }),
//           { url: "google.com" }
//         );
//         t.deepEqual(
//           sanitize({ url: "https://google.com" }, { URL_FIELDS: ["url"] }),
//           { url: "google.com" }
//         );
//         t.deepEqual(sanitize({ url: "google.com" }, { URL_FIELDS: ["url"] }), {
//           url: "google.com",
//         });
//         t.deepEqual(
//           sanitize({ url: "www.google.com" }, { URL_FIELDS: ["url"] }),
//           { url: "www.google.com" }
//         );
//       }
//     ),
//     tools.test(
//       "expect JSON fields to be null if the value is not an object",
//       (t) => {
//         t.deepEqual(sanitize({ user: "Jason" }, { JSON_FIELDS: ["user"] }), {
//           user: null,
//         });
//         t.deepEqual(
//           sanitize({ user: { firstName: "Jason" } }, { JSON_FIELDS: ["user"] }),
//           { user: { firstName: "Jason" } }
//         );
//       }
//     ),
//     tools.test(
//       "expect BOOL fields to be null if the value is not truthy/falsy",
//       (t) => {
//         t.deepEqual(sanitize({ bool: 1 }, { BOOL_FIELDS: ["bool"] }), {
//           bool: true,
//         });
//         t.deepEqual(sanitize({ bool: "t" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: true,
//         });
//         t.deepEqual(sanitize({ bool: "true" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: true,
//         });
//         t.deepEqual(sanitize({ bool: true }, { BOOL_FIELDS: ["bool"] }), {
//           bool: true,
//         });
//         t.deepEqual(sanitize({ bool: "yes" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: true,
//         });
//         t.deepEqual(sanitize({ bool: "Yes" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: true,
//         });
//         t.deepEqual(sanitize({ bool: "jason" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: null,
//         });
//         t.deepEqual(sanitize({ bool: "1" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: null,
//         });
//         t.deepEqual(sanitize({ bool: 0 }, { BOOL_FIELDS: ["bool"] }), {
//           bool: false,
//         });
//         t.deepEqual(sanitize({ bool: "f" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: false,
//         });
//         t.deepEqual(sanitize({ bool: "false" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: false,
//         });
//         t.deepEqual(sanitize({ bool: false }, { BOOL_FIELDS: ["bool"] }), {
//           bool: false,
//         });
//         t.deepEqual(sanitize({ bool: "no" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: false,
//         });
//         t.deepEqual(sanitize({ bool: "No" }, { BOOL_FIELDS: ["bool"] }), {
//           bool: false,
//         });
//       }
//     ),
//   ];
// }
//# sourceMappingURL=qh.js.map