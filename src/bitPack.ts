/**
 * Inverts bit for given position
 * Indexed 0-7 (right-left)
 * https://medium.com/@parkerjmed/practical-bit-manipulation-in-javascript-bfd9ef6d6c30
 */
export const flipBit = (byte: number, pos: number) => byte ^ (1 << pos);

/**
 * Returns true if bit is set for given position
 * Indexed 0-7 (right-left)
 */
export const readBit = (byte: number, pos: number) => !!(byte & (1 << pos));

export function* bitsCounter(totalCycles: number) {
  let codeRangeUpperBound = 255; // initial dictionary is built from 0-255
  let currentCode = 255;
  let currentBitsNeeded = 8;
  let cycleCount = 0;
  while (true) {
    if (currentCode > codeRangeUpperBound) {
      currentBitsNeeded++;
      codeRangeUpperBound *= 2;
    }
    currentCode++;
    cycleCount++;
    yield currentBitsNeeded;
    if (cycleCount === totalCycles) break;
  }
}

/** Pack an LZW code array efficiently into bits */
export const bitPack = (codeArray: number[]): Uint8Array => {
  /**
   * Calculate total bits needed to pack code array
   */
  let counter = bitsCounter(codeArray.length - 1);
  let totalBitsNeeded = 0;
  for (const bitLength of counter) {
    totalBitsNeeded += bitLength;
  }
  // pre-allocate uint8-byte array
  const buffer = new Uint8Array(Math.ceil(totalBitsNeeded / 8));

  counter = bitsCounter(codeArray.length - 1); // reset counter
  let i = 0;
  let currentByte = 0;
  let currentBit = 0;
  for (const bitLength of counter) {
    const code = codeArray[i];
    for (let bitPos = 0; bitPos < bitLength; bitPos++) {
      if (currentBit === 8) {
        currentByte++;
        currentBit = 0;
      }
      // copy over bit to buffer
      if (readBit(code, bitPos)) {
        buffer[currentByte] = flipBit(buffer[currentByte], bitPos);
      }
    }
    i++;
  }
  return buffer;
};
