export function isJsonLike(line: string): boolean {
  const first = line.charAt(0);
  return first === "[" || first === "{";
}
