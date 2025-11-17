import { validateOperationPipe } from "../validate";
import { InvalidArgumentError } from "commander";

describe("validateOperationPipe", () => {
  test("returns array when given array", () => {
    const arr: any[] = [];
    expect(validateOperationPipe(arr)).toBe(arr);
  });

  test("throws when given non-array", () => {
    expect(() => validateOperationPipe({} as any)).toThrow(InvalidArgumentError);
  });
});
