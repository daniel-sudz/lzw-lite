/**
 *  LZW simple/concise text encoding
 *
 *  implementation based on high level overview from https://en.wikipedia.org/wiki/Lempel-Ziv-Welch
 *
 *  Constant-width (1) codes are used for simplicity
 */
export const compress = (
  inputString: string,
  textEncoding: "utf8" | "utf16" = "utf8"
) => {
  let dictSize = textEncoding === "utf8" ? 2 ** 8 : 2 ** 16;
  const charArray = [...inputString];
  const dictionary: { [key: string]: number | undefined } = {};
  for (let i = 0; i < dictSize; i++) dictionary[String.fromCharCode(i)] = i; // build intial dictionary
  const emit: number[] = []; // output array of words
  for (let i = 0; i < charArray.length; i++) {
    let partial = charArray[i];
    const nextChar = charArray[i + 1];
    // find longest subset that already exists in dictionary
    while (charArray[i + 1] && dictionary[partial + charArray[i + 1]]) {
      partial += charArray[i + 1];
      i++;
    }
    emit.push(dictionary[partial] as number); // emit word
    if (charArray[i + 1]) dictionary[partial + charArray[i + 1]] = dictSize; // add word + 1 to dictionary
    dictSize++;
  }
  return emit;
};

console.log(compress("TOBEORNOTTOBEORTOBEORNOT"));
