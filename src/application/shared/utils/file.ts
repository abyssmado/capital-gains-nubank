export function isPathLike(inputPath: string): boolean {
  return (
    /^\.{1,2}\//.test(inputPath) ||
    /[\\/]/.test(inputPath) ||
    inputPath.includes("\\")
  );
}
