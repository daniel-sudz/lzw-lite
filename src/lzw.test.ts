/**
 * @jest-environment node
 */

import { compress, decompress } from "./lzw";
import * as fs from "fs";

const assertIdentity = (inputString: string) => {
  expect(decompress(compress(inputString))).toBe(inputString);
};

it("should parse big file correctly", () => {
  const test1 = fs.readFileSync("./__test__/test1.json", "utf8");
  const test2 = fs.readFileSync("./__test__/test2.json", "utf8");
  const test3 = fs.readFileSync("./__test__/test3.json", "utf8");
  const test4 = fs.readFileSync("./__test__/test4.json", "utf8");
  const test5 = fs.readFileSync("./__test__/test5.json", "utf8");
  [test1, test2, test3, test4, test5].forEach((test) => {
    assertIdentity(test);
  });
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
