import type { Command } from "commander";

export interface CliProviderInterface {
  registerCommand(command: Command): void;
  registerCommands(commands: Command[]): void;
  run(): void;
}
