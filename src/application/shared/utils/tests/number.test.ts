import { toNumber } from "../number";

describe("toNumber", () => {
  test("parses numeric strings and numbers", () => {
    expect(toNumber("10")).toBe(10);
    expect(toNumber(5)).toBe(5);
    expect(toNumber("10.5")).toBeCloseTo(10.5);
  });

  test("throws for non-numeric values", () => {
    expect(() => toNumber("abc")).toThrow();
    expect(() => toNumber(undefined as any)).toThrow();
  });
});
