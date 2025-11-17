import { FileProvider } from "../file.provider";
import fs from "node:fs";

describe("FileProvider", () => {
  const out = "./stdout/test-output.txt";
  let writeSpy: jest.SpyInstance;
  let readSpy: jest.SpyInstance;

  beforeEach(() => {
    writeSpy = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    readSpy = jest.spyOn(fs, "readFileSync").mockImplementation(() => "hello\n");
  });

  afterEach(() => {
    writeSpy.mockRestore();
    readSpy.mockRestore();
  });

  test("writeFile and readFile (using spies)", () => {
    const provider = new FileProvider();
    provider.writeFile(out, "hello\n");
    expect(writeSpy).toHaveBeenCalledWith(out, "hello\n");

    const content = provider.readFile(out);
    expect(readSpy).toHaveBeenCalledWith(out, "utf-8");
    expect(content).toBe("hello\n");
  });
});
