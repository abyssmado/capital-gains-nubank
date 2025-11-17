import { parseOperationPipe } from "../parse";

describe("parseOperationPipe", () => {
  test("parses JSON array string into operations", () => {
    const input = '[{"operation":"buy","unit-cost":1,"quantity":2}]';
    const res = parseOperationPipe(input);
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].operation).toBe("buy");
  });
});
