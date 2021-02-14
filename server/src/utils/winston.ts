import os from 'os';
import winston from 'winston';
import winstonCloudWatch from 'winston-cloudwatch';
const config = require(`../../config/${process.env.NODE_ENV ||
  "development"}.json`);

if (config.log) {
  winston.configure({
    level: config.log.level || "info",
    levels: {
      error: 0,
      warn: 1,
      stats: 2,
      info: 3,
      http: 4,
      verbose: 5,
      debug: 6,
      silly: 7,
    },
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(
        (info) =>
          `${info.timestamp} ${info.level} ${info.message} ${info.stack || ""}`
      )
    ),
    transports: [],
  });

  if (config.log.console && config.log.console.enabled) winston.add(new winston.transports.Console());

  if (config.log.file && config.log.file.enabled)
    winston.add(
      new winston.transports.File({
        filename: config.log.file.filename || "/var/log/billing.log",
        maxsize: config.log.file.size || 1048576,
        maxFiles: config.log.file.files || 10,
      })
    );

  if (config.log.cloudwatch && config.log.cloudwatch.enabled)
    winston.add(
      new winstonCloudWatch({
        ...config.log.cloudwatch.aws,
        logStreamName: function() {
          let date = new Date().toISOString().split('T')[0];
          return os.hostname() + '/' + date
        }
      })
    );
}

winston.addColors({
  error: "red",
  warn: "yellow",
  stats: "magenta",
  info: "green",
  http: "green",
  verbose: "cyan",
  debug: "blue",
  silly: "magenta",
});

export default winston;
