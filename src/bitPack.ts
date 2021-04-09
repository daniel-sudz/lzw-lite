/**
 * Flips bit position of number
 * https://medium.com/@parkerjmed/practical-bit-manipulation-in-javascript-bfd9ef6d6c30
 */
const flipBit = (byte: number, pos: number) => byte ^ (1 << (pos - 1));

/** Pack an LZW code array efficiently into bits */
export const bitPack = (codeArray: number[]) => {
  /**
   * Calculate total bytes needed to pack code array
   */
  let codeRange = 255; // initial dictionary is built from 0-255
  let totalBitsNeeded = 0;
  for (let i = 0; i < codeArray.length; i++) {
    totalBitsNeeded += calculateBitsNeeded(codeRange);
    codeRange++;
  }
  // pre-allocate uint8-byte array
  const buffer = new Uint8Array(Math.ceil(totalBitsNeeded / 8));
  let currentByte = 0;
  let currentBit = 0;

  for (let i = 0; i < codeArray.length; i++) {
    const code = codeArray[i];
  }
};

/** Finds leftmost bit by bitshifting by one (ceil(log base 2) + 1 effectively)
 *  This is very slow (about 100x slower than Math.log2)
 *  However, Math.log2 is imprecise for certain inputs due to floating point errors and cannot be used
 */
export const calculateBitsNeeded = (code: number) => {
  /**
   * In JS, numbers are cast to 32-bit (signed) ints for bit-wise operators
   * Regardless, such large codes would make the algo useless without a dictionary reset
   */
  if (code >= 2 ** 31) {
    throw "code > 31 bits";
  }
  let bitsNeeded = 1;
  while ((code >>= 1)) {
    bitsNeeded++;
  }
  return bitsNeeded;
};
