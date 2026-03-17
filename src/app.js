import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import passport from "passport";
import swaggerUi from "swagger-ui-express";

import env from "./config/config.js";
import { spec } from "../docs/spec.js";
import routes from "./routes/index.js";
import * as errorMiddleware from "./middlewares/error.middleware.js";
import { morganMiddleware } from "./middlewares/morgan.middleware.js";
import { jwtStrategy } from "./config/passport.js";

const app = express();

// request logging
app.use(morganMiddleware);

// set security HTTP headers
app.use(helmet());

// parse body params and attach them to req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// compress all responses
app.use(compression());

// enable cors
app.use(
  cors({
    origin: env.apiHost ? [env.apiHost] : true,
  })
);

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// api routes
app.use("/api", routes);

// api-docs
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(spec, { explorer: true }));

// if error is not an instanceOf APIError, convert it.
app.use(errorMiddleware.converter);

// catch 404 and forward
app.use(errorMiddleware.notFound);

// error handler, send stacktrace only during development/local env
app.use(errorMiddleware.handler);

export default app;
