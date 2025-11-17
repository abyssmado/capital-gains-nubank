import { isPathLike } from "../file";

describe("isPathLike", () => {
  test("detects path-like strings", () => {
    expect(isPathLike("./stdin/input.txt")).toBe(true);
    expect(isPathLike(String.raw`C:\temp\file.txt`)).toBe(true);
    expect(isPathLike("/absolute/path")).toBe(true);
    expect(isPathLike("file.txt")).toBe(true);
  });

  test("rejects non-path strings", () => {
    expect(isPathLike("[1,2]" as any)).toBe(false);
    expect(isPathLike("hello/world")).toBe(true);
  });
});
