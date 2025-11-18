export function isPathLike(line: string): boolean {
  // Aceita caminhos que começam com ./ ou ../, ou que têm barras, ou terminam com .txt
  return (
    /^\.{1,2}\//.test(line) || // ./ ou ../
    /[\\/]/.test(line) || // barra ou contrabarra
    /\.txt$/i.test(line) // termina com .txt
  );
}
