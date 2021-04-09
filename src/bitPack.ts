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

/**
 * Generator that yields the number of bits needed to store an LZW code
 */
export function* bitsCounter(totalCycles: number) {
  let codeRangeUpperBound = 255; // initial dictionary is built from 0-255
  let currentCode = 255;
  let currentBitsNeeded = 8;
  let cycleCount = 0;
  while (true) {
    if (currentCode > codeRangeUpperBound) {
      currentBitsNeeded++;
      codeRangeUpperBound = 2 * codeRangeUpperBound + 1;
    }
    currentCode++;
    if (cycleCount === totalCycles) break;
    yield currentBitsNeeded;
    cycleCount++;
  }
}

/** Pack an LZW code array efficiently into a byte array */
export const bitPack = (codeArray: number[]): Uint8Array => {
  /**
   * Calculate total bits needed to pack code array
   */
  let counter = bitsCounter(codeArray.length);
  let totalBitsNeeded = 0;
  for (const bitLength of counter) {
    totalBitsNeeded += bitLength;
  }
  // pre-allocate uint8-byte array
  const buffer = new Uint8Array(Math.ceil(totalBitsNeeded / 8));

  counter = bitsCounter(codeArray.length); // reset counter
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
        buffer[currentByte] = flipBit(buffer[currentByte], currentBit);
      }
      currentBit++;
    }
    i++;
  }
  return buffer;
};

/** Unpack a byte array into LZW codes */
export const bitUnpack = (byteArray: Uint8Array) => {
  let currentByte = 0;
  let currentBit = 0;
  const emit: number[] = [];
  const counter = bitsCounter(Infinity);
  while (currentByte !== byteArray.length) {
    const bitLength = counter.next().value as number; // iterators for generators in for...of loops get made ahead of time which crashes the process if you use an inifinite generator
    let currentCode = 0;
    for (let i = 0; i < bitLength; i++) {
      if (currentBit === 8) {
        currentByte++;
        currentBit = 0;
        if (currentByte === byteArray.length) return emit;
      }
      if (readBit(byteArray[currentByte], currentBit)) {
        currentCode = currentCode | (1 << i);
      }
      currentBit++;
    }
    emit.push(currentCode);
  }
  return emit;
};
