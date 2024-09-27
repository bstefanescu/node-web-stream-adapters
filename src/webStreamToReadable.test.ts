import { text } from "stream/consumers";
import { describe, expect, test } from "vitest";
import { stringToWebStream } from "./readableToWebStream";
import { webStreamToReadable } from "./webStreamToReadable";

describe("webStreamToReadable", () => {
    test("conversion", async () => {
        const ws = stringToWebStream("hello, world!");;
        const readable = webStreamToReadable(ws);
        const result = await text(readable); // from stream/consumers
        expect(result).toEqual("hello, world!");
    });
});
