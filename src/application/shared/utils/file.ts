export function isPathLike(line: string): boolean {
  return (
    /^\.{1,2}\//.test(line) || // contains ./ or ../
    /[\\/]/.test(line) || // contains / or \
    /\.txt$/i.test(line) // finish with .txt
  );
}
