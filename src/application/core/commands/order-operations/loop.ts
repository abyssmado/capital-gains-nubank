import { FileProvider } from "../../../shared/providers/file/file.provider";

import { processFirstInput } from "./input/process-first";

export function startLoop(callback: (line: string) => void): void {
  console.log("Write the operations or point to the file containing them. \nCtrl+C to quit.\n");

  const fileProvider = new FileProvider();
  const stdin = process.stdin;
  stdin.setEncoding("utf8");

  stdin.on("data", function (chunk: string) {
    const line = chunk.trim();
    if (!line) return;
    processFirstInput(line, callback, fileProvider);
  });
}
