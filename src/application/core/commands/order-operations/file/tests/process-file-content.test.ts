import { processFileContent } from "../process-file-content";

describe("processFileContent", () => {
  test("splits multiple JSON arrays in content and calls callback", () => {
    const content = "[1,2]\n[3,4]";
    const out: string[] = [];
    processFileContent(content, (v) => out.push(v));
    expect(out.length).toBe(2);
    expect(out[0]).toContain("[1,2]");
    expect(out[1]).toContain("[3,4]");
  });
});
