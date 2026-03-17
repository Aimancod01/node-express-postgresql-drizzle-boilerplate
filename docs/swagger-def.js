// !NODE: --experimental-json-modules
// import packageData from "../package.json" with { type: "json" };
import fs from "node:fs";
import env from "../src/config/config.js";

const packageData = JSON.parse(fs.readFileSync("./package.json"));

const swaggerDef = {
  openapi: "3.1.0",
  info: {
    title: "node-express-drizzle API documentation",
    version: packageData.version,
  },
  servers: [
    {
      url: `${env.apiHost || "http://localhost:5000"}/api`,
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication" },
    { name: "User", description: "User" },
  ],
};

export default swaggerDef;
