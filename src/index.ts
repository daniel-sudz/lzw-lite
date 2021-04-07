// NOTE
// BLOB NOT SUPPORTED ON SAFARI
// HAVE TO USE ARRAY BUFFER
// https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/indexeddb-best-practices
// https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers

/**
 * Builds a utf-16 char dictionary
 */
export const buildDictionary = (reverse: boolean = false) => {
  const dictionary: any = {};
  if (reverse) {
    for (let i = 0; i < 2 ** 16; i++) dictionary[i] = String.fromCharCode(i); // build intial dictionary
    return dictionary as { [key: number]: string | undefined };
  }
  for (let i = 0; i < 2 ** 16; i++) dictionary[String.fromCharCode(i)] = i; // build intial dictionary
  return dictionary as { [key: string]: number | undefined };
};

/**
 *  LZW simple/concise text encoding
 *
 *  implementation based on high level overview from https://en.wikipedia.org/wiki/Lempel-Ziv-Welch
 *
 *  Constant-width (1) codes are used for simplicity
 */
export const compress = (inputString: string) => {
  const charArray = [...inputString];
  const dictionary = buildDictionary() as { [key: string]: number | undefined };
  let dictSize = 2 ** 16;
  const emit: number[] = []; // output array of words
  for (let i = 0; i < charArray.length; i++) {
    let partial = charArray[i];
    // find longest subset that already exists in dictionary
    while (
      i + 1 < charArray.length &&
      dictionary[partial + charArray[i + 1]] != undefined
    ) {
      partial += charArray[i + 1];
      i++;
    }
    emit.push(dictionary[partial] as number); // emit word
    if (i + 1 < charArray.length)
      dictionary[partial + charArray[i + 1]] = dictSize; // add word + 1 to dictionary
    dictSize++;
  }
  return emit;
};

export const decompress = (inputBuffer: number[]) => {
  let output = "";
  let dictSize = 2 ** 16;
  const dictionary = buildDictionary(true) as {
    [key: number]: string | undefined;
  };
  // console.log(inputBuffer);
  for (let i = 0; i < inputBuffer.length; i++) {
    const curWord = dictionary[inputBuffer[i]] as string;
    const nextWord = dictionary[inputBuffer[i + 1]];
    output += curWord;
    // next string can be decoded
    if (nextWord != undefined) {
      dictionary[dictSize] = curWord + nextWord.charAt(0);
    }
    // next string cannot be decoded, must be in current iteration
    else {
      dictionary[dictSize] = curWord + curWord.charAt(0);
    }
    dictSize++;
  }
  return output;
};
