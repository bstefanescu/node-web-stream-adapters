import { Readable } from "stream";

/**
 * Create a ReadableStream frpom an iterable.
 * ON node 20 there is a ReadableStream.from fucntion to do it. But not on node 18
 * When studio server is moved to node 20 we can remove this fucntion
 * @param iterable
 * @returns
 */
export function createReadableStreamFromAsyncIterable<T = string | Buffer>(iterable: AsyncIterable<T>): ReadableStream<T> {
    return createReadableStreamFromIterator(iterable[Symbol.asyncIterator]());
}

export function createReadableStreamFromIterable<T = string | Buffer>(iterable: Iterable<T>): ReadableStream<T> {
    return createReadableStreamFromIterator(iterable[Symbol.iterator]());
}

export function createReadableStreamFromIterator<T = string | Buffer>(it: AsyncIterator<T> | Iterator<T>): ReadableStream<T> {
    //const it = iterable[Symbol.asyncIterator]();
    if ((ReadableStream as any).from) {
        return (ReadableStream as any).from(it) as ReadableStream<T>;
    } else {
        return new ReadableStream<T>({
            async pull(controller) {
                const { value, done } = await it.next();
                if (done) {
                    controller.close();
                } else {
                    controller.enqueue(value);
                }
            },
            cancel() {
                it.return?.();
            }
        });
    }
}

export function createReadableStreamFromString(value: string): ReadableStream<string> {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(value);
            controller.close();
        },
    });
}
export function createReadableStreamFromBuffer(value: Buffer): ReadableStream<Buffer> {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(value);
            controller.close();
        },
    });
}
export function createReadableStreamFromReadable(stream: Readable): ReadableStream<string | Buffer> {
    return createReadableStreamFromAsyncIterable(stream);
}

// shorter names
const asyncIterableToWebStream = createReadableStreamFromAsyncIterable;
const iterableToWebStream = createReadableStreamFromIterable;
const iteratorToWebStream = createReadableStreamFromIterator
const stringToWebStream = createReadableStreamFromString;
const bufferToWebStream = createReadableStreamFromBuffer;
const readableToWebStream = createReadableStreamFromReadable;

export {
    asyncIterableToWebStream,
    iterableToWebStream,
    iteratorToWebStream,
    stringToWebStream,
    bufferToWebStream,
    readableToWebStream
}