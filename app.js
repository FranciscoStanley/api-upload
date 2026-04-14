import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import uploadRouters from "./src/routes/uploadRouters.js";
import { notFoundHandler } from "./src/middlewares/not-found.middleware.js";
import { errorHandler } from "./src/middlewares/error-handler.middleware.js";

const app = express();
const openApiPath = path.resolve(process.cwd(), "docs", "openapi.yaml");
const openApiDocument = YAML.load(openApiPath);

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/api/v1/upload", uploadRouters);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
