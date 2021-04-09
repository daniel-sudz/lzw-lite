# LZW Lite
A tiny, text-based LZW implementation for JS with built-in optimizations. Useful for IndexDB storage with minimal overhead. 

# Why you should use lzw-lite

1) ✅ Uses native TextEncoder/TextDecoder and Uint8Arrays which makes it input-agnostic 
2) ✅ Full support for unicode/emoji character range
3) ✅ Utilizes a <a href="http://warp.povusers.org/EfficientLZW/part3.html"> dynamic bit size </a> optimization to squeeze out a few extra bytes

# Getting started

```bash
npm i lzw-lite
```

```js
import {compress, decompress} from "lzw-lite"; 

/** Convert string -> Uint8Array to store in IndexDB */
const mystringToCompress = "insert string here"; 
const compressed: Uint8Array = compress(mystringToCompress);

/** Convert Uint8Array -> string to get original value back */
const myOriginalString = decompress(compressed);
```

# Missing Optimizations/Problems

1) Dictionary resets for large files 
2) For large files (~1GB+), there is a chance that the dictionary will exceed ```2 ** 31``` which will cause an overflow in bit-shift operations.
3) TLDR: do not use the library with large files as it has not been optimized for this use-case. 

# Note on future use

Eventually, the <a href="https://chromestatus.com/feature/5855937971617792"> CompressionStream and DecompressionStream API from Google </a> will hopefully land in most browsers which will provide a native GZIP library in the browser. 

For now, the API's are only avaliable on latest Chrome versions and there are no plans from other browsers (so far) to support them. 

# Other, similar libraries

https://github.com/pieroxy/lz-string/blob/master/libs/lz-string.min.js (4.61 KB min)
