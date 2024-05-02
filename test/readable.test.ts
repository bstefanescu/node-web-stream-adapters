import { createReadableStreamFromAsyncIterable, createReadableStreamFromBuffer, createReadableStreamFromIterable, createReadableStreamFromReadable, createReadableStreamFromString } from "../src/index.js";
import { read, readFileSync } from "fs";
import { Readable } from "stream";
import { describe, test, expect } from "vitest";

describe("ReadableStream conversions", () => {
    test("Readable to ReadableStream", async () => {
        const buffer: Buffer = readFileSync("package.json");
        const stream = createReadableStreamFromReadable(Readable.from(buffer));
        const out: string[] = [];
        for await (const chunk of stream as unknown as AsyncIterable<Buffer>) {
            out.push(chunk.toString('utf8'));
        }
        expect(buffer.toString('utf8')).equals(out.join(''));
    })
    test("Buffer to ReadableStream", async () => {
        const buffer: Buffer = readFileSync("package.json");
        const stream = createReadableStreamFromBuffer(buffer);
        const out: string[] = [];
        for await (const chunk of stream as unknown as AsyncIterable<Buffer>) {
            out.push(chunk.toString('utf8'));
        }
        expect(buffer.toString('utf8')).equals(out.join(''));
    })
    test("String to ReadableStream", async () => {
        const buffer: string = readFileSync("package.json", "utf8");
        const stream = createReadableStreamFromString(buffer);
        const out: string[] = [];
        for await (const chunk of stream as unknown as AsyncIterable<string>) {
            out.push(chunk);
        }
        expect(buffer).equals(out.join(''));
    })
    test("Iterable to ReadableStream", async () => {
        const input: Array<string> = ["Hello", " ", "world", "!"];
        const stream = createReadableStreamFromIterable(input);
        const out: string[] = [];
        for await (const chunk of stream as unknown as AsyncIterable<string>) {
            out.push(chunk);
        }
        expect(input.join('')).equals(out.join(''));
    })
});