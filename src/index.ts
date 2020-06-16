import { db, cache } from "./config";
import { Logger } from "./logger";
import { init } from "./lib/init";
import {
  toSnakeCase,
  toSnakeCaseCached,
  toCamelCase,
  toCamelCaseCached,
  encrypt,
  decrypt,
  sanitizePhone,
  formatPhone,
  formatPrice,
  formatNumber,
  getProtocolAndHostname,
  getHostname,
  formatAddress,
  formatCap,
  splitFullName,
} from "./lib/transformations";
import {
  create,
  update,
  fetchOne,
  fetchMany,
  createOne,
  updateOne,
} from "./lib/queries";

// types/interfaces
export { $ConnectionOptsType, $Config, $LoggerInterface } from "./types";

export default {
  db,
  cache,
  Logger,
  init,

  // transformations
  toSnakeCase,
  toSnakeCaseCached,
  toCamelCase,
  toCamelCaseCached,
  encrypt,
  decrypt,
  sanitizePhone,
  formatPhone,
  formatPrice,
  formatNumber,
  getProtocolAndHostname,
  getHostname,
  formatAddress,
  formatCap,
  splitFullName,

  // Query Helpers
  create,
  update,
  fetchOne,
  fetchMany,
  createOne,
  updateOne,
};
