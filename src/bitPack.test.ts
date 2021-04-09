import { flipBit, readBit, bitsCounter, bitPack, bitUnpack } from "./bitPack";
import assert from "assert";

it("readBit works as expected", () => {
  const byte = 0b10101001;
  expect(readBit(byte, 0)).toBe(true);
  expect(readBit(byte, 1)).toBe(false);
  expect(readBit(byte, 2)).toBe(false);
  expect(readBit(byte, 3)).toBe(true);
  expect(readBit(byte, 4)).toBe(false);
  expect(readBit(byte, 5)).toBe(true);
  expect(readBit(byte, 6)).toBe(false);
  expect(readBit(byte, 7)).toBe(true);
});

it("flipBit works as expected", () => {
  const byte = 0b10101001;
  expect(flipBit(byte, 0)).toBe(0b10101000);
  expect(flipBit(byte, 1)).toBe(0b10101011);
  expect(flipBit(byte, 2)).toBe(0b10101101);
  expect(flipBit(byte, 3)).toBe(0b10100001);
  expect(flipBit(byte, 4)).toBe(0b10111001);
  expect(flipBit(byte, 5)).toBe(0b10001001);
  expect(flipBit(byte, 6)).toBe(0b11101001);
  expect(flipBit(byte, 7)).toBe(0b00101001);
});

it("bitsCounter works as expected", () => {
  const accumulate = (generator: Generator<any>) => {
    let total = 0;
    for (const item of generator) {
      total += item;
    }
    return total;
  };
  expect(accumulate(bitsCounter(0))).toBe(0);
  expect(accumulate(bitsCounter(1))).toBe(8);
  expect(accumulate(bitsCounter(2))).toBe(17);
  expect(accumulate(bitsCounter(3))).toBe(26);
  expect(accumulate(bitsCounter(258))).toBe(2322); // calculated from excel
  expect(accumulate(bitsCounter(259))).toBe(2332); // calculated from excel
  expect(accumulate(bitsCounter(769))).toBe(7432); // calculated from excel
  expect(accumulate(bitsCounter(770))).toBe(7443); // calculated from excel
  expect(accumulate(bitsCounter(771))).toBe(7454); // calculated from excel
});

it("bitPack works as expected", () => {
  const assertUint8ArrayEquals = (Uint8: Uint8Array, assertArray: number[]) => {
    const toNumberArray = Array.from(Uint8);
    assert.deepStrictEqual(toNumberArray, assertArray);
  };
  assertUint8ArrayEquals(bitPack([]), []);
  assertUint8ArrayEquals(bitPack([0]), [0]);
  assertUint8ArrayEquals(bitPack([0, 0]), [0, 0, 0]);
  assertUint8ArrayEquals(bitPack([1, 1, 1]), [1, 1, 2, 0]); // manual calculation
});

it("bitUnpack works as expected", () => {
  assert.deepStrictEqual(bitUnpack(Uint8Array.from([1, 1, 2, 0])), [1, 1, 1]);
});

it("integration test for bitPack/bitUnpack", () => {
  const assertIdentity = (codeArray: number[]) => {
    assert.deepStrictEqual(bitUnpack(bitPack(codeArray)), codeArray);
  };
  assertIdentity([]);
  assertIdentity([0]);
  assertIdentity([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assertIdentity([255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265]);
});
