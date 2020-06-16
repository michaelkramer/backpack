import Knex from "knex";
/**
 * [create - create one or many records
 *           automatically converts payload into an array of new records
 *           automatically snakecases all keys on all records]
 * @return {Array} Array of new records
 */
declare function create(knex: Function, tableName: string, payload: any, columns?: Array<string> | string): any;
/**
 * [update - Update one or many records as determined by filters]
 * @param  {Function} knex        tx or knex Fn
 * @param  {String}   tableName   table name exactly as it is in DB
 * @param  {Object}   filters     simple where filters to match on
 * @param  {Object}   payload     only accepts object of keys and values, not an array
 * @return {Array}                returns array of updated records
 */
declare function update(knex: Knex, tableName: string, filters: any, payload: any): Knex.QueryBuilder<any, number>;
declare function fetchMany(knex: Knex, tableName: string, filters: any, columns?: Array<string> | string): Knex.QueryBuilder<any, {
    _base: any;
    _hasSelection: true;
    _keys: string;
    _aliases: string[];
    _single: false;
    _intersectProps: {};
    _unionProps: never;
}[]>;
declare function fetchOne(knex: Knex, tableName: string, filters: any, columns?: Array<string> | string): Knex.QueryBuilder<any, {
    _base: any;
    _hasSelection: true;
    _keys: string;
    _aliases: string[];
    _single: false;
    _intersectProps: {};
    _unionProps: undefined;
}>;
/**
 * [createOne - Calls create Fn but returns the first result]
 */
declare function createOne(knex: Knex, tableName: string, payload: any, columns?: Array<string> | string): any;
/**
 * [updateOne - Calls update Fn but returns the first result]
 */
declare function updateOne(knex: Knex, tableName: string, filters: any, payload: any): Promise<any>;
export { create, update, fetchOne, fetchMany, createOne, updateOne };
