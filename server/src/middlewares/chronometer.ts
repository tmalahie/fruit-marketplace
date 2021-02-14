/**
 * Chronometer middleware
 *
 * This middleware logs to winston a summary of current request. It includes
 *    - worker ID
 *    - HTTP staus code
 *    - original IP address
 *    - verb
 *    - URL
 *    - duration in ms
 */

import cluster from 'cluster';
import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

export default (request: Request, response: Response, next: NextFunction) => {
  let start = Date.now()
  response.on('finish', function () {
    let logger: any;
    let duration = Date.now() - start;
    if (typeof winston !== 'undefined' && typeof cluster.worker !== 'undefined') {
      switch (Math.floor(response.statusCode / 100)) {
        case 4:
          logger = winston.warn;
          break;
        case 5:
          logger = winston.error;
          break;
        default:
          logger = winston.info;
          break;
      }
      if (! request.originalUrl.endsWith('/hb'))
        logger('#%d %d %s %s %s %dms', cluster.worker.id, response.statusCode, request.ip.padStart(15, ' '), request.method.padStart(6, ' '), request.originalUrl, duration);
    }
  })
  next();
}