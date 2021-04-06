/**
 * Builds a utf-16 char dictionary
 */
const buildDictionary = () => {
  const dictionary: { [key: string]: number | undefined } = {};
  for (let i = 0; i < 2 ** 16; i++) dictionary[String.fromCharCode(i)] = i; // build intial dictionary
  return dictionary;
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
  const dictionary = buildDictionary();
  let dictSize = 2 ** 16;
  const emit: number[] = []; // output array of words
  for (let i = 0; i < charArray.length; i++) {
    let partial = charArray[i];
    // find longest subset that already exists in dictionary
    while (i + 1 < charArray.length && dictionary[partial + charArray[i + 1]]) {
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
  const dictionary = buildDictionary();
};

//console.log(compress("TOBEORNOTTOBEORTOBEORNOT"));
