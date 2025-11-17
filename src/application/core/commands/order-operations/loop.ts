import { FileProvider } from "../../../shared/providers/file/file.provider";
import { processFirstInput } from "./input/process-first";

export function startLoop(callback: (line: string) => void): void {
  console.log("Write the operations or point to the file containing them. \n Ctrl+C to quit. \n");

  const fileProvider = new FileProvider();
  let first = true;

  const stdin = process.stdin;
  stdin.setEncoding("utf8");

  stdin.on("data", function (chunk: string) {
    const line = chunk.trim();
    if (!line) return;

    if (first) {
      first = false;
      processFirstInput(line, callback, fileProvider);
      return;
    }

    callback(line);
  });
}
