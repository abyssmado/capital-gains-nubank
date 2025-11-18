import { isJsonLike, isPathLike } from "../../../../shared/utils";
import { handleFileError } from "../file/handlers/error.handler";
import { processFileContent } from "../file/process-file-content";

export function processFirstInput(
  line: string,
  callback: (value: string) => void,
  fileProvider: { readFile(path: string): string; fileExists?(path: string): boolean },
) {
  const normalized = line.replaceAll(/(^\s*['"])|(['"]\s*$)/g, "").trim();

  if (isJsonLike(normalized)) {
    callback(normalized);
    return;
  }
  const pathLike = isPathLike(normalized);

  // If the input looks like a path and the file exists, read and process it.
  // Otherwise, if it looks like a path but doesn't exist, report the file
  // error. If it doesn't look like a path, treat it as an operation input.
  // If the provider offers a fileExists method, prefer it to avoid throwing
  // when the file doesn't exist. Otherwise, try to read and catch errors.
  if (typeof fileProvider.fileExists === "function") {
    try {
      if (fileProvider.fileExists(normalized)) {
        const content = fileProvider.readFile(normalized);
        processFileContent(content, callback);
        return;
      }
    } catch (err) {
      handleFileError(err as Error, pathLike, normalized, callback);
      return;
    }

    if (pathLike) {
      // Looks like a path but file doesn't exist.
      handleFileError(new Error("File not found"), pathLike, normalized, callback);
      return;
    }
  } else {
    // No fileExists support; attempt to read and handle errors.
    try {
      const content = fileProvider.readFile(normalized);
      processFileContent(content, callback);
      return;
    } catch (err) {
      handleFileError(err as Error, pathLike, normalized, callback);
      return;
    }
  }

  // Not JSON-like and not a path => treat as operation line.
  callback(normalized);
}
