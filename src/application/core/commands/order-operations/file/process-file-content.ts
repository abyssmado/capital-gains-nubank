import {
  handleEscape,
  handleStringToggle,
  updateDepth,
  shouldFlush,
  flushRemaining,
} from "./helpers/split.helpers";

export function processFileContent(content: string, callback: (value: string) => void) {
  let buffer = "";
  let depth = 0;
  let inString = false;
  let escape = false;

  for (const ch of content) {
    buffer += ch;

    if (
      handleEscape(
        ch,
        () => (escape = true),
        () => (escape = false),
        escape,
      )
    ) {
      continue;
    }

    if (handleStringToggle(ch, () => (inString = !inString))) {
      continue;
    }

    if (inString) continue;

    depth = updateDepth(ch, depth);

    if (shouldFlush(depth, buffer)) {
      callback(buffer.trim());
      buffer = "";
    }
  }

  flushRemaining(buffer, callback);
}
