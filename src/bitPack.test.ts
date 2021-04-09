import { flipBit, readBit, bitsCounter, bitPack } from "./bitPack";

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
