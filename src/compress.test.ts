import { test1 } from "../__test__/test1";
import { compress, decompress, buildDictionary } from "./index";

const assertIdentity = (inputString: string) => {
  expect(decompress(compress(inputString))).toBe(inputString);
};

it("should parse big file correctly", () => {
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

it("dictionary should handle unicode", () => {
  const charArray = [
    ..."😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😩🥺😢😭😤😠😡🤬🤯😳🥵",
  ];
  const newDict = buildDictionary() as { [key: string]: any };
  charArray.forEach((char) => {
    console.log(char);
    expect(newDict[char]).not.toEqual(undefined);
  });
});

it("should parse unicode correctly", () => {
  assertIdentity("😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘😩🥺😢😭😤😠😡🤬🤯😳🥵");
});

it("should encode and decode symetrically for big file", () => {
  const input = JSON.stringify(test1);
  const compressed = compress(input);
  const decompressed = decompress(compressed);
  expect(decompressed).toBe(input);
});
