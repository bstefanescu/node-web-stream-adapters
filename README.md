# node-web-stream-adapters

Utilities to convert Node.js Readable ans Writable streams to web ReadableStream and WritableStream streams.

These helpers are are usefull since `Readable.toWeb`, `Readable.toWeb`, `Writable.toWeb` and `Writable.fromWeb` are experimentals as of Node.js version 22.

##Usage:

```
npm i node-readable-stream
```

```
import fs from "fs";
import { toReadableStream } from "node-readable-stream";

const buffer = readFileAsync('some-file');
const stream = createReadableStreamFromReadable(Readable.from(buffer));
// or
const stream = createReadableStreamFromBuffer(buffer);
```
