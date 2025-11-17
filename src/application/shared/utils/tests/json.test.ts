import { isJsonLike } from "../json";

describe("isJsonLike", () => {
  test("recognizes arrays and objects", () => {
    expect(isJsonLike("[1,2]" as any)).toBe(true);
    expect(isJsonLike('{"a":1}' as any)).toBe(true);
  });

  test("rejects non-json-like strings", () => {
    expect(isJsonLike("./stdin/input.txt")).toBe(false);
    expect(isJsonLike("hello")).toBe(false);
  });
});
