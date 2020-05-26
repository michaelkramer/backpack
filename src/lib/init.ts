import { each, omit, keys, merge } from "lodash";
import { db, cache, configDefault } from "../config";
import { Logger } from "../logger";
import { addDBConnection } from "./db";
import { addCache } from "./cache";
import { $Config } from "../types";

const log = new Logger(__filename);

function init(config: $Config): void {
  const cfg = merge(configDefault, config);
  if (cfg.captureUncaught) {
    process.on("uncaughtException", log.error);
  }
  if (cfg.captureUnhandled) {
    process.on("unhandledRejection", log.error);
  }

  if (cfg.db) {
    each(omit(cfg.db, keys(db)), (options, name) =>
      addDBConnection(name, options, db)
    );
  }

  if (cfg.cache) {
    each(omit(cfg.cache, keys(cache)), (options, name) =>
      addCache(name, options, cache)
    );
  }
}

export { init };
