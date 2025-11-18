export function isPathLike(inputPath: string): boolean {
  return (
    /^\.{1,2}\//.test(inputPath) || // contains ./ or ../
    /[\\/]/.test(inputPath) || // contains / or \
    inputPath.includes("\\")
  );
}
