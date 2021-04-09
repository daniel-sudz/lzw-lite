/**
 * @jest-environment node
 */

import { compress, decompress } from "./trie";
import * as fs from "fs";

const assertIdentity = (inputString: string) => {
  expect(decompress(compress(inputString))).toBe(inputString);
};

it("should parse big file correctly", () => {
  const test1 = fs.readFileSync("./__test__/test1.json", "utf8");
  fs.writeFileSync("./OUT", JSON.stringify(test1));
  assertIdentity(JSON.stringify(test1));
});

it("should handle edge cases around non-truthy values", () => {
  assertIdentity(String.fromCharCode(0)); // zero
  assertIdentity(""); // empty string
});

it("should parse small strings correctly", () => {
  assertIdentity(".");
  assertIdentity("abcdefghijklmnopqrstuvwxyz");
  assertIdentity(
    "         .   .   .   .   .   adsajvc a.kd.sa cvxzmt fcsa.kmt adxc;lawr ||"
  );
  assertIdentity("OOBAR");
  assertIdentity("OOBAROOBAROOBAR");
  assertIdentity("TOBETOBETOBETOBETOBETOBE");
});

it("should parse unicode correctly", () => {
  assertIdentity("😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😩🥺😢😭😤😠😡🤬🤯😳🥵");
});
