jest.mock("../process-line", () => {
  const fn = jest.fn();
  return { processLine: fn, default: fn };
});

jest.mock("../../../../shared/providers/file/file.provider", () => ({
  FileProvider: jest.fn().mockImplementation(() => ({
    fileExists: jest.fn().mockReturnValue(true),
    readFile: jest.fn().mockImplementation(() => "line1\n\nline2\n"),
  })),
}));

import { Readable } from "node:stream";

import { createProcessCommand, processLine } from "../index";

describe("createProcessCommand", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("reads file and feeds lines to processLine", async () => {
    const cmd = createProcessCommand();
    await cmd.parseAsync(["node", "test", "somefile.txt"]);

    expect(processLine).toHaveBeenCalledTimes(2);
    expect(processLine).toHaveBeenCalledWith("line1");
    expect(processLine).toHaveBeenCalledWith("line2");
  });

  test("reads stdin when '-' is provided", async () => {
    // Emit the data and let the stream end automatically to avoid multiple
    // push() calls which trigger SonarQube S7778.
    const input = Readable.from(["a\n\nb\n"]);

    const cmdWithStdin = createProcessCommand(input as unknown as NodeJS.ReadableStream);

    await cmdWithStdin.parseAsync(["node", "test", "-"]);

    expect(processLine).toHaveBeenCalledTimes(2);
    expect(processLine).toHaveBeenCalledWith("a");
    expect(processLine).toHaveBeenCalledWith("b");
  });
});
