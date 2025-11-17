export function handleFileError(
  err: Error,
  pathLike: boolean,
  line: string,
  callback: (value: string) => void,
) {
  if (pathLike) {
    console.error("Erro ao ler arquivo:", err.message);
    return;
  }

  try {
    callback(line);
  } catch (error_) {
    console.error("Erro ao processar input:", (error_ as Error).message);
  }
}
