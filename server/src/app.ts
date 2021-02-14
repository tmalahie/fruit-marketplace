/**
 * This file is the entry point of the node.js server
 * It sets up everything so that the server runs:
 * express server, routing, middlewares, etc
 */

import express from "express";
import bodyParser from "body-parser";
import chronometer from "./middlewares/chronometer";
import compression from "compression";
import loggerMiddleWare from "./middlewares/logger";
import authenticationMiddleWare from "./middlewares/authentication";
import corsMiddleware from "./middlewares/cors";
import error404Middleware from "./middlewares/error404";
import errorsMiddleware from "./middlewares/errors";
import createRoutes from "./routes";
import helmet from "helmet";

const app = express();
const config = require(`../config/${process.env.NODE_ENV ||
  "development"}.json`);

// security settings
app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());

app.use(chronometer);
app.use(bodyParser.json());
app.use(authenticationMiddleWare);
app.use(corsMiddleware);
app.use(loggerMiddleWare);

createRoutes(app);

app.use(error404Middleware);
app.use(errorsMiddleware);

app.set("port", config.server.port);
app.listen(config.server.port, "0.0.0.0");

export default app;
