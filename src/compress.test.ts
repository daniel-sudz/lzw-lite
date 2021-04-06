import { test1 } from "../test/test1";
import { compress, decompress } from "./index";
import * as fs from "fs";
import * as path from "path";

it("should parse big file without crashing", () => {
  const output = compress(JSON.stringify(test1));
  fs.writeFileSync(
    path.resolve("./test/test1.out"), // weird that path ressolves differently here than in imports
    JSON.stringify(output, null, 2)
  );
});

it("should encode and decode symetrically for big file", () => {
  const input = JSON.stringify(test1);
  const compressed = compress(input);
  const decompressed = decompress(compressed);
  fs.writeFileSync(
    path.resolve("./test/test2.input.out"), // weird that path ressolves differently here than in imports
    JSON.stringify(input, null, 2)
  );
  fs.writeFileSync(
    path.resolve("./test/test2.decompressed.out"), // weird that path ressolves differently here than in imports
    JSON.stringify(decompressed, null, 2)
  );
});
