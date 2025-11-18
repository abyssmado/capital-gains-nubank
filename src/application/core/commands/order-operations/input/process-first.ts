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
      handleFileError(new Error("File not found"), pathLike, normalized, callback);
      return;
    }
  } else {
    try {
      const content = fileProvider.readFile(normalized);
      processFileContent(content, callback);
      return;
    } catch (err) {
      handleFileError(err as Error, pathLike, normalized, callback);
      return;
    }
  }

  callback(normalized);
}
