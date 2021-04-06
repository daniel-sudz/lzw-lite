import { test1 } from "../test/test1";
import { compress } from "./index";
import * as fs from "fs";
import * as path from "path";

it("should parse big file", () => {
  const output = compress(JSON.stringify(test1));
  fs.writeFileSync(
    path.resolve("./test/test1.out"), // weird that path ressolves differently here than in imports
    JSON.stringify(output, null, 2)
  );
});
