import fs from "node:fs";

import type { FileProviderInterface } from "./file.provider.interface";

export class FileProvider implements FileProviderInterface {
  private readonly fileClient;

  constructor() {
    this.fileClient = fs;
  }

  writeFile(path: string, data: string): void {
    this.fileClient.writeFileSync(path, data);
  }

  readFile(path: string): string {
    return this.fileClient.readFileSync(path, "utf-8");
  }

  createFile(filePath: string): void {
    this.fileClient.closeSync(this.fileClient.openSync(filePath, "w"));
  }

  fileExists(filePath: string): boolean {
    return this.fileClient.existsSync(filePath);
  }
}
