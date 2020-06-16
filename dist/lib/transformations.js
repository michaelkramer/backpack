"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitFullName = exports.formatCap = exports.formatAddress = exports.getHostname = exports.getProtocolAndHostname = exports.formatNumber = exports.formatPrice = exports.formatPhone = exports.sanitizePhone = exports.decrypt = exports.encrypt = exports.toCamelCaseCached = exports.toCamelCase = exports.toSnakeCaseCached = exports.toSnakeCase = void 0;
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var crypto_1 = tslib_1.__importDefault(require("crypto"));
var url_1 = require("url");
var numeral_1 = tslib_1.__importDefault(require("numeral"));
var util_1 = require("util");
//
// memory caches
var camelCache = {};
var snakeCache = {};
/**
 * Given a dollar amount, return a formatted price
 * @param {Number} amount
 */
function formatPrice(amount) {
    return amount ? numeral_1.default(amount).format("$0,000") : "-";
}
exports.formatPrice = formatPrice;
/**
 * Given a number, return a formatted number
 * @param {Number} amount
 */
function formatNumber(amount) {
    return amount ? numeral_1.default(amount).format("0,0") : "-";
}
exports.formatNumber = formatNumber;
/**
 * Given a phone number, strip non-numeric characters for database storage
 * Note: If phone has extension, this is not a suitable function
 *
 * @param {Number|String} phone
 * @returns {String}
 */
function sanitizePhone(phone) {
    var newPhone = String(phone).replace(/\D/g, "");
    if (!newPhone) {
        return "";
    }
    if (String(newPhone)[0] !== "1" && newPhone.length === 10) {
        newPhone = "1" + newPhone;
    }
    return newPhone;
}
exports.sanitizePhone = sanitizePhone;
/*
 * Formats a given phone number into a consistent format
 * Note: If phone has extension, this is not a suitable function.
 *
 * Ex:
 * formatPhone('800.123.1234')
 * '(800) 123-1234'
 *
 * @param {String} User passed phone number to format
 * @returns {String} Formatted Number
 */
function formatPhone(phone) {
    if (!phone) {
        return null;
    }
    var newPhone = String(phone).trim().replace(/\D/g, "");
    var prefix = "";
    if (newPhone.length < 10) {
        return phone; // Phone number is missing digits or otherwise incorrect, return original
    }
    else if (newPhone.length - 11 >= 1) {
        prefix += "+"; // Allow international phone format
        prefix += util_1.format("%s ", newPhone.substr(0, newPhone.length - 10));
        newPhone = newPhone.substr(-10);
    }
    else if (newPhone.length === 11) {
        newPhone = newPhone.substr(-10);
    }
    return lodash_1.default.spread(function (coverage, areaCode, part1, part2) {
        return !newPhone
            ? phone
            : util_1.format("%s(%s) %s-%s", prefix, areaCode, part1, part2);
    })(newPhone.match(/^(\d{3})(\d{3})(\d{4})$/));
}
exports.formatPhone = formatPhone;
function getUrlParts(origUrl) {
    if (!origUrl) {
        return null;
    }
    // If there is no protocol, url library throws an error, add protocol if it doesn't exist before parsing URL
    var modifiedUrl = origUrl.indexOf("http") === -1 ? "http://" + origUrl : origUrl;
    return new url_1.URL(modifiedUrl);
}
/**
 * Returns a domain
 * If there is no protocol, default to `http://`
 *
 * @param {String} origUrl
 * @returns {String|null}
 */
function getProtocolAndHostname(origUrl) {
    var url = getUrlParts(origUrl);
    if (!url) {
        return null;
    }
    var port = url.port ? ":" + url.port : "";
    return (url.protocol || "http:") + "//" + url.hostname + port;
}
exports.getProtocolAndHostname = getProtocolAndHostname;
/**
 * Returns a domain without a protocol associated with it
 *
 * @param {String} origUrl
 * @returns {String|null}
 */
