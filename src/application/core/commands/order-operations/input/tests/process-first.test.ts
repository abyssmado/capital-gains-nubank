import { processFirstInput } from "../process-first";

describe("processFirstInput", () => {
  test("handles JSON-like input directly", () => {
    const calls: string[] = [];
    processFirstInput("[1,2]", (v) => calls.push(v), { readFile: () => "" });
    expect(calls).toEqual(["[1,2]"]);
  });

  test("reads file when path provided", () => {
    const calls: string[] = [];
    const fakeProvider = { readFile: () => "[9]" };
    processFirstInput("./some/path.txt", (v) => calls.push(v), fakeProvider);
    expect(calls).toEqual(["[9]"]);
  });

  test("falls back to callback when read fails and not path-like", () => {
    const calls: string[] = [];
    const fakeProvider = {
      readFile: () => {
        throw new Error("enoent");
      },
    };

    processFirstInput("[abc]", (v) => calls.push(v), fakeProvider);
    expect(calls).toEqual(["[abc]"]);
  });
});
