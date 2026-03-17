import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

import swaggerDef from "./swagger-def.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const componentsPath = path.join(__dirname, "components.yml");
const pathsPath = path.join(__dirname, "paths.yml");

const components = YAML.parse(fs.readFileSync(componentsPath, "utf8"));
const { paths } = YAML.parse(fs.readFileSync(pathsPath, "utf8"));

export const spec = {
  ...swaggerDef,
  components,
  paths,
};