function getHostname(origUrl) {
    var url = getUrlParts(origUrl);
    if (!url) {
        return null;
    }
    var port = url.port ? ":" + url.port : "";
    return "" + url.hostname + port;
}
exports.getHostname = getHostname;
var IGNORED_WORDS = ["llc"];
var FORCED_WORDS = [
    "blvd",
    "ln",
    "pl",
    "rd",
    "sq",
    "st",
    "ct",
    "dr",
    "w",
    "n",
    "e",
    "s",
];
/*
  Perf:
    ucWords: 0.146ms
    ucWords: 0.011ms
    ucWords: 0.125ms
    ucWords: 0.019ms
    ucWords: 0.012ms
    ucWords: 0.045ms
    ucWords: 0.028ms
    ucWords: 0.033ms
    ucWords: 0.042ms
    ucWords: 0.103ms
    ucWords: 0.098ms
    ucWords: 0.032ms
    ucWords: 0.030ms
*/
function ucwords(string) {
    if (!(string && typeof string === "string")) {
        return string;
    }
    var words = string.split(" ");
    var formattedWords = lodash_1.default.map(words, function (word) {
        var wordLength = word.length;
        var lowerWord = word.toLowerCase();
        var loweredWordNoPeriod = lowerWord.replace(".", "").replace(",", "");
        var upperCaseWord = word.toUpperCase();
        if (word !== upperCaseWord &&
            word !== lowerWord &&
            loweredWordNoPeriod.length > 1) {
            return word;
        }
        if (lodash_1.default.includes([
            "AL",
            "AK",
            "AS",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "DC",
            "FM",
            "FL",
            "GA",
            "GU",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MH",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "MP",
            "OH",
            "OK",
            "OR",
            "PW",
            "PA",
            "PR",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VI",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY",
        ], upperCaseWord)) {
            return upperCaseWord;
        }
        var forced = lodash_1.default.includes(FORCED_WORDS, loweredWordNoPeriod); // strip out periods so st. will match "st"
        if ((lodash_1.default.includes(IGNORED_WORDS, lowerWord) || // words we don't want to modify
            (word.match(/[aeiou]/gi) === null && wordLength > 1)) && // acronym without vowels
            !forced) {
            return word;
        }
        return lowerWord.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function (firstLetter) {
            // eslint-disable-line
            return firstLetter.toUpperCase();
        });
    });
    return formattedWords.join(" ");
}
/**
 * Like _.startCase but:
 * 1. Doesn't strip non-alphanumeric
 * 2. Doesn't capitalize first letter of acronyms without vowels (usually we know this is an acronym)
 * 3. Ignores casing for IGNORED_WORDS
 * 4. Ignores words with length of 2 (usually state abbrev)
 * 5. If lowercase word in FORCED_WORDS, it will ignore other rules
 * @param {*} name
 */
function formatCap(name) {
    if (!name) {
        return name;
    }
    return ucwords(name);
}
exports.formatCap = formatCap;
function printCityState(city, state) {
    if (city && state) {
        return formatCap(city.toLowerCase()) + ", " + lodash_1.default.toUpper(state);
    }
    else if (city && !state) {
        return formatCap(city.toLowerCase());
    }
    else if (state && !city) {
        return lodash_1.default.toUpper(state);
    }
    return "";
}
function formatAddress(record) {
    var cityState = printCityState(record.city, record.state);
    var zipCode = record.zipCode && record.zipCode.length ? " " + String(record.zipCode) : "";
    if (!zipCode && record.zip) {
        zipCode = " " + String(record.zip); // MLS offices
    }
    var address = "";
    if (record.address && typeof record.address === "string") {
        address = formatCap(record.address.toLowerCase());
    }
    else if (record.street && typeof record.street === "string") {
        address = formatCap(record.street.toLowerCase()); // used for MLS offices
    }
    else if (record.streetAddress1 || record.streetAddress2) {
        address = formatCap("" + String(record.streetAddress1 || "").toLowerCase() + (record.streetAddress1 && record.streetAddress2 ? " " : "") + String(record.streetAddress2 || "").toLowerCase());
    }
    return "" + address + (address ? ", " : "") + cityState + zipCode;
}
exports.formatAddress = formatAddress;
/**
 * [toSnakeCase - Convert a payload's keys from camelCase to snake_case]
 * @param  {object} payload
 * @return {object}
 */
