export function isJsonLike(inputString: string): boolean {
  const first = inputString.charAt(0);
  return first === "[" || first === "{";
}
