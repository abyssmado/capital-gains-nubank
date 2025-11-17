export interface FileProviderInterface {
  readFile(filePath: string, options?: BufferEncoding): string;
  writeFile(filePath: string, data: string): void;
  createFile(filePath: string): void;
  fileExists(filePath: string): boolean;
}