function toSnakeCase(payload) {
    if (Array.isArray(payload)) {
        return lodash_1.default.map(payload, function (item) {
            return lodash_1.default.mapKeys(item, function (value, key) {
                return lodash_1.default.snakeCase(key);
            });
        });
    }
    return lodash_1.default.mapKeys(payload, function (value, key) {
        return lodash_1.default.snakeCase(key);
    });
}
exports.toSnakeCase = toSnakeCase;
/**
 * [toSnakeCaseCached - Convert a payload's keys from camelCase to snake_case (Use Memory Cache)]
 * @param  {object} payload
 * @return {object}
 */
function toSnakeCaseCached(payload) {
    if (Array.isArray(payload)) {
        return lodash_1.default.map(payload, function (item) {
            return lodash_1.default.mapKeys(item, function (value, key) {
                return snakeCache[key]
                    ? snakeCache[key]
                    : (snakeCache[key] = lodash_1.default.snakeCase(key));
            });
        });
    }
    return lodash_1.default.mapKeys(payload, function (value, key) {
        return snakeCache[key]
            ? snakeCache[key]
            : (snakeCache[key] = lodash_1.default.snakeCase(key));
    });
}
exports.toSnakeCaseCached = toSnakeCaseCached;
/**
 * [toCamelCase - Convert a payload's keys from snake_case to camelCase]
 * @param  {object} payload
 * @return {object}
 */
function toCamelCase(payload) {
    if (Array.isArray(payload)) {
        return lodash_1.default.map(payload, function (item) {
            return lodash_1.default.mapKeys(item, function (value, key) {
                return lodash_1.default.camelCase(key);
            });
        });
    }
    return lodash_1.default.mapKeys(payload, function (value, key) {
        return lodash_1.default.camelCase(key);
    });
}
exports.toCamelCase = toCamelCase;
/**
 * [toCamelCaseCached - Convert a payload's keys from snake_case to camelCase (Use Memory Cache)]
 * @param  {object} payload
 * @return {object}
 */
function toCamelCaseCached(payload) {
    if (Array.isArray(payload)) {
        return lodash_1.default.map(payload, function (item) {
            return lodash_1.default.mapKeys(item, function (value, key) {
                return camelCache[key]
                    ? camelCache[key]
                    : (camelCache[key] = lodash_1.default.camelCase(key));
            });
        });
    }
    return lodash_1.default.mapKeys(payload, function (value, key) {
        return camelCache[key]
            ? camelCache[key]
            : (camelCache[key] = lodash_1.default.camelCase(key));
    });
}
exports.toCamelCaseCached = toCamelCaseCached;
function encrypt(plaintext) {
    if (!(process.env.CRYPTO_KEY && process.env.CRYPTO_ALGO)) {
        throw new Error("Missing require environment variables to encrypt data");
    }
    var key = new Buffer(process.env.CRYPTO_KEY, "hex");
    var cipher = crypto_1.default.createCipher(process.env.CRYPTO_ALGO, key);
    var ciphertext = cipher.update(plaintext, "utf8", "hex");
    ciphertext += cipher.final("hex");
    return ciphertext;
}
exports.encrypt = encrypt;
function decrypt(ciphertext) {
    if (!(process.env.CRYPTO_KEY && process.env.CRYPTO_ALGO)) {
        throw new Error("Missing require environment variables to decrypt data");
    }
    var decrypted = "";
    try {
        var key = new Buffer(process.env.CRYPTO_KEY, "hex");
        var decipher = crypto_1.default.createDecipher(process.env.CRYPTO_ALGO, key);
        decrypted = decipher.update(ciphertext, "hex", "utf8");
        decrypted += decipher.final("utf8");
    }
    catch (err) {
        decrypted = "";
    }
    return decrypted;
}
exports.decrypt = decrypt;
function splitFullName(fullName) {
    var firstName = fullName.split(" ").slice(0, -1).join(" ");
    var lastName = fullName.split(" ").slice(-1).join(" ");
    return { firstName: firstName, lastName: lastName };
}
exports.splitFullName = splitFullName;
//# sourceMappingURL=transformations.js.map