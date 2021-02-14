/**
 * server.ts
 *
 * This starts  one  app instance by CPU count.  This max-out performance under
 * low load (~40% machine). Under heavy load, this has no impact as most of the
 * processing power will be consumed by libuv.
 *
 * The following code makes use of cluster to handle threads.  It takes care of
 * thread termination and respawn.
 */

import cluster from "cluster";
import os from "os";
import process from "process";
import winston from "./utils/winston";

const config = require(`../config/${process.env.NODE_ENV ||
  "development"}.json`);
const pjson = require("../package.json");
const basePath = __dirname;

/**
 * Start server in a clustered world
 */

if (cluster.isMaster) {
  // Name main process so that SIGINT will work
  process.title = process.argv[2];

  winston.info(
    "%s %s running on port %d from %s",
    pjson.name,
    pjson.version,
    config.server.port,
    basePath
  );

  // Let's fork
  let cpuCount = config.server.threads || os.cpus().length;
  winston.info("spawning %d workers", cpuCount);
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // handle dying workers
  cluster.on("exit", function(worker) {
    winston.warn("worker %d died, respawning", worker.id);
    let wrkr = cluster.fork();
  });
} else {
  // Spawn a child process, force IPv4
  let engine = require("./app");
}
