import { Command } from "commander";

import { IDLE_TIMEOUT_MS } from "../../../shared/constants";
import { FileProvider } from "../../../shared/providers/file/file.provider";

import { processLine } from "./process-line";

export function createProcessCommand(
  stdinStream?: NodeJS.ReadableStream,
  FileProviderClass: any = FileProvider,
): Command {
  const cmd = new Command("process")
    .description("Process input: provide a file path or use '-' for stdin")
    .argument("[file]", "input file path or '-' for stdin")
    .action(async (file?: string) => {
      const fileProvider = new FileProviderClass();

      const feed = (content: string) => {
        const lines = content
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        for (const line of lines) {
          processLine(line);
        }
      };

      if (!file || file === "-") {
        console.log(
          "Write the operations or point to the file containing them. \nCtrl+C to quit.\n",
        );
        const stdin = stdinStream ?? process.stdin;
        let data = "";
        let idleTimer: NodeJS.Timeout | null = null;
        stdin.setEncoding?.("utf8");

        let resolvePromise: (() => void) | null = null;

        const cleanup = () => {
          if (idleTimer) {
            clearTimeout(idleTimer);
            idleTimer = null;
          }
          stdin.removeAllListeners("data");
          stdin.removeAllListeners("end");
          stdin.removeAllListeners("close");
          stdin.removeAllListeners("error");
        };

        const finish = () => {
          cleanup();
          feed(data);
          if (resolvePromise) {
            resolvePromise();
            resolvePromise = null;
          }
        };

        const onData = (chunk: string) => {
          data += chunk;
          if (idleTimer) clearTimeout(idleTimer);
          idleTimer = setTimeout(() => {
            idleTimer = null;
            finish();
          }, IDLE_TIMEOUT_MS);
        };

        const onEnd = () => finish();
        const onClose = () => finish();
        const onError = () => finish();

        await new Promise<void>((resolve) => {
          resolvePromise = resolve;
          stdin.on("data", onData);
          stdin.on("end", onEnd);
          stdin.on("close", onClose);
          stdin.on("error", onError);

          if ((stdin as any).readableEnded) {
            finish();
          }
        });
      } else {
        try {
          if (fileProvider.fileExists(file)) {
            const content = fileProvider.readFile(file);
            feed(content);
          } else {
            console.error(`File not found: ${file}`);
          }
        } catch (err) {
          console.error("Error reading file:", (err as Error).message);
        }
      }
    });

  return cmd;
}
