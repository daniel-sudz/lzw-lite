// http://warp.povusers.org/EfficientLZW/part3.html
// Optimizing for dynamic bit sizes

interface node {
  /** Emit code of sequence */
  code: number;
  /** Children query by sequence code */
  children: {
    [key: number]: node | undefined;
  };
}

interface nodeReverse {
  byteValue: number;
  /** Children query by byte value */
  children: {
    [key: number]: node | undefined;
  };
}

/**
 * Build initial 8-bit dictionary
 */
const buildDictionary = (reverse: boolean = false) => {
  const dictionary: any = {
    children: {},
  };
  for (let i = 0; i < 256; i++) {
    dictionary.children[i] = {
      [reverse ? "byteValue" : "code"]: i,
      children: {},
    };
  }
  return dictionary as node | nodeReverse;
};

export const compress = (inputString: string) => {
  const uint8Array = new TextEncoder().encode(inputString);
  const dictionary = buildDictionary() as node;
  let currentCode = 256;
  const emit: number[] = [];
  // iterate through byte array
  for (let i = 0; i < uint8Array.length; i++) {
    // find longest subset of current byte sequence in trie
    let currentByte = dictionary.children[uint8Array[i]];
    while (currentByte!.children[uint8Array[i + 1]] !== undefined) {
      currentByte = currentByte!.children[uint8Array[i + 1]];
      i++;
    }
    // emit code of found sequence
    emit.push(currentByte!.code);
    // push sequence + next byte to dictionary
    if (i + 1 < uint8Array.length) {
      currentByte!.children[uint8Array[i + 1]] = {
        code: currentCode + 1,
        children: {},
      };
      currentCode++;
    }
  }
  console.log(emit);
};

export const decompress = (codeArray: number[]) => {
  const dictionary = buildDictionary() as node;
};

compress("😆😆😆😆😆😆");
