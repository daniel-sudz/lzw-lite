interface node {
  code: number;
  children: {
    [key: number]: node | undefined;
  };
}

export const compress = (inputString: string) => {
  const uint8Array = new TextEncoder().encode(inputString);
  const dictionary: node = {
    code: 0,
    children: {},
  };
  // build initial 8-bit dictionary
  for (let i = 0; i < 256; i++) {
    dictionary.children[i] = {
      code: i,
      children: {},
    };
  }
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

compress("😆😆");
