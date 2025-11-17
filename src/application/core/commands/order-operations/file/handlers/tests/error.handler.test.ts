import { handleFileError } from "../error.handler";

describe("handleFileError", () => {
  test("logs error when pathLike is true", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    handleFileError(new Error("nope"), true, "./x.txt", () => {});
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("calls callback when pathLike is false", () => {
    const calls: string[] = [];
    handleFileError(new Error("nope"), false, "[1]", (v) => calls.push(v));
    expect(calls).toEqual(["[1]"]);
  });
});
