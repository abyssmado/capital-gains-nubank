export function handleEscape(
  character: string,
  start: () => void,
  end: () => void,
  escape: boolean,
): boolean {
  if (escape) {
    end();
    return true;
  }

  if (character === "\\") {
    start();
    return true;
  }

  return false;
}

export function handleStringToggle(character: string, toggle: () => void): boolean {
  if (character === '"') {
    toggle();
    return true;
  }

  return false;
}

export function updateDepth(character: string, currentDepth: number): number {
  if (character === "[") return currentDepth + 1;
  if (character === "]") return currentDepth - 1;
  return currentDepth;
}

export function shouldFlush(currentDepth: number, bufferContent: string): boolean {
  return currentDepth === 0 && bufferContent.trim().length > 0;
}

export function flushRemaining(bufferContent: string, callback: (value: string) => void): void {
  const trimmed = bufferContent.trim();
  if (trimmed) callback(trimmed);
}
