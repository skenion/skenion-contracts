import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";

const jsonFiles = [
  "json-schema/graph/v0/graph.schema.json",
  "json-schema/graph/v0/patch.schema.json",
  "fixtures/graph/minimal.graph.json",
  "fixtures/patch/add-value-node.patch.json"
];

for (const file of jsonFiles) {
  const text = await readFile(file, "utf8");
  JSON.parse(text);
}

await readFile("openapi/runtime-http.v0.yaml", "utf8");

const ajv = new Ajv2020({ allErrors: true });
const graphSchema = JSON.parse(
  await readFile("json-schema/graph/v0/graph.schema.json", "utf8")
);
const patchSchema = JSON.parse(
  await readFile("json-schema/graph/v0/patch.schema.json", "utf8")
);
const graph = JSON.parse(await readFile("fixtures/graph/minimal.graph.json", "utf8"));
const patch = JSON.parse(
  await readFile("fixtures/patch/add-value-node.patch.json", "utf8")
);

const validateGraph = ajv.compile(graphSchema);
const validatePatch = ajv.compile(patchSchema);

if (!validateGraph(graph)) {
  throw new Error(`minimal.graph.json failed validation: ${ajv.errorsText(validateGraph.errors)}`);
}

if (!validatePatch(patch)) {
  throw new Error(
    `add-value-node.patch.json failed validation: ${ajv.errorsText(validatePatch.errors)}`
  );
}

console.log("validated graph schema, patch schema, fixtures, and OpenAPI document");
