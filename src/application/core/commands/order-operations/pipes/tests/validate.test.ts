import { InvalidArgumentError } from "commander";

import { validateOperationPipe } from "../validate";

describe("validateOperationPipe", () => {
  test("returns array when given array", () => {
    const arr: any[] = [];
    expect(validateOperationPipe(arr)).toStrictEqual(arr);
  });

  test("throws when given non-array", () => {
    expect(() => validateOperationPipe({} as any)).toThrow(InvalidArgumentError);
  });
});
