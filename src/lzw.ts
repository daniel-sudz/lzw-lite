import { bitPack, bitUnpack } from "./bitPack";

interface node {
  /** Emit code of sequence */
  code: number;
  /** Children query by byte value */
  children: {
    [key: number]: node | undefined;
  };
}

/**
 * Build initial 8-bit dictionary
 */
const buildDictionary = () => {
  const dictionary: any = {
    children: {},
  };
  for (let i = 0; i < 256; i++) {
    dictionary.children[i] = {
      code: i,
      children: {},
    };
  }
  return dictionary as node;
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
        code: currentCode,
        children: {},
      };
      currentCode++;
    }
  }
  return bitPack(emit);
};

interface reverseDictionary {
  /** Sequence code -> byte sequence */
  [key: number]: number[];
}

export const decompress = (codeArrayPacked: Uint8Array) => {
  const codeArray = bitUnpack(codeArrayPacked);
  const emit: number[] = [];
  let currentCode = 256;
  const dictionary: reverseDictionary = {};
  // Build intial dictionary
  for (let i = 0; i < 256; i++) {
    dictionary[i] = [i];
  }
  // iterate through code array
  for (let i = 0; i < codeArray.length; i++) {
    const curSequence = dictionary[codeArray[i]];
    const nextSequence = dictionary[codeArray[i + 1]];
    // next sequence cannot be decoded, first char must equal first char in current sequence
    if (nextSequence === undefined) {
      dictionary[currentCode] = [...curSequence, curSequence[0]];
    }
    // next sequence can be decoded
    else {
      dictionary[currentCode] = [...curSequence, nextSequence[0]];
    }
    emit.push(...curSequence);
    currentCode++;
  }
  return new TextDecoder().decode(Uint8Array.from(emit));
};
