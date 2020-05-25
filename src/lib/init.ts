import { each, omit, keys, merge } from "lodash";
import { db, cache } from "../config";
import { addDBConnection } from "./db";
import { addCache } from "./cache";
import { $Config } from "../types";

function init(cfg: $Config): void {
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
