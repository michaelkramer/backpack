"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOne = exports.createOne = exports.fetchMany = exports.fetchOne = exports.update = exports.create = void 0;
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var transformations_1 = require("./transformations");
/**
 * [create - create one or many records
 *           automatically converts payload into an array of new records
 *           automatically snakecases all keys on all records]
 * @return {Array} Array of new records
 */
function create(knex, tableName, payload, columns) {
    if (columns === void 0) { columns = "*"; }
    if (!Array.isArray(payload)) {
        payload = [payload];
    }
    var modifiedPayload = lodash_1.default.map(payload, function (newRecord) {
        return transformations_1.toSnakeCase(newRecord);
    });
    return knex(tableName).insert(modifiedPayload).returning(columns);
}
exports.create = create;
/**
 * [update - Update one or many records as determined by filters]
 * @param  {Function} knex        tx or knex Fn
 * @param  {String}   tableName   table name exactly as it is in DB
 * @param  {Object}   filters     simple where filters to match on
 * @param  {Object}   payload     only accepts object of keys and values, not an array
 * @return {Array}                returns array of updated records
 */
function update(knex, tableName, filters, payload) {
    var modifiedFilters = transformations_1.toSnakeCase(filters);
    var modifiedPayload = transformations_1.toSnakeCase(payload);
    return knex(tableName)
        .where(modifiedFilters)
        .returning("*")
        .update(modifiedPayload);
}
exports.update = update;
function fetchMany(knex, tableName, filters, columns) {
    if (columns === void 0) { columns = "*"; }
    var modifiedFilters = transformations_1.toSnakeCase(filters);
    return knex(tableName).columns(columns).where(modifiedFilters);
}
exports.fetchMany = fetchMany;
function fetchOne(knex, tableName, filters, columns) {
    if (columns === void 0) { columns = "*"; }
    var modifiedFilters = transformations_1.toSnakeCase(filters);
    return knex(tableName).first(columns).where(modifiedFilters).limit(1);
}
exports.fetchOne = fetchOne;
/**
 * [createOne - Calls create Fn but returns the first result]
 */
function createOne(knex, tableName, payload, columns) {
    if (columns === void 0) { columns = "*"; }
    return create(knex, tableName, payload, columns).then(function (records) {
        return lodash_1.default.get(records, "0");
    });
}
exports.createOne = createOne;
/**
 * [updateOne - Calls update Fn but returns the first result]
 */
function updateOne(knex, tableName, filters, payload) {
    return update(knex, tableName, filters, payload).then(function (records) {
        return lodash_1.default.get(records, "0");
    });
}
exports.updateOne = updateOne;
//# sourceMappingURL=queries.js.map