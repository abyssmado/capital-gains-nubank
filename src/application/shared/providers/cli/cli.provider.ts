import type { CliProviderInterface } from "./cli.provider.interface";
import { Command } from "commander";

export class CliProvider implements CliProviderInterface {
  private readonly cliClient;

  constructor() {
    this.cliClient = new Command()
      .name("capital-gains")
      .description("CLI provider for Capital Gains application")
      .version("1.0.0");
  }

  registerCommand(command: Command): void {
    this.cliClient.addCommand(command);
  }

  registerCommands(commands: Command[]): void {
    for (const command of commands) {
      this.cliClient.addCommand(command);
    }
  }

  run(): void {
    this.cliClient.parse();
  }
}
