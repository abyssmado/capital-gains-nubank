export function handleEscape(
  ch: string,
  start: () => void,
  end: () => void,
  escape: boolean,
): boolean {
  if (escape) {
    end();
    return true;
  }

  if (ch === "\\") {
    start();
    return true;
  }

  return false;
}

export function handleStringToggle(ch: string, toggle: () => void): boolean {
  if (ch === '"') {
    toggle();
    return true;
  }

  return false;
}

export function updateDepth(ch: string, depth: number): number {
  if (ch === "[") return depth + 1;
  if (ch === "]") return depth - 1;
  return depth;
}

export function shouldFlush(depth: number, buffer: string): boolean {
  return depth === 0 && buffer.trim().length > 0;
}

export function flushRemaining(buffer: string, callback: (v: string) => void): void {
  const trimmed = buffer.trim();
  if (trimmed) callback(trimmed);
}
