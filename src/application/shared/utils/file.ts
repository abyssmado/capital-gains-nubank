export function isPathLike(line: string): boolean {
  const invalidChars = /(^\.|\\|\/|:\\|:)/;
  return invalidChars.test(line) || /\.txt$/i.test(line);
}
