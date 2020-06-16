import Knex from "knex";
import { QH } from "../types";
declare const qh: QH;
/**
 * Given an array of string values, create the binding for a raw query
 * @param {*} array
 */
declare function dbRawStringCSV(knex: Knex, array: Array<string>): Knex.Raw<any>;
/**
 * Helper function to prevent SQL or logical errors due to bad data when inserting or updating a record in the DB
 * @param {*} payload
 * @param {*} constants
 */
declare function sanitize(payload: Object, constants: any): Object;
export { qh, dbRawStringCSV, sanitize };
