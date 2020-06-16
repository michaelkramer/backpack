import { $Address } from "../types";
/**
 * Given a dollar amount, return a formatted price
 * @param {Number} amount
 */
declare function formatPrice(amount: number): string;
/**
 * Given a number, return a formatted number
 * @param {Number} amount
 */
declare function formatNumber(amount: number): string;
/**
 * Given a phone number, strip non-numeric characters for database storage
 * Note: If phone has extension, this is not a suitable function
 *
 * @param {Number|String} phone
 * @returns {String}
 */
declare function sanitizePhone(phone: string | number): string;
declare function formatPhone(phone: string): null | string;
/**
 * Returns a domain
 * If there is no protocol, default to `http://`
 *
 * @param {String} origUrl
 * @returns {String|null}
 */
declare function getProtocolAndHostname(origUrl?: string): null | string;
/**
 * Returns a domain without a protocol associated with it
 *
 * @param {String} origUrl
 * @returns {String|null}
 */
declare function getHostname(origUrl?: string): null | string;
/**
 * Like _.startCase but:
 * 1. Doesn't strip non-alphanumeric
 * 2. Doesn't capitalize first letter of acronyms without vowels (usually we know this is an acronym)
 * 3. Ignores casing for IGNORED_WORDS
 * 4. Ignores words with length of 2 (usually state abbrev)
 * 5. If lowercase word in FORCED_WORDS, it will ignore other rules
 * @param {*} name
 */
declare function formatCap(name: string): string;
declare function formatAddress(record: $Address): string;
/**
 * [toSnakeCase - Convert a payload's keys from camelCase to snake_case]
 * @param  {object} payload
 * @return {object}
 */
declare function toSnakeCase(payload: Object | Array<Object>): Object;
/**
 * [toSnakeCaseCached - Convert a payload's keys from camelCase to snake_case (Use Memory Cache)]
 * @param  {object} payload
 * @return {object}
 */
declare function toSnakeCaseCached(payload: Object | Array<Object>): Object;
/**
 * [toCamelCase - Convert a payload's keys from snake_case to camelCase]
 * @param  {object} payload
 * @return {object}
 */
declare function toCamelCase(payload: Object | Array<Object>): Object;
/**
 * [toCamelCaseCached - Convert a payload's keys from snake_case to camelCase (Use Memory Cache)]
 * @param  {object} payload
 * @return {object}
 */
declare function toCamelCaseCached(payload: Object | Array<Object>): Object;
declare function encrypt(plaintext: string): string;
declare function decrypt(ciphertext: string): string;
declare function splitFullName(fullName: string): {
    firstName: string;
    lastName: string;
};
export { toSnakeCase, toSnakeCaseCached, toCamelCase, toCamelCaseCached, encrypt, decrypt, sanitizePhone, formatPhone, formatPrice, formatNumber, getProtocolAndHostname, getHostname, formatAddress, formatCap, splitFullName, };
