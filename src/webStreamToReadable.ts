import { Readable, ReadableOptions } from "stream";

/**
 * See https://github.com/comunica/readable-from-web.js/blob/main/lib/ReadableFromWeb.ts
 * MIT License
 */
class ReadableFromWeb<T> extends Readable {
    private readonly reader: ReadableStreamDefaultReader<T>;
    private readerClosed: boolean;

    public constructor(stream: ReadableStream<T>, options?: ReadableOptions) {
        super(options);
        this.reader = stream.getReader();
        this.readerClosed = false;
        this.reader.closed.then(() => {
            this.readerClosed = true;
        }).catch((error: Error) => {
            this.readerClosed = true;
            this.destroy(error);
        });
    }

    _destroy(error: Error | null, callback: (error?: Error | null) => void) {
        if (!this.readerClosed) {
            this.reader.cancel(error).then().finally(() => {
                this.readerClosed = true;
                this.reader.releaseLock();
            });
        }
        callback && callback(error);
    }


    public _read(): void {
        this.reader
        this.reader.read()
            .then(chunk => this.push(chunk.done ? null : chunk.value))
            .catch((error: Error) => this.destroy(error));
    }

}

export function webStreamToReadable<T>(stream: ReadableStream<T>, options?: ReadableOptions): Readable {
    return new ReadableFromWeb<T>(stream, options);
}
