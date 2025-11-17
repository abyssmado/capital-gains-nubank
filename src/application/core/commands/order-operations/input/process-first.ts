import { isJsonLike, isPathLike } from "../../../../shared/utils";
import { handleFileError } from "../file/handlers/error.handler";
import { processFileContent } from "../file/process-file-content";

export function processFirstInput(
  line: string,
  callback: (value: string) => void,
  fileProvider: { readFile(path: string): string },
) {
  const normalized = line.replaceAll(/(^\s*['"])|(['"]\s*$)/g, "").trim();

  if (isJsonLike(normalized)) {
    callback(normalized);
    return;
  }

  const pathLike = isPathLike(normalized);

  try {
    const content = fileProvider.readFile(normalized);
    processFileContent(content, callback);
  } catch (err) {
    handleFileError(err as Error, pathLike, normalized, callback);
  }
}
